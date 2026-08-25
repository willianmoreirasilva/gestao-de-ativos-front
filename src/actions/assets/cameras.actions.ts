"use server";

import { getServerApi } from "@/lib/server-api";
import { sanitizeNullable, sanitizePayloadForBackend } from "@/lib/utils";
import { CameraFormValues } from "@/schemas/asset-create.schema";
import { ActionResult } from "@/types/assets";

import { ActionResponse, handleError, revalidateAssetPaths } from "./helpers";
import { findIpByAddressAction } from "./shared.actions";

/**
 * 🔄 ATUALIZAR ESPECIFICAÇÕES DA CÂMERA (PUT)
 */
export async function updateCameraSpecsAction(
    assetId: string,
    payload: {
        hostname?: string | null;
        channel?: number | string | null;
        model: string;
        serial?: string | null;
        mac?: string | null;
        notes?: string | null;
    },
): Promise<ActionResponse> {
    try {
        const api = await getServerApi();
        const sanitized = sanitizePayloadForBackend(payload);

        const response = await api.put(
            `/api/assets/${assetId}/specs/camera`,
            sanitized,
        );
        await revalidateAssetPaths(assetId, "cameras");

        return { success: true, data: response.data?.data };
    } catch (error: any) {
        return handleError(
            error,
            "Erro ao atualizar as especificações da câmera.",
        );
    }
}

/**
 * ➕ CADASTRAR NOVA CÂMERA (POST)
 */
export async function createCameraAssetAction(
    formData: CameraFormValues,
): Promise<ActionResult> {
    try {
        const api = await getServerApi();
        let resolvedIpId: string | null = null;

        if (formData.isManualMode && formData.manualIpValue) {
            const cleanIp = formData.manualIpValue.trim();
            const ipLookup = await findIpByAddressAction(
                cleanIp,
                "CAMERA_VLAN",
            );

            if (!ipLookup.success || !ipLookup.data?.id) {
                return {
                    success: false,
                    fieldErrors: {
                        manualIpValue: [
                            ipLookup.error ||
                                "Endereço IP indisponível para a VLAN de Câmeras.",
                        ],
                    },
                };
            }
            resolvedIpId = ipLookup.data.id;
        } else if (!formData.isManualMode && formData.selectedIpId) {
            resolvedIpId = sanitizeNullable(formData.selectedIpId);
        }

        let parsedSwitchPort: number | null = null;
        if (formData.switchPort && `${formData.switchPort}`.trim() !== "") {
            const num = Number(formData.switchPort);
            if (!Number.isNaN(num) && num > 0) parsedSwitchPort = num;
        }

        let parsedChannel: number | null = null;
        if (formData.channel && `${formData.channel}`.trim() !== "") {
            const numChannel = Number(formData.channel);
            if (!Number.isNaN(numChannel) && numChannel >= 0)
                parsedChannel = numChannel;
        }

        const payload = {
            type: "CAMERA",
            patrimony: sanitizeNullable(formData.patrimony),
            departmentId: sanitizeNullable(formData.departmentId),
            locationId: sanitizeNullable(
                formData.unitId || formData.locationId,
            ),
            ipId: resolvedIpId,
            connectedToSwitchId: sanitizeNullable(formData.switchId),
            switchPort: parsedSwitchPort,
            camera: {
                //CORRIGIDO: sanitizeNullable evita o crash do .trim() e envia null/string limpa
                hostname: sanitizeNullable(formData.hostname),
                model: formData.model.trim(), // Model é obrigatório, portanto .trim() é seguro aqui
                channel: parsedChannel,
                serial: sanitizeNullable(formData.serial),
                mac: sanitizeNullable(formData.mac),
                notes: sanitizeNullable(formData.notes),
            },
        };

        console.log("PAYLOAD:", payload);
        const response = await api.post("/api/assets", payload);
        await revalidateAssetPaths(undefined, "cameras");

        return { success: true, data: response.data };
    } catch (error: any) {
        return handleError(error, "Erro ao cadastrar câmera.") as any;
    }
}
