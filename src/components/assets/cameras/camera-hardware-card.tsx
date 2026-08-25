"use client";

import {
    Camera,
    Check,
    Copy,
    Edit2,
    Hash,
    Loader2,
    Save,
    Tag,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { updateCameraSpecsAction } from "@/actions/assets/cameras.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface CameraHardwareCardProps {
    assetId: string;
    camera: {
        id?: string;
        hostname?: string | null;
        model?: string | null;
        channel?: number | null;
        serial?: string | null;
        mac?: string | null;
        notes?: string | null;
    };
}

export function CameraHardwareCard({
    assetId,
    camera,
}: CameraHardwareCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [copiedMac, setCopiedMac] = useState(false);

    const [hostname, setHostname] = useState(camera.hostname || "");
    const [model, setModel] = useState(camera.model || "");
    const [channel, setChannel] = useState(camera.channel?.toString() || "");
    const [serial, setSerial] = useState(camera.serial || "");
    const [mac, setMac] = useState(camera.mac || "");
    const [notes, setNotes] = useState(camera.notes || "");

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
            const res = await updateCameraSpecsAction(assetId, {
                hostname,
                model,
                channel: channel ? Number(channel) : undefined,
                serial,
                mac,
                notes,
            });

            if (res.success) {
                toast.success("Especificações da câmera atualizadas!");
                setIsEditing(false);
            } else {
                toast.error(res.error || "Erro ao salvar alterações.");
            }
        } catch {
            toast.error("Erro inesperado ao atualizar a câmera.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm space-y-5">
            {/* Cabeçalho */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800/80">
                <div className="flex items-center gap-2">
                    <Camera
                        className="text-blue-600 dark:text-blue-400 shrink-0"
                        size={18}
                    />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                        Especificações da Câmera / DVR
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

            {/* Visualização Modo Leitura vs Edição */}
            {!isEditing ? (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Hostname */}
                        <div className="p-3.5 rounded-lg bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800/60 flex flex-col justify-center">
                            <span className="text-[11px] font-medium text-zinc-400">
                                Hostname / Identificador
                            </span>
                            <span className="text-sm font-semibold font-mono text-zinc-900 dark:text-zinc-100 mt-0.5">
                                {camera.hostname || "Não informado"}
                            </span>
                        </div>

                        {/* Modelo */}
                        <div className="p-3.5 rounded-lg bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800/60 flex flex-col justify-center">
                            <span className="text-[11px] font-medium text-zinc-400">
                                Modelo do Equipamento
                            </span>
                            <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5">
                                {camera.model || "N/A"}
                            </span>
                        </div>

                        {/* Número de Série */}
                        <div className="p-3.5 rounded-lg bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800/60 flex flex-col justify-center">
                            <span className="text-[11px] font-medium text-zinc-400 flex items-center gap-1">
                                <Tag size={11} className="text-zinc-400" /> Nº
                                de Série
                            </span>
                            <span className="text-sm font-mono text-zinc-800 dark:text-zinc-200 mt-0.5">
                                {camera.serial || "N/A"}
                            </span>
                        </div>

                        {/* Canal DVR */}
                        <div className="p-3.5 rounded-lg bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800/60 flex flex-col justify-center">
                            <span className="text-[11px] font-medium text-zinc-400 flex items-center gap-1">
                                <Hash size={11} className="text-zinc-400" />{" "}
                                Canal do Gravador (DVR/NVR)
                            </span>
                            <span className="text-sm font-mono font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">
                                {camera.channel !== null &&
                                camera.channel !== undefined
                                    ? `CH ${String(camera.channel).padStart(2, "0")}`
                                    : "N/A"}
                            </span>
                        </div>
                    </div>

                    {/* Destaque para MAC Address */}
                    <div className="p-3.5 rounded-lg bg-blue-950/10 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-800/40 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2.5">
                            <div className="p-2 rounded-md bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300">
                                <Tag size={16} />
                            </div>
                            <div>
                                <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-300 block">
                                    Endereço MAC Físico
                                </span>
                                <span className="text-sm font-mono font-bold text-zinc-900 dark:text-zinc-100">
                                    {camera.mac ||
                                        "Sem endereço MAC registrado"}
                                </span>
                            </div>
                        </div>

                        {camera.mac && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleCopyMac(camera.mac!)}
                                className="h-8 text-xs gap-1.5 border-blue-200 dark:border-blue-800 bg-white dark:bg-zinc-900 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold transition-colors"
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
                /* Formulário de Edição */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                            Hostname da Câmera
                        </label>
                        <Input
                            value={hostname}
                            onChange={(e) => setHostname(e.target.value)}
                            placeholder="Ex: CAM-DVR-00064"
                            className="h-9 text-xs font-mono bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                            Modelo do Equipamento
                        </label>
                        <Input
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            placeholder="Ex: Intelbras VIP 1230 B"
                            className="h-9 text-xs bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
                            <Tag size={12} className="text-zinc-400" /> Número
                            de Série
                        </label>
                        <Input
                            value={serial}
                            onChange={(e) => setSerial(e.target.value)}
                            placeholder="Ex: SN-CAM-00064"
                            className="h-9 text-xs font-mono uppercase bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
                            <Hash size={12} /> Canal no DVR/NVR
                        </label>
                        <Input
                            type="number"
                            min={1}
                            value={channel}
                            onChange={(e) => setChannel(e.target.value)}
                            placeholder="Ex: 1"
                            className="h-9 text-xs font-mono bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                        />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                        <label className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
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
                        placeholder="Adicione observações de posicionamento, ângulo, manutenção..."
                        className="text-xs min-h-20 resize-none bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                    />
                ) : (
                    <div className="p-3.5 bg-zinc-50/50 dark:bg-zinc-900/40 rounded-lg border border-zinc-100 dark:border-zinc-800/60 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {camera.notes || "Nenhuma observação registrada."}
                    </div>
                )}
            </div>
        </div>
    );
}
