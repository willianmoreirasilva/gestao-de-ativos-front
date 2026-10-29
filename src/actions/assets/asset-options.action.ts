"use server";

import { departmentService } from "@/services/department";
import { locationService } from "@/services/location";
import { optionsService } from "@/services/options";
import { switchService } from "@/services/switches";

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
            optionsService.getProcessors().catch(() => ({ data: [] })),
            optionsService.getOperatingSystems().catch(() => ({ data: [] })),
            optionsService.getDisks().catch(() => ({ data: [] })),
            departmentService.getDepartments(1, 1000),
            locationService.getLocations(0, 100),
            switchService.getSwitches({ page: 1, limit: 1000 }),
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
