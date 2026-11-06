import type { Metadata } from "next";

import { ReportContainer } from "@/components/reports/report-container";
import { RequirePermission } from "@/components/require-permission";
import { BackButton } from "@/components/users/back-button";
import { PageTitle } from "@/components/users/page-title";
import { can } from "@/lib/permissions";
import { ReportQueryInput } from "@/schemas/report.schema";
import { departmentService } from "@/services/department";
import { locationService } from "@/services/location";
import { networkService } from "@/services/network";
import { optionsService } from "@/services/options";
import { fetchAssetReport } from "@/services/reports.service";
import { switchService } from "@/services/switches";
import { userService } from "@/services/user";
import type { SingleFilter } from "@/types/report";
import { ReportOptions } from "@/types/report-options";

export const metadata: Metadata = { title: "Construtor de Relatórios" };

interface Props {
    searchParams: Promise<{
        page?: string;
        limit?: string;
        search?: string;
        ipStatus?: "ALL" | "true" | "false";
        types?: string;
        departmentId?: string;
        locationId?: string;
        networkId?: string;
        connectedToSwitchId?: string;
        cascade?: string;
        // Especificações do Computador
        osId?: string;
        processorId?: string;
        diskId?: string;
        ram?: string;
        // Especificações do Switch
        switchModel?: string;
        switchVendor?: string;
        switchPorts?: string;
        // Especificações do Access Point
        apModel?: string;
        apVendor?: string;
        apSsid?: string;
        apFrequency?: string;
        // Especificações da Câmera
        cameraHostname?: string;
        cameraModel?: string;
        // Especificações do Telefone
        phoneHostname?: string;
        phoneModel?: string;
        phoneNumber?: string;
        // Especificações da impressora
        printerModel?: string;
        printerSerial?: string;
    }>;
}

async function Reports({ searchParams }: Props) {
    const params = await searchParams;

    const page = parseInt(params.page || "1", 10);
    const limit = parseInt(params.limit || "4", 10);

    const filters: SingleFilter[] = [];

    // Busca Textual
    if (params.search?.trim()) {
        filters.push({
            field: "search",
            operator: "contains",
            value: params.search.trim(),
        });
    }

    // Status de IP
    if (params.ipStatus && params.ipStatus !== "ALL") {
        filters.push({
            field: "hasIp",
            operator: "eq",
            value: params.ipStatus === "true",
        });
    }

    // Tipos Selecionados. Sem relatório geral (CAM_OPERATOR), o relatório
    // é sempre só de câmeras; a API recusa qualquer outro tipo
    const { data: profile } = await userService.getMyProfile();
    const typesParam = can(profile?.role, "reports", "view")
        ? params.types
        : "CAMERA";
    if (typesParam) {
        const typesList = typesParam.split(",").filter(Boolean);
        if (typesList.length > 0) {
            filters.push({
                field: "type",
                operator: typesList.length > 1 ? "in" : "eq",
                value: typesList.length > 1 ? typesList : typesList[0],
            });
        }
    }

    // Filtros Organizacionais e de Rede
    if (params.departmentId) {
        filters.push({
            field: "departmentId",
            operator: "eq",
            value: params.departmentId,
        });
    }
    if (params.locationId) {
        filters.push({
            field: "locationId",
            operator: "eq",
            value: params.locationId,
        });
    }
    if (params.networkId) {
        filters.push({
            field: "networkId",
            operator: "eq",
            value: params.networkId,
        });
    }
    if (params.connectedToSwitchId) {
        filters.push({
            field: "connectedToSwitchId",
            operator: "eq",
            value: params.connectedToSwitchId,
        });
    }

    // Filtros de Especificação (Computador)
    if (params.osId)
        filters.push({
            field: "computer.osId",
            operator: "eq",
            value: params.osId,
        });
    if (params.processorId)
        filters.push({
            field: "computer.processorId",
            operator: "eq",
            value: params.processorId,
        });
    if (params.diskId)
        filters.push({
            field: "computer.diskId",
            operator: "eq",
            value: params.diskId,
        });
    if (params.ram)
        filters.push({
            field: "computer.memory",
            operator: "eq",
            value: params.ram,
        });

    // Filtros de Especificação (Switch)
    if (params.switchModel)
        filters.push({
            field: "switch.model",
            operator: "contains",
            value: params.switchModel,
        });
    if (params.switchVendor)
        filters.push({
            field: "switch.vendor",
            operator: "contains",
            value: params.switchVendor,
        });
    if (params.switchPorts)
        filters.push({
            field: "switch.totalPorts",
            operator: "eq",
            value: Number(params.switchPorts),
        });

    // Filtros de Especificação (Access Point)
    if (params.apModel)
        filters.push({
            field: "accessPoint.model",
            operator: "contains",
            value: params.apModel,
        });
    if (params.apVendor)
        filters.push({
            field: "accessPoint.vendor",
            operator: "contains",
            value: params.apVendor,
        });
    if (params.apSsid)
        filters.push({
            field: "accessPoint.ssid",
            operator: "contains",
            value: params.apSsid,
        });
    if (params.apFrequency)
        filters.push({
            field: "accessPoint.frequencyBand",
            operator: "contains",
            value: params.apFrequency,
        });

    // Filtros de Especificação (Câmera)
    if (params.cameraHostname) {
        filters.push({
            field: "camera.hostname",
            operator: "contains",
            value: params.cameraHostname,
        });
    }
    if (params.cameraModel) {
        filters.push({
            field: "camera.model",
            operator: "contains",
            value: params.cameraModel,
        });
    }

    // Filtros de Especificação (Telefone)
    if (params.phoneHostname) {
        filters.push({
            field: "phone.hostname",
            operator: "contains",
            value: params.phoneHostname,
        });
    }
    if (params.phoneModel) {
        filters.push({
            field: "phone.model",
            operator: "contains",
            value: params.phoneModel,
        });
    }
    if (params.phoneNumber) {
        filters.push({
            field: "phone.phoneNumber",
            operator: "contains",
            value: params.phoneNumber,
        });
    }

    // Filtro de Especificação (Impressora)
    const printerModel = params.printerModel;

    if (printerModel?.trim()) {
        filters.push({
            field: "printer.model",
            operator: "contains",
            value: printerModel.trim(),
        });
    }

    if (params.printerSerial?.trim()) {
        filters.push({
            field: "printer.serial",
            operator: "contains",
            value: params.printerSerial.trim(),
        });
    }

    const queryInput: ReportQueryInput = {
        filters,
        columns: ["patrimony", "type", "department", "location", "ip"],
        groupBy: "none",
        orderBy: { field: "createdAt", direction: "desc" },
        page,
        limit,
        // A cascata só faz sentido com um switch escolhido
        includeCascade: Boolean(
            params.connectedToSwitchId && params.cascade === "1",
        ),
    };

    const [
        reportResult,
        departmentsRes,
        locationsRes,
        networksRes,
        processorsRes,
        osRes,
        disksRes,
        switchesRes,
    ] = await Promise.all([
        fetchAssetReport(queryInput),
        departmentService.getDepartments(1, 1000).catch((err) => {
            console.error("❌ Erro ao buscar Departamentos:", err);
            return { data: [] };
        }),
        locationService.getLocations(1, 1000).catch((err) => {
            console.error("❌ Erro ao buscar Localidades:", err);
            return { data: [] };
        }),
        networkService.getNetworks().catch((err) => {
            console.error("❌ Erro ao buscar Redes:", err);
            return { data: [] };
        }),
        optionsService.getProcessors().catch((err) => {
            console.error("❌ Erro ao buscar Processadores:", err);
            return { data: [] };
        }),
        optionsService.getOperatingSystems().catch((err) => {
            console.error("❌ Erro ao buscar SOs:", err);
            return { data: [] };
        }),
        optionsService.getDisks().catch((err) => {
            console.error("❌ Erro ao buscar Discos:", err);
            return { data: [] };
        }),
        switchService.getSwitches({ page: 1, limit: 100 }).catch((err) => {
            console.error("❌ Erro ao buscar Switches:", err);
            return { data: [] };
        }),
    ]);

    const options: ReportOptions = {
        departments: (departmentsRes.data ?? []).map((d) => ({
            id: d.id,
            name: d.name || "Sem nome",
        })),
        locations: (locationsRes.data ?? []).map((l) => ({
            id: l.id,
            name: l.name || "Sem nome",
        })),
        networks: (networksRes.data ?? []).map((n) => ({
            id: n.id,
            name: `${n.networkAddress} (VLAN ${n.vlanTag ?? "N/A"})`,
        })),
        processors: (processorsRes.data ?? []).map((p) => ({
            id: p.id,
            name: p.name || "Processador",
        })),
        operatingSystems: (osRes.data ?? []).map((os) => ({
            id: os.id,
            name: os.name || "Sistema Operacional",
        })),
        disks: (disksRes.data ?? []).map((disk) => ({
            id: disk.id,
            name: disk.name || "Disco",
        })),
        switches: (switchesRes.data ?? []).map((sw) => ({
            id: sw.id,
            hostname: sw.hostname || sw.model || "Switch S/N",
            model: sw.model || null,
            vendor: sw.vendor || null,
        })),
    };

    return (
        <div className="space-y-6 px-1.5 md:px-0">
            <PageTitle
                title="Relatórios e Inventário de Ativos"
                description="Acompanhe o status do parque tecnológico, alocação por departamento e detalhes de conectividade."
                leftSide={<BackButton />}
            />

            <ReportContainer
                initialData={reportResult?.data || []}
                meta={
                    reportResult?.meta || {
                        total: 0,
                        page: 1,
                        limit: 5,
                        totalPages: 0,
                    }
                }
                summary={
                    reportResult?.summary || {
                        totalAssets: 0,
                        withIp: 0,
                        withoutIp: 0,
                        departmentsCount: 0,
                    }
                }
                options={options}
                cascade={reportResult?.cascade}
            />
        </div>
    );
}

// Relatórios: SUPERADM e ADMIN (gerais) e CAM_OPERATOR (só câmeras)
export default function ReportsPage(props: Props) {
    return (
        <RequirePermission
            resource="cameraReports"
            action="view"
            message="Você não tem permissão para gerar relatórios."
        >
            <Reports {...props} />
        </RequirePermission>
    );
}
