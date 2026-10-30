"use server";

import { revalidatePath } from "next/cache";

import { apiErrorMessage, describeApiError } from "@/lib/api-error";
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
    } catch (error) {
        return {
            success: false,
            error: apiErrorMessage(
                error,
                "Falha ao efetuar reserva de IPs",
                "error",
                "message",
            ),
            count: 0,
        };
    }
}

/**
 * 10. PATCH /api/ip-addresses/reserve/:id
 * Edita o motivo e/ou move a reserva para outro IP livre. A API valida a
 * VLAN da reserva atual e a do IP novo (CAM_OPERATOR: só câmeras).
 */
export async function updateIpReservationAction(
    id: string,
    payload: { reason?: string | null; newAddress?: string },
) {
    try {
        const api = await getServerApi();
        await api.patch(`/api/ip-addresses/reserve/${id}`, payload);
        revalidateIpPaths();
        return { success: true, error: null };
    } catch (error) {
        const data = (
            error as {
                response?: { data?: { message?: string; error?: string } };
            }
        ).response?.data;
        return {
            success: false,
            error:
                data?.error ||
                data?.message ||
                "Não foi possível editar a reserva.",
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
    } catch (error) {
        console.error(
            "[ACTION ERROR] Falha no cancelIpReservationAction:",
            describeApiError(error),
        );

        return {
            success: false,
            error: apiErrorMessage(
                error,
                error instanceof Error && error.message
                    ? error.message
                    : "Falha ao cancelar reserva do IP.",
                "error",
                "message",
            ),
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
    } catch (error) {
        console.error("[ACTION - findAvailableIpsAction] Erro:", error);
        return {
            success: false,
            data: null,
            error: apiErrorMessage(
                error,
                "Erro ao consultar bloco de IPs disponíveis.",
                "message",
            ),
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
    } catch (error) {
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
    } catch (error) {
        return {
            success: false,
            data: [],
            meta: null,
            error: "Erro ao carregar lista de reservas.",
        };
    }
}
