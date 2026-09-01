"use client";

import {
    Check,
    Copy,
    Edit2,
    Hash,
    Layers,
    Loader2,
    Network,
    Save,
    Tag,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { updateSwitchAction } from "@/actions/switches";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface SwitchHardwareCardProps {
    assetId: string;
    switchData: {
        id?: string;
        hostname?: string | null;
        vendor?: string | null;
        model?: string | null;
        totalPorts?: number | null;
        mac?: string | null;
        notes?: string | null;
    };
}

export function SwitchHardwareCard({
    assetId,
    switchData,
}: SwitchHardwareCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [copiedMac, setCopiedMac] = useState(false);

    const [hostname, setHostname] = useState(switchData.hostname || "");
    const [vendor, setVendor] = useState(switchData.vendor || "");
    const [model, setModel] = useState(switchData.model || "");
    const [totalPorts, setTotalPorts] = useState(
        switchData.totalPorts?.toString() || "",
    );
    const [mac, setMac] = useState(switchData.mac || "");
    const [notes, setNotes] = useState(switchData.notes || "");

    const handleCopyMac = (macAddress: string) => {
        if (!macAddress) return;
        navigator.clipboard.writeText(macAddress);
        setCopiedMac(true);
        toast.success(`MAC ${macAddress} copiado!`, {
            position: "bottom-right",
        });
        setTimeout(() => setCopiedMac(false), 2000);
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            // No seu schema, o ID do Switch é o próprio ID do Asset
            const res = await updateSwitchAction(assetId, {
                hostname,
                vendor,
                model,
                totalPorts: totalPorts ? Number(totalPorts) : undefined,
                mac,
                notes,
            });

            if (res.success) {
                toast.success("Especificações do switch atualizadas!");
                setIsEditing(false);
            } else {
                toast.error(res.error || "Erro ao salvar alterações.");
            }
        } catch {
            toast.error("Erro inesperado ao atualizar o switch.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm space-y-5">
            {/* Cabeçalho */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800/80">
                <div className="flex items-center gap-2">
                    <Network
                        className="text-emerald-600 dark:text-emerald-400 shrink-0"
                        size={18}
                    />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                        Especificações do Switch
                    </h3>
                </div>

                {!isEditing ? (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                        className="h-7 text-xs gap-1.5 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                    >
                        <Edit2 size={12} /> Editar
                    </Button>
                ) : (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsEditing(false)}
                            disabled={isLoading}
                            className="h-7 text-xs"
                        >
                            Cancelar
                        </Button>
                        <Button
                            size="sm"
                            onClick={handleSave}
                            disabled={isLoading}
                            className="h-7 text-xs bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 gap-1.5"
                        >
                            {isLoading ? (
                                <Loader2 size={12} className="animate-spin" />
                            ) : (
                                <Save size={12} />
                            )}
                            Salvar
                        </Button>
                    </div>
                )}
            </div>

            {/* Modo Leitura / Edição */}
            {!isEditing ? (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3.5 rounded-lg bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800/60 flex flex-col justify-center">
                            <span className="text-[11px] font-medium text-zinc-400">
                                Hostname / Identificador
                            </span>
                            <span className="text-sm font-semibold font-mono text-zinc-900 dark:text-zinc-100 mt-0.5">
                                {switchData.hostname || "Não informado"}
                            </span>
                        </div>

                        <div className="p-3.5 rounded-lg bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800/60 flex flex-col justify-center">
                            <span className="text-[11px] font-medium text-zinc-400 flex items-center gap-1">
                                <Layers size={11} className="text-zinc-400" />{" "}
                                Fabricante (Vendor)
                            </span>
                            <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5">
                                {switchData.vendor || "N/A"}
                            </span>
                        </div>

                        <div className="p-3.5 rounded-lg bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800/60 flex flex-col justify-center">
                            <span className="text-[11px] font-medium text-zinc-400">
                                Modelo do Equipamento
                            </span>
                            <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5">
                                {switchData.model || "N/A"}
                            </span>
                        </div>

                        <div className="p-3.5 rounded-lg bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800/60 flex flex-col justify-center">
                            <span className="text-[11px] font-medium text-zinc-400 flex items-center gap-1">
                                <Hash size={11} className="text-zinc-400" />{" "}
                                Total de Portas
                            </span>
                            <span className="text-sm font-mono font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">
                                {switchData.totalPorts
                                    ? `${switchData.totalPorts} Portas`
                                    : "N/A"}
                            </span>
                        </div>
                    </div>

                    <div className="p-3.5 rounded-lg bg-emerald-950/10 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-800/40 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2.5">
                            <div className="p-2 rounded-md bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300">
                                <Tag size={16} />
                            </div>
                            <div>
                                <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 block">
                                    Endereço MAC Físico
                                </span>
                                <span className="text-sm font-mono font-bold text-zinc-900 dark:text-zinc-100">
                                    {switchData.mac ||
                                        "Sem endereço MAC registrado"}
                                </span>
                            </div>
                        </div>

                        {switchData.mac && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleCopyMac(switchData.mac!)}
                                className="h-8 text-xs gap-1.5 border-emerald-200 dark:border-emerald-800 bg-white dark:bg-zinc-900 hover:bg-emerald-50 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-semibold transition-colors"
                            >
                                {copiedMac ? (
                                    <Check
                                        size={13}
                                        className="text-emerald-500"
                                    />
                                ) : (
                                    <Copy size={13} />
                                )}
                                {copiedMac ? "Copiado!" : "Copiar MAC"}
                            </Button>
                        )}
                    </div>
                </div>
            ) : (
                /* Formulário */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                            Hostname do Switch
                        </label>
                        <Input
                            value={hostname}
                            onChange={(e) => setHostname(e.target.value)}
                            placeholder="Ex: SW-CORE-01"
                            className="h-9 text-xs font-mono bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                            Fabricante (Vendor)
                        </label>
                        <Input
                            value={vendor}
                            onChange={(e) => setVendor(e.target.value)}
                            placeholder="Ex: Cisco, Mikrotik, Ubiquiti"
                            className="h-9 text-xs bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                            Modelo do Equipamento
                        </label>
                        <Input
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            placeholder="Ex: CBS350-24T-4G"
                            className="h-9 text-xs bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
                            <Hash size={12} /> Total de Portas
                        </label>
                        <Input
                            type="number"
                            min={1}
                            value={totalPorts}
                            onChange={(e) => setTotalPorts(e.target.value)}
                            placeholder="Ex: 24"
                            className="h-9 text-xs font-mono bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                        />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                        <label className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <Tag size={12} /> Endereço MAC (Físico)
                        </label>
                        <Input
                            value={mac}
                            onChange={(e) => setMac(e.target.value)}
                            placeholder="Ex: 00:1B:44:11:33:40"
                            className="h-9 text-xs font-mono uppercase bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                        />
                    </div>
                </div>
            )}

            {/* Observações */}
            <div className="space-y-1.5 pt-1">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Notas & Observações
                </label>
                {isEditing ? (
                    <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Adicione observações sobre a porta de uplink, firmware, local no rack..."
                        className="text-xs min-h-20 resize-none bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                    />
                ) : (
                    <div className="p-3.5 bg-zinc-50/50 dark:bg-zinc-900/40 rounded-lg border border-zinc-100 dark:border-zinc-800/60 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {switchData.notes || "Nenhuma observação registrada."}
                    </div>
                )}
            </div>
        </div>
    );
}
