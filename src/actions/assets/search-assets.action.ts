"use server";

import { getServerApi } from "@/lib/server-api";

export interface SearchAssetItem {
    id: string;
    type: string;
    displayName: string;
    subTitle?: string | null;
    patrimony?: string | null;
    ipAddress?: string | null;
    mac?: string | null;
}

export async function searchAssetsAction(
    query: string,
): Promise<SearchAssetItem[]> {
    const cleanQuery = query?.trim();
    if (!cleanQuery || cleanQuery.length < 2) return [];

    try {
        const api = await getServerApi();

        const response = await api.get("/api/assets", {
            params: {
                search: cleanQuery,
                page: 1,
                limit: 15, // Aumentado para não truncar autocompletes
            },
        });

        const assetsList = response.data?.data || [];

        if (!Array.isArray(assetsList)) return [];

        return assetsList.map((item: any) => {
            let displayName =
                item.displayName || item.patrimony || "Ativo sem nome";
            let subTitle: string | null = null;
            const mac: string | null = item.mac || null;

            // 1. COMPUTADOR
            if (item.computer) {
                if (item.computer.username && item.computer.hostname) {
                    displayName = `${item.computer.username} (${item.computer.hostname})`;
                } else if (item.computer.username) {
                    displayName = item.computer.username;
                } else if (item.computer.hostname) {
                    displayName = item.computer.hostname;
                }

                if (item.computer.anydesk) {
                    subTitle = `AnyDesk: ${item.computer.anydesk}`;
                }
            }
            // 2. SWITCH
            else if (item.switch) {
                subTitle = item.switch.model
                    ? `Modelo: ${item.switch.model}`
                    : null;
            }
            // 3. IMPRESSORA
            else if (item.printer) {
                subTitle = item.printer.code
                    ? `Cód: ${item.printer.code}`
                    : item.printer.model;
            }
            // 4. ACCESS POINT
            else if (item.accessPoint) {
                subTitle = item.accessPoint.ssid
                    ? `SSID: ${item.accessPoint.ssid}`
                    : item.accessPoint.model;
            }
            // 5. CÂMERA
            else if (item.camera) {
                subTitle = item.camera.channel
                    ? `Canal: ${item.camera.channel}`
                    : item.camera.model;
            }
            // 6. TELEFONE
            else if (item.phone) {
                subTitle = item.phone.phoneNumber
                    ? `Ramal/Tel: ${item.phone.phoneNumber}`
                    : item.phone.model;
            }

            const ipAddress = item.ip?.address || item.ipAddress || null;

            return {
                id: item.id,
                type: String(item.type || "OTHER").toUpperCase(),
                displayName,
                subTitle,
                patrimony: item.patrimony || null,
                ipAddress,
                mac,
            };
        });
    } catch (error: any) {
        console.error(
            "❌ [ERRO API]:",
            error?.response?.status,
            error?.response?.data || error?.message,
        );

        return [];
    }
}
