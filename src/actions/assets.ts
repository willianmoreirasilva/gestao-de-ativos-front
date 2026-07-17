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
 * 🧼 Higienizador inteligente de Payload:
 * Mantém os dados fiéis ao contrato do backend.
 *
 * REGRA CRUCIAL:
 * - Se a propriedade for `undefined`, nós a REMOVEMOS do payload final.
 *   Dessa forma, o Prisma do backend ignora o campo e NÃO limpa o valor existente no banco.
 * - Apenas as strings vazias `""` fornecidas ativamente pelo usuário são transformadas em `null`.
 */
function sanitizePayloadForBackend(obj: any): any {
    if (obj === null || obj === undefined) return undefined;

    if (typeof obj === "string") {
        return obj.trim() === "" ? null : obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(sanitizePayloadForBackend);
    }

    if (typeof obj === "object") {
        const cleaned: any = {};
        for (const key of Object.keys(obj)) {
            const val = obj[key];

            // Se o campo não está no formulário, não o envie para evitar resetar no banco
            if (val === undefined) {
                continue;
            }

            const sanitizedVal = sanitizePayloadForBackend(val);
            if (sanitizedVal !== undefined) {
                cleaned[key] = sanitizedVal;
            }
        }
        return cleaned;
    }

    return obj;
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

        // 🌟 Remove propriedades undefined e limpa strings vazias de forma segura
        const sanitizedPayload = sanitizePayloadForBackend(payload);

        // Envia apenas o payload higienizado contendo o que de fato mudou
        await api.patch(`/api/assets/${assetId}`, sanitizedPayload);

        revalidatePath("/assets/computers");
        revalidatePath(`/assets/computers/${assetId}`);

        return { success: true };
    } catch (error: any) {
        console.error(
            `[UPDATE_ASSET_ACTION_ERROR]:`,
            error?.response?.data || error,
        );

        return {
            success: false,
            error:
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                "Erro ao salvar as alterações no servidor.",
            fieldErrors: error?.response?.data?.fieldErrors || null,
        };
    }
}

/**
 * 🛠️ Troca rápida de IP no modal (Apenas IP)
 * Alinhado estritamente com o campo `newIpId` exigido pelo backend
 */
export async function updateAssetOnlyIpAction(
    id: string,
    newIpIdFromFront: any,
): Promise<MutationResponse> {
    try {
        const api = await getServerApi();

        // 1. Extraímos estritamente a string do UUID se vier embrulhado em um objeto do select
        let cleanIpId: string | null = null;
        if (newIpIdFromFront) {
            cleanIpId =
                typeof newIpIdFromFront === "object"
                    ? newIpIdFromFront.id || null
                    : newIpIdFromFront;
        }

        // 2. O backend exige "newIpId" e valida via Zod como UUID ou null.
        // Não envie "ipId" aqui para não confundir o Schema de validação do back!
        const payload: UpdateAssetInput = {
            newIpId: cleanIpId,
        };

        await api.patch(`/api/assets/${id}`, payload);

        revalidatePath(`/assets/computers/${id}`);
        revalidatePath("/assets/computers");

        return {};
    } catch (error: any) {
        console.error(
            "[ERROR_UPDATE_ONLY_IP]:",
            error?.response?.data || error.message,
        );
        return {
            error:
                error.response?.data?.message ||
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

        // 2️⃣ NOVA VALIDAÇÃO: Bloqueia mistura de redes
        const currentNetworkType = exactIpMatch.network?.type;

        if (currentNetworkType && currentNetworkType !== expectedVlanType) {
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

        // 3️⃣ Validação de Status
        if (exactIpMatch.status !== "AVAILABLE") {
            return {
                error: `Este endereço IP já está em uso (${exactIpMatch.status}) por outro ativo.`,
            };
        }

        // Retornamos os dados sanitizados para garantir que o front-end tenha o ID string de forma fácil
        return {
            data: {
                id: exactIpMatch.id,
                address: exactIpMatch.address,
                status: exactIpMatch.status,
            },
        };
    } catch (error: any) {
        return {
            error:
                error.response?.data?.error ||
                "Erro ao consultar regras do IP.",
        };
    }
}
