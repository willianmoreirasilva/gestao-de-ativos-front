"use client";

// Importações dos Cards de Especificidades Técnicas
import { ComputerHardwareCard } from "@/components/assets/computers/computer-hardware-card";
import { OptionItem } from "@/types/assets";

// Importações dos Cards Compartilhados
import { AssetAllocationCard } from "./asset-allocation-card";
import { AssetConnectivityCard } from "./asset-connectivity-card";

interface AssetData {
    id: string;
    type: "COMPUTER" | "PRINTER" | "PHONE" | "CAMERA";
    patrimony?: string | null;
    vlanType: "GENERAL_DATA" | "CAMERA_VLAN" | "SWITCH_MGMT" | "WIFI_MGMT";
    vlanTag?: number | null;
    switchPort?: number | null;
    ip?: {
        id: string;
        address: string;
    } | null;
    connectedToSwitch?: {
        id: string;
        name: string;
    } | null;
    department?: {
        id: string;
        name: string;
    } | null;
    location?: {
        id: string;
        name: string;
        building?: string | null;
        floor?: string | null;
        room?: string | null;
    } | null;

    computer?: {
        id: string;
        username?: string | null;
        processorId?: string | null;
        operatingSystemId?: string | null;
        ramMemory?: string | null;
        storageDiskId?: string | null;
        notes?: string | null;
    } | null;
}

interface AssetTechnicalCardProps {
    mode: "create" | "view";
    asset?: AssetData;
    options: {
        departments: OptionItem[];
        locations: OptionItem[];
        switches: OptionItem[];
        processors?: OptionItem[];
        operatingSystems?: OptionItem[];
        disks?: OptionItem[];
    };
}

export function AssetTechnicalCard({
    mode,
    asset,
    options,
}: AssetTechnicalCardProps) {
    // MODO CRIAÇÃO (Cadastro Inicial Centralizado)
    if (mode === "create") {
        return (
            <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                    Cadastrar Novo Ativo de Infraestrutura
                </h2>
                <p className="text-xs text-muted-foreground mb-4">
                    Preencha as informações iniciais para registrar o patrimônio
                    na rede corporativa.
                </p>
                <div className="p-8 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg text-center text-xs text-zinc-400">
                    Formulário de captura inicial de ativo (Modo Criação).
                </div>
            </div>
        );
    }

    if (!asset) {
        return (
            <div className="p-4 text-xs text-rose-500 font-semibold bg-rose-50 dark:bg-rose-950/20 border border-rose-200 rounded-lg">
                Erro crítico: Dados do ativo não foram fornecidos para exibição.
            </div>
        );
    }

    const resolvedUsername =
        asset.type === "COMPUTER"
            ? asset.computer?.username
            : "Utilizador Padrão";

    // MODO VISUALIZAÇÃO DETALHADA (Layout Corrigido)
    return (
        <div className="flex flex-col gap-6 w-full">
            {/* 🌟 SEÇÃO SUPERIOR: Especificações e Rede lado a lado */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start w-full">
                {/* CARD DE ESPECIFICAÇÕES DO SISTEMA (Ocupa 2 colunas para melhor legibilidade dos dados) */}
                <div className="lg:col-span-2 h-full">
                    {asset.type === "COMPUTER" && asset.computer && (
                        <ComputerHardwareCard
                            assetId={asset.id}
                            computer={asset.computer}
                            options={{
                                processors: options.processors || [],
                                operatingSystems:
                                    options.operatingSystems || [],
                                disks: options.disks || [],
                            }}
                        />
                    )}
                </div>

                {/* CARD DE CONECTIVIDADE IP & REDE (Ocupa 1 coluna ao lado) */}
                <div className="lg:col-span-1 h-full">
                    <AssetConnectivityCard
                        assetId={asset.id}
                        ip={asset.ip}
                        vlanType={asset.vlanType}
                        vlanTag={asset.vlanTag}
                        connectedToSwitch={asset.connectedToSwitch}
                        switchPort={asset.switchPort?.toString() || null}
                        switches={options.switches}
                    />
                </div>
            </div>

            {/* 🌟 SEÇÃO INFERIOR: Alocação ocupando todo o espaço horizontal disponível */}
            <div className="w-full">
                <AssetAllocationCard
                    assetId={asset.id}
                    patrimony={asset.patrimony}
                    username={resolvedUsername}
                    department={asset.department}
                    location={asset.location}
                    options={{
                        departments: options.departments,
                        locations: options.locations,
                    }}
                />
            </div>
        </div>
    );
}
