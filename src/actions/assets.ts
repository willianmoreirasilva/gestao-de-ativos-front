"use server";

import { revalidatePath } from "next/cache";

import { getServerApi } from "@/lib/server-api";
import { UpdateAssetInput, UpdateAssetSchema } from "@/schemas/assets";

interface MutationResponse {
    error?: string;
    fieldErrors?: { [key: string]: string[] };
}

interface ActionResponse {
    success: boolean;
    error?: string;
    fieldErrors?: { [key: string]: string[] };
}

/**
 * Atualiza parcialmente ou totalmente qualquer ativo via PATCH
 */
export async function updateAssetAction(
    assetId: string,
    payload: UpdateAssetInput,
): Promise<ActionResponse> {
    try {
        const api = await getServerApi();

        // 🌟 Validação prévia com o Schema do Servidor para evitar submits corrompidos
        const validatedFields = UpdateAssetSchema.safeParse(payload);
        if (!validatedFields.success) {
            return {
                success: false,
                error: "Dados do formulário inválidos.",
                fieldErrors: validatedFields.error.flatten().fieldErrors as any,
            };
        }

        // 🌟 Alterado de .put para .patch para respeitar atualizações parciais
        await api.patch(`/api/assets/${assetId}`, validatedFields.data);

        // Força o Next.js a purgar o cache mantendo o usuário na página atualizada
        revalidatePath("/assets/computers");
        revalidatePath(`/assets/computers/${assetId}`);

        return { success: true };
    } catch (error: any) {
        console.error(`[UPDATE_ASSET_ACTION_ERROR]:`, error);

        // Retorna erros estruturados do banco ou mensagens amigáveis da API
        return {
            success: false,
            error:
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                "Erro ao salvar as alterações no servidor (Status 404/500).",
            fieldErrors: error?.response?.data?.fieldErrors || null,
        };
    }
}

// 🛠️ Troca rápida de IP no modal (Apenas IP)
export async function updateAssetOnlyIpAction(
    id: string,
    newIpId: UpdateAssetInput["newIpId"],
): Promise<MutationResponse> {
    try {
        const api = await getServerApi();
        await api.patch(`/api/assets/${id}`, { newIpId });

        revalidatePath(`/assets/computers/${id}`);
        revalidatePath("/assets/computers");

        return {};
    } catch (error: any) {
        if (error.response?.data?.fieldErrors) {
            return { fieldErrors: error.response.data.fieldErrors };
        }
        return {
            error:
                error.response?.data?.error ||
                "Não foi possível vincular o IP informado.",
        };
    }
}

// 🔍 ATUALIZADA: Busca o IP, valida correspondência exata e valida o escopo do Tipo de Rede (VLAN)
export async function findIpByAddressAction(
    address: string,
    expectedVlanType:
        | "GENERAL_DATA"
        | "CAMERA_VLAN"
        | "SWITCH_MGMT"
        | "WIFI_MGMT",
) {
    try {
        const api = await getServerApi();

        // Removemos o filtro fixo de status na URL para que possamos dar erros mais precisos se o IP existir mas estiver ocupado
        const response = await api.get(`/api/ip-addresses?search=${address}`);
        const ipList: any[] = response.data?.data || [];

        if (ipList.length === 0) {
            return {
                error: "Este endereço IP não está cadastrado na infraestrutura.",
            };
        }

        // 1️⃣ Filtra para achar o IP exato digitado
        const exactIpMatch = ipList.find(
            (ip) => ip.address.trim() === address.trim(),
        );

        if (!exactIpMatch) {
            return { error: `O endereço IP ${address} não foi encontrado.` };
        }

        // 2️⃣ NOVA VALIDAÇÃO: Bloqueia mistura de redes (Ex: Ativo corporativo pegando IP de Câmeras/Switch)
        const currentNetworkType = exactIpMatch.network?.type;

        if (currentNetworkType && currentNetworkType !== expectedVlanType) {
            // Mapeamento amigável para o técnico entender o erro
            const typeLabels: Record<string, string> = {
                GENERAL_DATA: "Rede de Dados Gerais",
                CAMERA_VLAN: "VLAN de Câmeras (CFTV)",
                SWITCH_MGMT: "Rede de Gerenciamento (Switches/Roteadores)",
                WIFI_MGMT: "Rede de Infraestrutura Wi-Fi",
            };

            const foundLabel =
                typeLabels[currentNetworkType] || currentNetworkType;
            const expectedLabel =
                typeLabels[expectedVlanType] || expectedVlanType;

            return {
                error: `Conflito de Escopo: Este IP pertence à ${foundLabel}. Este ativo exige um IP da ${expectedLabel}.`,
            };
        }

        // 3️⃣ Validação de Status (Se já estiver em uso, avisa o usuário)
        if (exactIpMatch.status !== "AVAILABLE") {
            return {
                error: `Este endereço IP já está em uso (${exactIpMatch.status}) por outro ativo.`,
            };
        }
        // Se passou em todas as regras, retorna o UUID correto
        return { data: exactIpMatch };
    } catch (error: any) {
        return {
            error:
                error.response?.data?.error ||
                "Erro ao consultar regras do IP.",
        };
    }
}
