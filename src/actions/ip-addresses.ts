"use server";

import { revalidatePath } from "next/cache";

import { getServerApi } from "@/lib/server-api";
import { ipAddressService } from "@/services/ip-address";

// Revalidação genérica para manter o estado atualizado
function revalidateIpPaths(networkId?: string) {
    revalidatePath("/dashboard/overview");
    revalidatePath("/infra/networks");
    if (networkId) revalidatePath(`/infra/networks/${networkId}`);
    revalidatePath("/infra/ip-addresses");
}

/* ==========================================================================
   ACTIONS DE ESCRITA (MUTATION)
   ========================================================================== */

/**
 * 8. POST /api/ip-addresses/reserve
 */
export async function reserveIpsAction(payload: {
    ipAddresses: string[];
    networkId: string;
    reason?: string | null;
}) {
    const api = await getServerApi();
    try {
        const response = await api.post("/api/ip-addresses/reserve", payload);

        if (response.data?.error) {
            return { success: false, error: response.data.error, count: 0 };
        }

        revalidateIpPaths(payload.networkId);

        return {
            success: true,
            error: null,
            count: response.data.count || payload.ipAddresses.length,
        };
    } catch (error: any) {
        return {
            success: false,
            error:
                error.response?.data?.error ||
                error.response?.data?.message ||
                "Falha ao efetuar reserva de IPs",
            count: 0,
        };
    }
}

/**
 * 9. PATCH /api/ip-addresses/{id}/cancel-reservation
 */
export async function cancelIpReservationAction(
    id: string,
    networkId?: string,
) {
    try {
        const api = await getServerApi();
        const response = await api.delete(`/api/ip-addresses/reserve/${id}`, {
            headers: {
                "Content-Type": undefined,
            },
        });

        // Se o backend retornar sucesso falso ou campo de erro
        if (response.data?.success === false || response.data?.error) {
            return {
                success: false,
                error:
                    response.data?.error ||
                    "Não foi possível cancelar a reserva.",
            };
        }

        // Revalidações no Next.js utilizando networkId para purgar os caches certos
        try {
            revalidatePath("/dashboard/overview");
            revalidatePath("/dashboard/ip-addresses");
            if (networkId) {
                revalidatePath(`/dashboard/ip-addresses/${networkId}`);
            }
        } catch (revalidateError) {
            console.warn(
                "[ACTION] Erro ao revalidar caminhos no Next.js:",
                revalidateError,
            );
        }

        return { success: true, error: null };
    } catch (error: any) {
        console.error(
            "[ACTION ERROR] Falha no cancelIpReservationAction:",
            error?.response?.data || error,
        );

        return {
            success: false,
            error:
                error.response?.data?.error ||
                error.response?.data?.message ||
                error.message ||
                "Falha ao cancelar reserva do IP.",
        };
    }
}

/* ==========================================================================
   ACTIONS DE LEITURA PARA CLIENT COMPONENTS
   ========================================================================== */

/**
 * Consulta blocos sequenciais de IPs disponíveis
 */
export async function findAvailableIpsAction(
    networkId: string,
    quantity: number,
) {
    try {
        const response = await ipAddressService.findAvailableIps(
            networkId,
            quantity,
        );

        return { success: true, data: response.data, error: null };
    } catch (error: any) {
        console.error("[ACTION - findAvailableIpsAction] Erro:", error);
        return {
            success: false,
            data: null,
            error:
                error.response?.data?.message ||
                "Erro ao consultar bloco de IPs disponíveis.",
        };
    }
}
/**
 * Busca paginada de IPs disponíveis em uma sub-rede
 */
export async function getAvailableIpsAction(
    networkId: string,
    page = 1,
    limit = 15,
) {
    try {
        const response = await ipAddressService.getAvailableIps(
            networkId,
            page,
            limit,
        );
        return {
            success: true,
            data: response.data,
            meta: response.meta,
            error: null,
        };
    } catch (error: any) {
        return {
            success: false,
            data: [],
            meta: null,
            error: "Erro ao carregar IPs disponíveis.",
        };
    }
}

/**
 *
 * Lista IPs com status RESERVED (com filtros de busca e sub-rede)
 */
export async function getReservedIpsAction(params: {
    networkId?: string;
    search?: string;
    page?: number;
    limit?: number;
}) {
    try {
        const response = await ipAddressService.getIpAddresses({
            ...params,
            status: "RESERVED",
        });
        return {
            success: true,
            data: response.data,
            meta: response.meta,
            error: null,
        };
    } catch (error: any) {
        return {
            success: false,
            data: [],
            meta: null,
            error: "Erro ao carregar lista de reservas.",
        };
    }
}

/* ==========================================================================
   ACTIONS ADICIONAIS DE LEITURA (A IMPLEMENTAR)
   ========================================================================== */

/**
 * 2. Busca estatísticas globais de IPs por status
 */
export async function getIpStatsAction() {
    try {
        const response = await ipAddressService.getStats();
        return { success: true, data: response.data, error: null };
    } catch (error: any) {
        return {
            success: false,
            data: [],
            error: "Erro ao carregar estatísticas gerais de IPs.",
        };
    }
}

/**
 * 3. Valida se um IP pode ser atribuído a um tipo de ativo (General Data, Camera, etc)
 */
export async function verifyIpAction(address: string, expectedType: string) {
    try {
        const response = await ipAddressService.verifyIp(address, expectedType);
        return { success: true, data: response.data, error: null };
    } catch (error: any) {
        return {
            success: false,
            data: null,
            error: error.message || "Erro ao verificar conformidade do IP.",
        };
    }
}

/**
 * 4. Obtém o panorama e porcentagem de uso das sub-redes para o Dashboard
 */
export async function getOverviewStatsAction(networkId?: string) {
    try {
        const response = await ipAddressService.getOverviewStats(networkId);
        return { success: true, data: response.data, error: null };
    } catch (error: any) {
        return {
            success: false,
            data: null,
            error: "Erro ao carregar resumo e métricas de uso de redes.",
        };
    }
}

/**
 * 6. Lista os últimos IPs cadastrados/alterados na infraestrutura
 */
export async function getRecentIpsAction(limit = 10) {
    try {
        const response = await ipAddressService.getRecentIps(limit);
        return { success: true, data: response.data, error: null };
    } catch (error: any) {
        return {
            success: false,
            data: [],
            error: "Erro ao buscar histórico de IPs recentes.",
        };
    }
}
