"use client";

import { FileDown, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

import { ReportFilters } from "@/components/reports/report-filters";
import { ReportKpiCards } from "@/components/reports/report-kpi-cards";
import { ReportTable } from "@/components/reports/report-table";
import { Button } from "@/components/ui/button";
import { buildReportPayload } from "@/lib/reports/build-report-payload";
import { getAssetOptionsAction } from "@/services/assets";
import { getAssetReportAction } from "@/services/reports.service";
import { OptionItem } from "@/types/assets";

export default function ReportsPage() {
    const [isPending, startTransition] = useTransition();
    const [isLoadingOptions, setIsLoadingOptions] = useState(true);

    // --- Listas de Opções do Servidor ---
    const [options, setOptions] = useState<{
        departments: OptionItem[];
        units: OptionItem[];
        networks: OptionItem[];
        operatingSystems: OptionItem[];
        processors: OptionItem[];
        switches: OptionItem[];
    }>({
        departments: [],
        units: [],
        networks: [],
        operatingSystems: [],
        processors: [],
        switches: [],
    });

    // --- Estados dos Filtros ---
    const [search, setSearch] = useState("");
    const [ipStatus, setIpStatus] = useState<"ALL" | "true" | "false">("ALL");
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

    const [departmentId, setDepartmentId] = useState<string | null>(null);
    const [locationId, setLocationId] = useState<string | null>(null);
    const [networkId, setNetworkId] = useState<string | null>(null);
    const [selectedOsId, setSelectedOsId] = useState<string | null>(null);
    const [selectedProcessorId, setSelectedProcessorId] = useState<
        string | null
    >(null);
    const [selectedSwitchId, setSelectedSwitchId] = useState<string | null>(
        null,
    );

    // --- Paginação ---
    const [page, setPage] = useState(1);
    const [limit] = useState(20);

    // --- Estado dos Resultados e Métricas ---
    const [reportData, setReportData] = useState<any[]>([]);
    const [totalRecords, setTotalRecords] = useState(0);

    // Carrega as opções dos comboboxes
    useEffect(() => {
        async function loadOptions() {
            try {
                const res = await getAssetOptionsAction();
                if (res.success && res.data) {
                    setOptions({
                        departments: res.data.departments ?? [],
                        units: res.data.units ?? [],
                        networks: (res.data as any).networks ?? [],
                        operatingSystems: res.data.operatingSystems ?? [],
                        processors: res.data.processors ?? [],
                        switches: res.data.switches ?? [],
                    });
                }
            } catch (err) {
                console.error("Erro ao carregar seletores de filtro:", err);
                toast.error("Erro ao carregar opções dos seletores.");
            } finally {
                setIsLoadingOptions(false);
            }
        }
        loadOptions();
    }, []);

    // Alterna a seleção múltipla de tipos de ativos
    const handleToggleType = (typeKey: string) => {
        setSelectedTypes((prev) =>
            prev.includes(typeKey)
                ? prev.filter((t) => t !== typeKey)
                : [...prev, typeKey],
        );
        setPage(1);
    };

    // Função para carregar os relatórios consumindo o serviço via POST
    const fetchReport = useCallback(() => {
        startTransition(async () => {
            const payload = buildReportPayload({
                search,
                ipStatus,
                selectedTypes,
                departmentId,
                locationId,
                networkId,
                selectedOsId,
                selectedProcessorId,
                selectedSwitchId,
                page,
                limit,
            });

            const response = await await getAssetReportAction(payload);

            if (response.error) {
                toast.error(response.error);
                return;
            }

            setReportData(response.data);
            setTotalRecords(response.meta.total);
        });
    }, [
        search,
        ipStatus,
        selectedTypes,
        departmentId,
        locationId,
        networkId,
        selectedOsId,
        selectedProcessorId,
        selectedSwitchId,
        page,
        limit,
    ]);

    // Re-executa a busca ao alterar os filtros
    useEffect(() => {
        fetchReport();
    }, [fetchReport]);

    // Cálculo das Métricas / KPIs locais
    const kpiStats = {
        total: totalRecords,
        withIp: reportData.filter((a) => a.ip?.address || a.ipId).length,
        withoutIp: reportData.filter((a) => !a.ip?.address && !a.ipId).length,
        departmentsCount: options.departments.length,
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-12 px-4 sm:px-6">
            {/* Cabeçalho Superior */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                        Relatórios de Ativos
                    </h1>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Filtre, analise e exporte dados detalhados da sua
                        infraestrutura de TI
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={fetchReport}
                        disabled={isPending}
                        className="h-9 text-xs font-semibold gap-1.5"
                    >
                        <RefreshCw
                            size={14}
                            className={isPending ? "animate-spin" : ""}
                        />
                        Atualizar
                    </Button>

                    <Button
                        size="sm"
                        className="h-9 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 shadow-sm"
                        onClick={() =>
                            toast.info("Exportação em desenvolvimento...")
                        }
                    >
                        <FileDown size={14} />
                        Exportar XLSX / CSV
                    </Button>
                </div>
            </div>

            {/* Cards de Métricas / KPIs */}
            <ReportKpiCards
                total={kpiStats.total}
                withIp={kpiStats.withIp}
                withoutIp={kpiStats.withoutIp}
                departmentsCount={kpiStats.departmentsCount}
            />

            {/* Painel Central de Filtros */}
            <ReportFilters
                search={search}
                onSearchChange={(val) => {
                    setSearch(val);
                    setPage(1);
                }}
                ipStatus={ipStatus}
                onIpStatusChange={(val) => {
                    setIpStatus(val);
                    setPage(1);
                }}
                selectedTypes={selectedTypes}
                onToggleType={handleToggleType}
                onClearTypes={() => {
                    setSelectedTypes([]);
                    setPage(1);
                }}
                departments={options.departments}
                locations={options.units}
                networks={options.networks}
                operatingSystems={options.operatingSystems}
                processors={options.processors}
                switches={options.switches}
                departmentId={departmentId}
                locationId={locationId}
                networkId={networkId}
                selectedOsId={selectedOsId}
                selectedProcessorId={selectedProcessorId}
                selectedSwitchId={selectedSwitchId}
                onDepartmentChange={(val) => {
                    setDepartmentId(val);
                    setPage(1);
                }}
                onLocationChange={(val) => {
                    setLocationId(val);
                    setPage(1);
                }}
                onNetworkChange={(val) => {
                    setNetworkId(val);
                    setPage(1);
                }}
                onOsChange={(val) => {
                    setSelectedOsId(val);
                    setPage(1);
                }}
                onProcessorChange={(val) => {
                    setSelectedProcessorId(val);
                    setPage(1);
                }}
                onSwitchChange={(val) => {
                    setSelectedSwitchId(val);
                    setPage(1);
                }}
            />

            {/* Tabela de Resultados */}
            <ReportTable
                data={reportData}
                total={totalRecords}
                isLoading={isPending || isLoadingOptions}
            />
        </div>
    );
}
