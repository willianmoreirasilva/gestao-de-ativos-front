"use client";

// Importações dos Cards de Especificidades Técnicas
import { CameraHardwareCard } from "@/components/assets/cameras/camera-hardware-card";
import { ComputerHardwareCard } from "@/components/assets/computers/computer-hardware-card";
import { PhoneHardwareCard } from "@/components/assets/phones/phone-hardware-card";
import { PrinterHardwareCard } from "@/components/assets/printers/printer-hardware-card";
import type { AssetItem, OptionItem } from "@/types/assets";

// Importações dos Cards Compartilhados
import { AssetAllocationCard } from "./asset-allocation-card";
import { AssetConnectivityCard } from "./asset-connectivity-card";

interface AssetTechnicalCardProps {
    mode: "create" | "view";
    asset?: AssetItem;
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

    // MODO VISUALIZAÇÃO DETALHADA
    return (
        <div className="flex flex-col gap-6 w-full">
            {/* 🌟 SEÇÃO SUPERIOR: Especificações e Rede lado a lado */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start w-full">
                {/* CARD DE ESPECIFICAÇÕES DO SISTEMA / HARDWARE */}
                <div className="lg:col-span-2 h-full">
                    {/* 💻 Computadores */}
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

                    {/* 🖨️ Impressoras */}
                    {asset.type === "PRINTER" && asset.printer && (
                        <PrinterHardwareCard
                            assetId={asset.id}
                            printer={asset.printer}
                        />
                    )}

                    {/* 📞 Telefones / Ramais */}
                    {asset.type === "PHONE" && asset.phone && (
                        <PhoneHardwareCard
                            assetId={asset.id}
                            phone={asset.phone}
                        />
                    )}

                    {/* 📹 Câmeras */}
                    {asset.type === "CAMERA" && asset.camera && (
                        <CameraHardwareCard
                            assetId={asset.id}
                            camera={asset.camera}
                        />
                    )}
                </div>

                {/* CARD DE CONECTIVIDADE IP & REDE */}
                <div className="lg:col-span-1 h-full">
                    <AssetConnectivityCard
                        assetId={asset.id}
                        ip={asset.ip}
                        vlanType={asset.vlanType as any}
                        vlanTag={asset.vlanTag}
                        connectedToSwitch={asset.connectedToSwitch}
                        switchPort={asset.switchPort?.toString() || null}
                        switches={options.switches}
                    />
                </div>
            </div>

            {/* 🌟 SEÇÃO INFERIOR: Alocação */}
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
