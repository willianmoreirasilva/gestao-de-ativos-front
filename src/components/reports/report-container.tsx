"use client";

import {
    ChevronDown,
    ChevronUp,
    Filter,
    FilterX,
    Loader2,
    Printer as PrinterIcon,
    SlidersHorizontal,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useTransition } from "react";

import { getAssetReportAction } from "@/services/reports.service";
import type {
    AssetReportData,
    ReportQueryPayload,
    SingleFilter,
} from "@/types/report";
import { ReportOptions } from "@/types/report-options";

import { Pagination } from "../pagination";
import { ActiveChips, type FilterChip } from "./filters/active-chips";
import { GeneralFilters } from "./filters/general-filters";
import { ReportAccessPointFilters } from "./filters/report-access-point-filters";
import { ReportCameraFilters } from "./filters/report-camera-filters";
import { ReportComputerFilters } from "./filters/report-computer-filters";
import { ReportPhoneFilters } from "./filters/report-phone-filters";
import { ReportPrinterFilters } from "./filters/report-printer-filters";
import { ReportSwitchFilters } from "./filters/report-switch-filters";
import { ReportPrintModal } from "./report-print-modal";
import { ReportKpiCards } from "./summary/report-kpi-cards";
import { ReportTableContent } from "./table/report-table-content";

interface ReportContainerProps {
    initialData: AssetReportData[];
    meta: { total: number; page: number; limit: number; totalPages: number };
    summary: {
        totalAssets: number;
        withIp: number;
        withoutIp: number;
        departmentsCount: number;
    };
    options: ReportOptions;
}

export function ReportContainer({
    initialData,
    meta,
    summary,
    options,
}: ReportContainerProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

    // Estado Geral
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [ipStatus, setIpStatus] = useState(
        searchParams.get("ipStatus") || "ALL",
    );
    const [selectedTypes, setSelectedTypes] = useState<string[]>(
        searchParams.get("types") ? searchParams.get("types")!.split(",") : [],
    );
    const [departmentId, setDepartmentId] = useState(
        searchParams.get("departmentId") || "",
    );
    const [locationId, setLocationId] = useState(
        searchParams.get("locationId") || "",
    );
    const [networkId, setNetworkId] = useState(
        searchParams.get("networkId") || "",
    );
    const [connectedToSwitchId, setConnectedToSwitchId] = useState(
        searchParams.get("connectedToSwitchId") || "",
    );

    // Filtros de Computador
    const [selectedOsId, setSelectedOsId] = useState<string | undefined>(
        searchParams.get("osId") || undefined,
    );
    const [selectedProcessorId, setSelectedProcessorId] = useState<
        string | undefined
    >(searchParams.get("processorId") || undefined);
    const [selectedDiskId, setSelectedDiskId] = useState<string | undefined>(
        searchParams.get("diskId") || undefined,
    );
    const [selectedRam, setSelectedRam] = useState<string | undefined>(
        searchParams.get("ram") || undefined,
    );

    // Filtros de Impressora
    const [printerModel, setPrinterModel] = useState(
        searchParams.get("printerModel") || searchParams.get("model") || "",
    );
    const [printerSerial, setPrinterSerial] = useState(
        searchParams.get("printerSerial") || "",
    );

    // Filtros de Switch
    const [switchModel, setSwitchModel] = useState(
        searchParams.get("switchModel") || "",
    );
    const [switchVendor, setSwitchVendor] = useState(
        searchParams.get("switchVendor") || "",
    );
    const [switchPorts, setSwitchPorts] = useState<number | undefined>(
        searchParams.get("switchPorts")
            ? Number(searchParams.get("switchPorts"))
            : undefined,
    );

    // Filtros de Access Point
    const [apModel, setApModel] = useState(searchParams.get("apModel") || "");
    const [apVendor, setApVendor] = useState(
        searchParams.get("apVendor") || "",
    );
    const [apSsid, setApSsid] = useState(searchParams.get("apSsid") || "");
    const [apFrequency, setApFrequency] = useState(
        searchParams.get("apFrequency") || "",
    );

    // Filtros de Câmera
    const [cameraFilters, setCameraFilters] = useState({
        hostname:
            searchParams.get("cameraHostname") ||
            searchParams.get("hostname") ||
            "",
        model:
            searchParams.get("cameraModel") || searchParams.get("model") || "",
    });

    const updateCameraFilter = (field: string, val?: string) => {
        const key = field
            .replace(/^camera/, "")
            .replace(/^Hostname$/, "hostname")
            .replace(/^Model$/, "model")
            .toLowerCase();

        setCameraFilters((prev) => ({
            ...prev,
            [key]: val || "",
        }));
    };

    // Filtros de Telefone
    const [phoneFilters, setPhoneFilters] = useState({
        hostname:
            searchParams.get("phoneHostname") ||
            searchParams.get("hostname") ||
            "",
        model:
            searchParams.get("phoneModel") || searchParams.get("model") || "",
        phoneNumber:
            searchParams.get("phoneNumber") ||
            searchParams.get("extension") ||
            "",
    });

    const updatePhoneFilter = (field: string, val?: string) => {
        const key = field
            .replace(/^phone/, "")
            .replace(/^Extension$/, "Number")
            .toLowerCase();

        const mappedKey = key === "number" ? "phoneNumber" : key;

        setPhoneFilters((prev) => ({
            ...prev,
            [mappedKey]: val || "",
        }));
    };

    const [isExportLoading, setIsExportLoading] = useState(false);
    const [exportData, setExportData] = useState<AssetReportData[]>([]);
    const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

    const handleApplyFilters = (
        overridePage?: number,
        overrideLimit?: number,
    ) => {
        const params = new URLSearchParams();
        const currentPage = overridePage ?? 1;
        const currentLimit =
            overrideLimit ?? parseInt(searchParams.get("limit") || "4", 10);

        params.set("page", currentPage.toString());
        params.set("limit", currentLimit.toString());

        if (search.trim()) params.set("search", search.trim());
        if (ipStatus !== "ALL") params.set("ipStatus", ipStatus);
        if (selectedTypes.length > 0)
            params.set("types", selectedTypes.join(","));
        if (departmentId) params.set("departmentId", departmentId);
        if (locationId) params.set("locationId", locationId);
        if (networkId) params.set("networkId", networkId);
        if (connectedToSwitchId)
            params.set("connectedToSwitchId", connectedToSwitchId);

        if (showAdvancedFilters) {
            if (selectedTypes.includes("COMPUTER")) {
                if (selectedOsId) params.set("osId", selectedOsId);
                if (selectedProcessorId)
                    params.set("processorId", selectedProcessorId);
                if (selectedDiskId) params.set("diskId", selectedDiskId);
                if (selectedRam) params.set("ram", selectedRam);
            }
            if (selectedTypes.includes("PRINTER")) {
                if (printerModel) params.set("printerModel", printerModel);
                if (printerSerial) params.set("printerSerial", printerSerial);
            }
            if (selectedTypes.includes("SWITCH")) {
                if (switchModel) params.set("switchModel", switchModel);
                if (switchVendor) params.set("switchVendor", switchVendor);
                if (switchPorts)
                    params.set("switchPorts", switchPorts.toString());
            }
            if (selectedTypes.includes("ACCESS_POINT")) {
                if (apModel) params.set("apModel", apModel);
                if (apVendor) params.set("apVendor", apVendor);
                if (apSsid) params.set("apSsid", apSsid);
                if (apFrequency) params.set("apFrequency", apFrequency);
            }
            if (selectedTypes.includes("CAMERA")) {
                if (cameraFilters.hostname)
                    params.set("cameraHostname", cameraFilters.hostname);
                if (cameraFilters.model)
                    params.set("cameraModel", cameraFilters.model);
            }
            if (selectedTypes.includes("PHONE")) {
                if (phoneFilters.hostname)
                    params.set("phoneHostname", phoneFilters.hostname);
                if (phoneFilters.model)
                    params.set("phoneModel", phoneFilters.model);
                if (phoneFilters.phoneNumber)
                    params.set("phoneNumber", phoneFilters.phoneNumber);
            }
        }

        startTransition(() => {
            router.push(`/reports-audit/reports?${params.toString()}`);
        });
    };

    const buildPayload = (limitOverride?: number): ReportQueryPayload => {
        const filters: SingleFilter[] = [];

        if (search.trim())
            filters.push({
                field: "search",
                operator: "contains",
                value: search.trim(),
            });
        if (ipStatus !== "ALL")
            filters.push({
                field: "hasIp",
                operator: "eq",
                value: ipStatus === "true",
            });
        if (selectedTypes.length > 0) {
            filters.push({
                field: "type",
                operator: selectedTypes.length > 1 ? "in" : "eq",
                value:
                    selectedTypes.length > 1 ? selectedTypes : selectedTypes[0],
            });
        }
        if (departmentId)
            filters.push({
                field: "departmentId",
                operator: "eq",
                value: departmentId,
            });
        if (locationId)
            filters.push({
                field: "locationId",
                operator: "eq",
                value: locationId,
            });
        if (networkId)
            filters.push({
                field: "networkId",
                operator: "eq",
                value: networkId,
            });
        if (connectedToSwitchId)
            filters.push({
                field: "connectedToSwitchId",
                operator: "eq",
                value: connectedToSwitchId,
            });

        if (selectedTypes.includes("COMPUTER")) {
            if (selectedOsId)
                filters.push({
                    field: "computer.osId",
                    operator: "eq",
                    value: selectedOsId,
                });
            if (selectedProcessorId)
                filters.push({
                    field: "computer.processorId",
                    operator: "eq",
                    value: selectedProcessorId,
                });
            if (selectedDiskId)
                filters.push({
                    field: "computer.diskId",
                    operator: "eq",
                    value: selectedDiskId,
                });
            if (selectedRam)
                filters.push({
                    field: "computer.memory",
                    operator: "eq",
                    value: selectedRam,
                });
        }

        if (selectedTypes.includes("PRINTER")) {
            if (printerModel)
                filters.push({
                    field: "printer.model",
                    operator: "contains",
                    value: printerModel,
                });
        }

        if (selectedTypes.includes("SWITCH")) {
            if (switchModel)
                filters.push({
                    field: "switch.model",
                    operator: "contains",
                    value: switchModel,
                });
            if (switchVendor)
                filters.push({
                    field: "switch.vendor",
                    operator: "contains",
                    value: switchVendor,
                });
            if (switchPorts)
                filters.push({
                    field: "switch.totalPorts",
                    operator: "eq",
                    value: switchPorts,
                });
        }

        if (selectedTypes.includes("ACCESS_POINT")) {
            if (apVendor)
                filters.push({
                    field: "accessPoint.vendor",
                    operator: "contains",
                    value: apVendor,
                });
            if (apModel)
                filters.push({
                    field: "accessPoint.model",
                    operator: "contains",
                    value: apModel,
                });
            if (apSsid)
                filters.push({
                    field: "accessPoint.ssid",
                    operator: "contains",
                    value: apSsid,
                });
            if (apFrequency)
                filters.push({
                    field: "accessPoint.frequencyBand",
                    operator: "contains",
                    value: apFrequency,
                });
        }

        if (selectedTypes.includes("CAMERA")) {
            if (cameraFilters.hostname) {
                filters.push({
                    field: "camera.hostname",
                    operator: "contains",
                    value: cameraFilters.hostname,
                });
            }
            if (cameraFilters.model) {
                filters.push({
                    field: "camera.model",
                    operator: "contains",
                    value: cameraFilters.model,
                });
            }
        }

        if (selectedTypes.includes("PHONE")) {
            if (phoneFilters.hostname) {
                filters.push({
                    field: "phone.hostname",
                    operator: "contains",
                    value: phoneFilters.hostname,
                });
            }
            if (phoneFilters.model) {
                filters.push({
                    field: "phone.model",
                    operator: "contains",
                    value: phoneFilters.model,
                });
            }
            if (phoneFilters.phoneNumber) {
                filters.push({
                    field: "phone.phoneNumber",
                    operator: "contains",
                    value: phoneFilters.phoneNumber,
                });
            }
        }

        return {
            filters,
            columns: ["patrimony", "type", "department", "location", "ip"],
            groupBy: "none",
            orderBy: { field: "createdAt", direction: "desc" as const },
            page: 1,
            limit: limitOverride || meta.limit,
        };
    };

    const handleClearFilters = () => {
        setSearch("");
        setIpStatus("ALL");
        setSelectedTypes([]);
        setDepartmentId("");
        setLocationId("");
        setNetworkId("");
        setConnectedToSwitchId("");
        setSelectedOsId(undefined);
        setSelectedProcessorId(undefined);
        setSelectedDiskId(undefined);
        setSelectedRam(undefined);
        setPrinterModel("");
        setPrinterSerial("");
        setSwitchModel("");
        setSwitchVendor("");
        setSwitchPorts(undefined);
        setApModel("");
        setApVendor("");
        setApSsid("");
        setApFrequency("");
        setCameraFilters({ hostname: "", model: "" });
        setPhoneFilters({ hostname: "", model: "", phoneNumber: "" });
        router.push(`/reports-audit/reports?page=1&limit=4`);
    };

    const handleExportPdf = async () => {
        setIsExportLoading(true);
        try {
            const res = await getAssetReportAction(buildPayload(10000));
            setExportData(res.data || []);
            setIsPrintModalOpen(true);
        } catch (error) {
            console.error("Erro na exportação em PDF:", error);
        } finally {
            setIsExportLoading(false);
        }
    };

    // 🟢 CHIPS DE FILTROS ATIVOS PARA TODOS OS TIPOS
    const getActiveChips = (): FilterChip[] => {
        const chips: FilterChip[] = [];

        if (search) {
            chips.push({
                key: "search",
                label: "Busca",
                value: search,
                onRemove: () => setSearch(""),
            });
        }
        if (ipStatus !== "ALL") {
            chips.push({
                key: "ipStatus",
                label: "IP",
                value: ipStatus === "true" ? "Com IP" : "Sem IP",
                onRemove: () => setIpStatus("ALL"),
            });
        }
        if (selectedTypes.length > 0) {
            chips.push({
                key: "types",
                label: "Tipos",
                value: selectedTypes.join(", "),
                onRemove: () => setSelectedTypes([]),
            });
        }

        if (departmentId) {
            const dep = options.departments.find((d) => d.id === departmentId);
            chips.push({
                key: "department",
                label: "Setor",
                value: dep?.name || departmentId,
                onRemove: () => setDepartmentId(""),
            });
        }
        if (locationId) {
            const loc = options.locations.find((l) => l.id === locationId);
            chips.push({
                key: "location",
                label: "Local",
                value: loc?.name || locationId,
                onRemove: () => setLocationId(""),
            });
        }
        if (networkId) {
            const net = options.networks.find((n) => n.id === networkId);
            chips.push({
                key: "network",
                label: "Rede",
                value: net?.name || networkId,
                onRemove: () => setNetworkId(""),
            });
        }
        if (connectedToSwitchId) {
            const sw = options.switches.find(
                (s) => s.id === connectedToSwitchId,
            );
            chips.push({
                key: "switch",
                label: "Switch Concentrador",
                value: sw?.hostname || connectedToSwitchId,
                onRemove: () => setConnectedToSwitchId(""),
            });
        }

        // --- COMPUTADOR ---
        if (selectedTypes.includes("COMPUTER")) {
            if (selectedOsId) {
                const os = options.operatingSystems.find(
                    (o) => o.id === selectedOsId,
                );
                chips.push({
                    key: "osId",
                    label: "S.O.",
                    value: os?.name || selectedOsId,
                    onRemove: () => setSelectedOsId(undefined),
                });
            }
            if (selectedProcessorId) {
                const proc = options.processors.find(
                    (p) => p.id === selectedProcessorId,
                );
                chips.push({
                    key: "processorId",
                    label: "Processador",
                    value: proc?.name || selectedProcessorId,
                    onRemove: () => setSelectedProcessorId(undefined),
                });
            }
            if (selectedDiskId) {
                const disk = options.disks.find((d) => d.id === selectedDiskId);
                chips.push({
                    key: "diskId",
                    label: "Disco",
                    value: disk?.name || selectedDiskId,
                    onRemove: () => setSelectedDiskId(undefined),
                });
            }
            if (selectedRam) {
                chips.push({
                    key: "ram",
                    label: "Memória RAM",
                    value: selectedRam,
                    onRemove: () => setSelectedRam(undefined),
                });
            }
        }

        // --- IMPRESSORA ---
        if (selectedTypes.includes("PRINTER") && printerModel) {
            chips.push({
                key: "printerModel",
                label: "Modelo Impressora",
                value: printerModel,
                onRemove: () => setPrinterModel(""),
            });
        }

        // --- SWITCH ---
        if (selectedTypes.includes("SWITCH")) {
            if (switchVendor) {
                chips.push({
                    key: "switchVendor",
                    label: "Fabricante Switch",
                    value: switchVendor,
                    onRemove: () => setSwitchVendor(""),
                });
            }
            if (switchModel) {
                chips.push({
                    key: "switchModel",
                    label: "Modelo Switch",
                    value: switchModel,
                    onRemove: () => setSwitchModel(""),
                });
            }
            if (switchPorts) {
                chips.push({
                    key: "switchPorts",
                    label: "Portas Switch",
                    value: String(switchPorts),
                    onRemove: () => setSwitchPorts(undefined),
                });
            }
        }

        // --- ACCESS POINT ---
        if (selectedTypes.includes("ACCESS_POINT")) {
            if (apVendor) {
                chips.push({
                    key: "apVendor",
                    label: "Fabricante AP",
                    value: apVendor,
                    onRemove: () => setApVendor(""),
                });
            }
            if (apModel) {
                chips.push({
                    key: "apModel",
                    label: "Modelo AP",
                    value: apModel,
                    onRemove: () => setApModel(""),
                });
            }
            if (apSsid) {
                chips.push({
                    key: "apSsid",
                    label: "SSID AP",
                    value: apSsid,
                    onRemove: () => setApSsid(""),
                });
            }
            if (apFrequency) {
                chips.push({
                    key: "apFrequency",
                    label: "Banda AP",
                    value: apFrequency,
                    onRemove: () => setApFrequency(""),
                });
            }
        }

        // --- CÂMERA ---
        if (selectedTypes.includes("CAMERA")) {
            if (cameraFilters.hostname) {
                chips.push({
                    key: "cameraHostname",
                    label: "Hostname Câmera",
                    value: cameraFilters.hostname,
                    onRemove: () => updateCameraFilter("hostname", ""),
                });
            }
            if (cameraFilters.model) {
                chips.push({
                    key: "cameraModel",
                    label: "Modelo Câmera",
                    value: cameraFilters.model,
                    onRemove: () => updateCameraFilter("model", ""),
                });
            }
        }

        // --- TELEFONE ---
        if (selectedTypes.includes("PHONE")) {
            if (phoneFilters.hostname) {
                chips.push({
                    key: "phoneHostname",
                    label: "Hostname Telefone",
                    value: phoneFilters.hostname,
                    onRemove: () => updatePhoneFilter("hostname", ""),
                });
            }
            if (phoneFilters.model) {
                chips.push({
                    key: "phoneModel",
                    label: "Modelo Telefone",
                    value: phoneFilters.model,
                    onRemove: () => updatePhoneFilter("model", ""),
                });
            }
            if (phoneFilters.phoneNumber) {
                chips.push({
                    key: "phoneNumber",
                    label: "Ramal Telefone",
                    value: phoneFilters.phoneNumber,
                    onRemove: () => updatePhoneFilter("phoneNumber", ""),
                });
            }
        }

        return chips;
    };

    const activeChips = getActiveChips();

    return (
        <div className="space-y-6">
            {/* CARDS DE KPI */}
            <ReportKpiCards summary={summary} />

            {/* CONTAINER DE FILTROS */}
            <div className="bg-card border border-border/80 rounded-2xl p-4 sm:p-6 space-y-5 shadow-xs transition-colors">
                <GeneralFilters
                    search={search}
                    onSearchChange={setSearch}
                    ipStatus={ipStatus}
                    onIpStatusChange={setIpStatus}
                    selectedTypes={selectedTypes}
                    onSelectedTypesChange={setSelectedTypes}
                    departmentId={departmentId}
                    onDepartmentIdChange={setDepartmentId}
                    locationId={locationId}
                    onLocationIdChange={setLocationId}
                    networkId={networkId}
                    onNetworkIdChange={setNetworkId}
                    connectedToSwitchId={connectedToSwitchId}
                    onConnectedToSwitchIdChange={setConnectedToSwitchId}
                    options={options}
                />

                {/* Botão de Especificações Avançadas */}
                {selectedTypes.length > 0 && (
                    <div className="pt-2 border-t border-border/60 flex justify-end">
                        <button
                            type="button"
                            onClick={() =>
                                setShowAdvancedFilters(!showAdvancedFilters)
                            }
                            className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-semibold py-1.5 px-3 rounded-lg bg-primary/10 border border-primary/20 transition-all cursor-pointer"
                        >
                            <SlidersHorizontal size={13} />
                            {showAdvancedFilters
                                ? "Ocultar Especificações Avançadas"
                                : "Mais Filtros (Especificações)"}
                            {showAdvancedFilters ? (
                                <ChevronUp size={13} />
                            ) : (
                                <ChevronDown size={13} />
                            )}
                        </button>
                    </div>
                )}

                {/* Gaveta de Filtros Avançados */}
                {showAdvancedFilters && (
                    <div className="space-y-4 pt-2 animate-in fade-in duration-200">
                        {selectedTypes.includes("COMPUTER") && (
                            <ReportComputerFilters
                                operatingSystems={options.operatingSystems}
                                processors={options.processors}
                                disks={options.disks}
                                selectedOsId={selectedOsId}
                                selectedProcessorId={selectedProcessorId}
                                selectedDiskId={selectedDiskId}
                                selectedRam={selectedRam}
                                onChange={(field, val) => {
                                    if (field === "osId") setSelectedOsId(val);
                                    if (field === "processorId")
                                        setSelectedProcessorId(val);
                                    if (field === "diskId")
                                        setSelectedDiskId(val);
                                    if (field === "memory") setSelectedRam(val);
                                }}
                            />
                        )}
                        {selectedTypes.includes("PRINTER") && (
                            <ReportPrinterFilters
                                model={printerModel}
                                onChange={(field, val) => {
                                    if (
                                        field === "model" ||
                                        field === "printerModel"
                                    ) {
                                        setPrinterModel(val || "");
                                    }
                                }}
                            />
                        )}
                        {selectedTypes.includes("SWITCH") && (
                            <ReportSwitchFilters
                                model={switchModel}
                                vendor={switchVendor}
                                totalPorts={switchPorts}
                                onChange={(field, val) => {
                                    if (field === "model")
                                        setSwitchModel(val || "");
                                    if (field === "vendor")
                                        setSwitchVendor(val || "");
                                    if (field === "totalPorts")
                                        setSwitchPorts(val);
                                }}
                            />
                        )}
                        {selectedTypes.includes("ACCESS_POINT") && (
                            <ReportAccessPointFilters
                                model={apModel}
                                vendor={apVendor}
                                ssid={apSsid}
                                frequencyBand={apFrequency}
                                onChange={(field, val) => {
                                    if (field === "model")
                                        setApModel(val || "");
                                    if (field === "vendor")
                                        setApVendor(val || "");
                                    if (field === "ssid") setApSsid(val || "");
                                    if (field === "frequencyBand")
                                        setApFrequency(val || "");
                                }}
                            />
                        )}
                        {selectedTypes.includes("CAMERA") && (
                            <ReportCameraFilters
                                hostname={cameraFilters.hostname}
                                model={cameraFilters.model}
                                onChange={updateCameraFilter}
                            />
                        )}
                        {selectedTypes.includes("PHONE") && (
                            <ReportPhoneFilters
                                hostname={phoneFilters.hostname}
                                model={phoneFilters.model}
                                phoneNumber={phoneFilters.phoneNumber}
                                onChange={updatePhoneFilter}
                            />
                        )}
                    </div>
                )}

                {/* BOTÕES DE AÇÃO */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-3 border-t border-border/60">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                            type="button"
                            onClick={() => handleApplyFilters(1)}
                            disabled={isPending}
                            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-xl text-sm font-semibold transition-all w-full sm:w-auto disabled:opacity-50 cursor-pointer shadow-xs"
                        >
                            {isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Filter className="w-4 h-4" />
                            )}
                            Aplicar Filtros
                        </button>

                        <button
                            type="button"
                            onClick={handleClearFilters}
                            disabled={isPending}
                            className="flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-border/60 px-4 py-2 rounded-xl text-sm font-medium transition-all w-full sm:w-auto cursor-pointer"
                        >
                            <FilterX className="w-4 h-4" />
                            Limpar
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={handleExportPdf}
                        disabled={isExportLoading}
                        className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all w-full sm:w-auto disabled:opacity-50 cursor-pointer shadow-xs"
                    >
                        {isExportLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <PrinterIcon className="w-4 h-4" />
                        )}
                        Exportar Relatório PDF
                    </button>
                </div>

                {/* CHIPS DE FILTROS ATIVOS */}
                <ActiveChips
                    chips={activeChips}
                    onApply={() => handleApplyFilters(1)}
                />
            </div>

            {/* TABELA DE ATIVOS E PAGINAÇÃO */}
            <div className="bg-card border border-border/80 rounded-2xl overflow-hidden shadow-xs transition-colors">
                <ReportTableContent data={initialData} />
                <Pagination
                    {...meta}
                    itemLabel="relatórios"
                    onPageChange={(p) => handleApplyFilters(p)}
                    onLimitChange={(l) => handleApplyFilters(1, l)}
                />
            </div>

            <ReportPrintModal
                isOpen={isPrintModalOpen}
                onClose={() => setIsPrintModalOpen(false)}
                activeFiltersLabels={activeChips}
                summary={summary}
                data={exportData}
            />
        </div>
    );
}
