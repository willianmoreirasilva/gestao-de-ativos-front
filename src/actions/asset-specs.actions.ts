"use server";

import { revalidatePath } from "next/cache";

import { getServerApi } from "@/lib/server-api";

interface ActionResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    fieldErrors?: { [key: string]: string[] } | null;
}

/**
 * 🧼 Higienizador inteligente de Payload
 */
function sanitizePayloadForBackend(obj: any): any {
    if (obj === null || obj === undefined) return undefined;
    if (typeof obj === "string") return obj.trim() === "" ? null : obj;
    if (Array.isArray(obj)) return obj.map(sanitizePayloadForBackend);

    if (typeof obj === "object") {
        const cleaned: any = {};
        for (const key of Object.keys(obj)) {
            const val = obj[key];
            if (val === undefined) continue;
            const sanitizedVal = sanitizePayloadForBackend(val);
            if (sanitizedVal !== undefined) cleaned[key] = sanitizedVal;
        }
        return cleaned;
    }
    return obj;
}

/**
 * Auxiliar para tratamento padronizado de erros
 */
function handleError(error: any, defaultMessage: string): ActionResponse {
    console.error(
        `[ASSET_SPECS_ACTION_ERROR]:`,
        error?.response?.data || error,
    );
    return {
        success: false,
        error:
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            defaultMessage,
        fieldErrors: error?.response?.data?.fieldErrors || null,
    };
}

/**
 * Auxiliar para revalidar caminhos do ativo de forma genérica
 */
function revalidateAssetPaths(assetId: string) {
    revalidatePath("/assets");
    revalidatePath(`/assets/${assetId}`);
    revalidatePath("/assets/computers");
    revalidatePath(`/assets/computers/${assetId}`);
}

// ⚙️ UPDATE COMPUTERS SPECS
export async function updateComputerSpecsAction(
    id: string,
    specs: {
        username: string;
        hostname: string;
        mac?: string | null;
        processorId?: string | null;
        osId?: string | null;
        diskId?: string | null;
        memory?: string | null;
        notes?: string | null;
    },
): Promise<ActionResponse> {
    try {
        const api = await getServerApi();

        // 🛡️ Alinhado perfeitamente com os campos do Prisma/Backend
        const payload = {
            hostname: specs.hostname?.trim(),
            username: specs.username?.trim() || "Utilizador Padrão",
            mac:
                !specs.mac || specs.mac.trim() === "" ? null : specs.mac.trim(),
            notes:
                !specs.notes || specs.notes.trim() === ""
                    ? null
                    : specs.notes.trim(),

            // Se vier vazio do Front, força o envio de null puro para limpar o banco
            processorId:
                !specs.processorId || specs.processorId === ""
                    ? null
                    : specs.processorId,
            osId: !specs.osId || specs.osId === "" ? null : specs.osId,
            diskId: !specs.diskId || specs.diskId === "" ? null : specs.diskId,
            memory: !specs.memory || specs.memory === "" ? null : specs.memory,
        };

        // Envia o payload idêntico ao esperado pelo back
        const response = await api.put(
            `/api/assets/${id}/specs/computer`,
            payload,
        );
        revalidateAssetPaths(id);

        return { success: true, data: response.data?.data };
    } catch (error: any) {
        return handleError(
            error,
            "Erro ao atualizar as especificações do computador.",
        );
    }
}

// ⚙️ UPDATE PRINTERS SPECS
export async function updatePrinterSpecsAction(
    id: string,
    specs: {
        model: string;
        serial?: string | null;
        code?: string | null;
        notes?: string | null;
    },
): Promise<ActionResponse> {
    try {
        const api = await getServerApi();
        const sanitized = sanitizePayloadForBackend(specs);

        const response = await api.put(
            `/api/assets/${id}/specs/printer`,
            sanitized,
        );
        revalidateAssetPaths(id);

        return { success: true, data: response.data?.data };
    } catch (error: any) {
        return handleError(
            error,
            "Erro ao atualizar as especificações da impressora.",
        );
    }
}

// ⚙️ UPDATE PHONES SPECS
export async function updatePhoneSpecsAction(
    id: string,
    specs: {
        phoneNumber: string;
        model?: string | null;
        notes?: string | null;
    },
): Promise<ActionResponse> {
    try {
        const api = await getServerApi();
        const sanitized = sanitizePayloadForBackend(specs);

        const response = await api.put(
            `/api/assets/${id}/specs/phone`,
            sanitized,
        );
        revalidateAssetPaths(id);

        return { success: true, data: response.data?.data };
    } catch (error: any) {
        return handleError(
            error,
            "Erro ao atualizar as especificações do telefone.",
        );
    }
}

// ⚙️ UPDATE CAMERA SPECS
export async function updateCameraSpecsAction(
    id: string,
    specs: { model: string; serial?: string | null; notes?: string | null },
): Promise<ActionResponse> {
    try {
        const api = await getServerApi();
        const sanitized = sanitizePayloadForBackend(specs);

        const response = await api.put(
            `/api/assets/${id}/specs/camera`,
            sanitized,
        );
        revalidateAssetPaths(id);

        return { success: true, data: response.data?.data };
    } catch (error: any) {
        return handleError(
            error,
            "Erro ao atualizar as especificações da câmera.",
        );
    }
}
