import {
    getDisksAction,
    getOperatingSystemsAction,
    getProcessorsAction,
} from "@/actions/options";
import { ReportContainer } from "@/components/reports/report-container";
import { BackButton } from "@/components/users/back-button";
import { PageTitle } from "@/components/users/page-title";
import { ReportQueryInput } from "@/schemas/report.schema";
import { departmentService } from "@/services/department";
import { locationService } from "@/services/location";
import { networkService } from "@/services/network";
import { getAssetReportAction } from "@/services/reports.service";
import { switchService } from "@/services/switches";
import { ReportOptions } from "@/types/report-options";

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
        connectedSwitchId?: string;
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
    }>;
}

export default async function ReportsPage({ searchParams }: Props) {
    const params = await searchParams;

    const page = parseInt(params.page || "1", 10);
    const limit = parseInt(params.limit || "10", 10);

    const filters: any[] = [];

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

    // Tipos Selecionados
    if (params.types) {
        const typesList = params.types.split(",").filter(Boolean);
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
    if (params.connectedSwitchId) {
        filters.push({
            field: "connectedToSwitchId",
            operator: "eq",
            value: params.connectedSwitchId,
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
    const printerModel = params.printerModel || (params as any).model;

    if (printerModel?.trim()) {
        filters.push({
            field: "printer.model",
            operator: "contains",
            value: printerModel.trim(),
        });
    }

    const queryInput: ReportQueryInput = {
        filters,
        columns: ["patrimony", "type", "department", "location", "ip"],
        groupBy: "none",
        orderBy: { field: "createdAt", direction: "desc" },
        page,
        limit,
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
        getAssetReportAction(queryInput),
        departmentService.getDepartments().catch((err) => {
            console.error("❌ Erro ao buscar Departamentos:", err);
            return [];
        }),
        locationService.getLocations().catch((err) => {
            console.error("❌ Erro ao buscar Localidades:", err);
            return [];
        }),
        networkService.getNetworks().catch((err) => {
            console.error("❌ Erro ao buscar Redes:", err);
            return [];
        }),
        getProcessorsAction().catch((err) => {
            console.error("❌ Erro ao buscar Processadores:", err);
            return [];
        }),
        getOperatingSystemsAction().catch((err) => {
            console.error("❌ Erro ao buscar SOs:", err);
            return [];
        }),
        getDisksAction().catch((err) => {
            console.error("❌ Erro ao buscar Discos:", err);
            return [];
        }),
        switchService.getSwitches({ page: 1, limit: 100 }).catch((err) => {
            console.error("❌ Erro ao buscar Switches:", err);
            return [];
        }),
    ]);

    const extractList = (res: any): any[] => {
        if (!res) return [];
        if (Array.isArray(res)) return res;
        if (Array.isArray(res.data)) return res.data;
        if (Array.isArray(res.items)) return res.items;
        if (res.data && Array.isArray(res.data.data)) return res.data.data;
        return [];
    };

    const rawDepartments = extractList(departmentsRes);
    const rawLocations = extractList(locationsRes);
    const rawNetworks = extractList(networksRes);
    const rawProcessors = extractList(processorsRes);
    const rawOs = extractList(osRes);
    const rawDisks = extractList(disksRes);
    const rawSwitches = extractList(switchesRes);

    const options: ReportOptions = {
        departments: rawDepartments.map((d: any) => ({
            id: d.id,
            name: d.name || d.title || "Sem nome",
        })),
        locations: rawLocations.map((l: any) => ({
            id: l.id,
            name: l.name || l.title || "Sem nome",
        })),
        networks: rawNetworks.map((n: any) => ({
            id: n.id,
            name: `${n.name || n.networkAddress || "Rede"} (VLAN ${n.vlanTag ?? "N/A"})`,
        })),
        processors: rawProcessors.map((p: any) => ({
            id: p.id,
            name: p.name || p.model || "Processador",
        })),
        operatingSystems: rawOs.map((os: any) => ({
            id: os.id,
            name: os.name || "Sistema Operacional",
        })),
        disks: rawDisks.map((disk: any) => ({
            id: disk.id,
            name: disk.name || disk.model || "Disco",
        })),
        switches: rawSwitches.map((sw: any) => ({
            id: sw.id,
            hostname: sw.hostname || sw.name || sw.model || "Switch S/N",
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
                        limit: 10,
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
            />
        </div>
    );
}
