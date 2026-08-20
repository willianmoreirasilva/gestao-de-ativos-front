"use server";

import { revalidatePath } from "next/cache";

import {
    getDisksAction,
    getOperatingSystemsAction,
    getProcessorsAction,
} from "@/actions/options";
import { getServerApi } from "@/lib/server-api";
import { ApiResponse } from "@/types/api";
import {
    ApiMeta,
    ApiResponseWithMeta,
    AssetFilters,
    AssetItem,
} from "@/types/assets";

import { departmentService } from "./department";
import { locationService } from "./location";
import { switchService } from "./switches";

interface ActionResponse<T> {
    data: T | null;
    meta: ApiMeta | null;
    error: string | null;
}

/**
 * Auxiliar para revalidar todos os caminhos afetados por modificações
 */
function revalidateAllAssetPaths() {
    revalidatePath("/assets");
    revalidatePath("/assets/computers");
    revalidatePath("/assets/printers");
    revalidatePath("/assets/cameras");
}

/**
 * Busca a listagem de ativos filtrada com base nos parâmetros informados
 */
export async function getAssets(
    filters: AssetFilters = {},
): Promise<ActionResponse<AssetItem[]>> {
    try {
        const api = await getServerApi();
        const searchParams = new URLSearchParams();

        if (filters.type) searchParams.append("type", filters.type);
        if (filters.departmentId)
            searchParams.append("departmentId", filters.departmentId);
        if (filters.locationId)
            searchParams.append("locationId", filters.locationId);
        if (filters.networkId)
            searchParams.append("networkId", filters.networkId);
        if (filters.connectedToSwitchId)
            searchParams.append(
                "connectedToSwitchId",
                filters.connectedToSwitchId,
            );

        // Filtros de controle e busca global
        if (filters.search) searchParams.append("search", filters.search);
        if (filters.hasIp) searchParams.append("hasIp", filters.hasIp);
        if (filters.page) searchParams.append("page", String(filters.page));
        if (filters.limit) searchParams.append("limit", String(filters.limit));

        const url = `/api/assets?${searchParams.toString()}`;
        const response = await api.get<ApiResponseWithMeta<AssetItem[]>>(url);

        return {
            data: response.data.data,
            meta: response.data.meta,
            error: null,
        };
    } catch (error: unknown) {
        console.error("❌ Erro na Action getAssets:", error);
        const apiError = error as {
            response?: { status?: number; data?: { error?: string } };
        };

        return {
            data: null,
            meta: null,
            error:
                apiError.response?.data?.error ||
                "Não foi possível carregar a lista de ativos.",
        };
    }
}

/**
 * Busca os detalhes de um ativo específico pelo ID
 */
export async function getAssetById(
    id: string,
): Promise<ApiResponse<AssetItem>> {
    try {
        const api = await getServerApi();
        const response = await api.get(`/api/assets/${id}`);
        return { data: response.data.data, error: null };
    } catch (error) {
        console.error(`❌ Erro ao buscar ativo ${id}:`, error);
        return {
            data: null,
            error: "Erro ao buscar ativo.",
        };
    }
}

/**
 * Remove um ativo pelo ID (suporta Fastify 200/204)
 */
export async function deleteAssetAction(id: string) {
    try {
        const api = await getServerApi();

        // 🌟 Payload vazio para contornar limitações de parser em endpoints DELETE
        const response = await api.delete(`/api/assets/${id}`, {
            headers: {
                "Content-Type": "application/json",
            },
            data: {},
        });

        if (response.status === 204 || response.status === 200) {
            revalidateAllAssetPaths();
            return { error: "", fieldErrors: {} };
        }

        return { error: "", fieldErrors: {} };
    } catch (error: any) {
        console.error("❌ [DELETE_ASSET_ACTION_ERROR]:", error);

        if (error.response?.status === 204 || error.response?.status === 200) {
            revalidateAllAssetPaths();
            return { error: "", fieldErrors: {} };
        }

        const errorMessage =
            error.response?.data?.error || error.response?.data?.message;
        return {
            error:
                errorMessage ||
                "Erro interno do servidor ao tentar remover o ativo.",
            fieldErrors: {},
        };
    }
}

/**
 * Agrega dados para preenchimento de formulários e selects em telas de criação/edição
 */
export async function getAssetOptionsAction() {
    try {
        const [
            processorsRes,
            osRes,
            disksRes,
            departmentsRes,
            locationsRes,
            switchesRes,
        ] = await Promise.all([
            getProcessorsAction().catch(() => ({ data: [] })),
            getOperatingSystemsAction().catch(() => ({ data: [] })),
            getDisksAction().catch(() => ({ data: [] })),
            departmentService.getDepartments(0, 100),
            locationService.getLocations(0, 100),
            switchService.getSwitches({ page: 1, limit: 100 }),
        ]);

        return {
            success: true,
            data: {
                processors: processorsRes.data ?? [],
                operatingSystems: osRes.data ?? [],
                disks: disksRes.data ?? [],

                // Mapeia Departamentos
                departments: (departmentsRes.data ?? []).map((dep) => ({
                    id: dep.id,
                    name: dep.name,
                })),

                // Mapeia Locais / Unidades
                units: (locationsRes.data ?? []).map((loc) => ({
                    id: loc.id,
                    name: loc.name,
                })),

                // Mapeia Switches com suporte a múltiplos atributos de nome
                switches: (switchesRes.data ?? []).map((sw: any) => ({
                    id: sw.id,
                    name:
                        sw.switch?.hostname ||
                        sw.hostname ||
                        sw.switch?.model ||
                        sw.model ||
                        sw.ip?.address ||
                        "Switch Sem Nome",
                })),

                users: [],
            },
        };
    } catch (error) {
        console.error("Erro ao agregar opções de formulário:", error);
        return {
            success: false,
            error: "Falha ao carregar opções para o cadastro.",
        };
    }
}
