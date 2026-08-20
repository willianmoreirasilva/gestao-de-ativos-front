"use client";

import {
    Check,
    Copy,
    Edit2,
    Hash,
    Loader2,
    Printer,
    Save,
    Tag,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { updatePrinterSpecsAction } from "@/actions/asset-specs.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface PrinterHardwareCardProps {
    assetId: string;
    printer: {
        id?: string;
        model?: string | null;
        serial?: string | null;
        code?: string | null;
        notes?: string | null;
    };
}

export function PrinterHardwareCard({
    assetId,
    printer,
}: PrinterHardwareCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const [model, setModel] = useState(printer.model || "");
    const [serial, setSerial] = useState(printer.serial || "");
    const [code, setCode] = useState(printer.code || "");
    const [notes, setNotes] = useState(printer.notes || "");

    const handleCopyCode = (text: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success(`Código ${text} copiado!`, { position: "bottom-right" });
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const res = await updatePrinterSpecsAction(assetId, {
                model,
                serial,
                code,
                notes,
            });

            if (res.success) {
                toast.success("Especificações atualizadas com sucesso!");
                setIsEditing(false);
            } else {
                toast.error(res.error || "Erro ao salvar alterações.");
            }
        } catch {
            toast.error("Erro inesperado ao atualizar a impressora.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm space-y-5">
            {/* Cabeçalho */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800/80">
                <div className="flex items-center gap-2">
                    <Printer
                        className="text-purple-600 dark:text-purple-400 shrink-0"
                        size={18}
                    />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                        Especificações da Impressora
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
                    {/* Grid de Atributos em Bloco */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Modelo */}
                        <div className="p-3.5 rounded-lg bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800/60 flex flex-col justify-center">
                            <span className="text-[11px] font-medium text-zinc-400">
                                Modelo
                            </span>
                            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5">
                                {printer.model || "Não informado"}
                            </span>
                        </div>

                        {/* Número de Série */}
                        <div className="p-3.5 rounded-lg bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800/60 flex flex-col justify-center">
                            <span className="text-[11px] font-medium text-zinc-400 flex items-center gap-1">
                                <Tag size={11} className="text-zinc-400" /> Nº
                                de Série
                            </span>
                            <span className="text-sm font-mono text-zinc-800 dark:text-zinc-200 mt-0.5">
                                {printer.serial || "N/A"}
                            </span>
                        </div>
                    </div>

                    {/* Card de Destaque: Código de Chamado Outsourcing */}
                    <div className="p-3.5 rounded-lg bg-purple-950/10 dark:bg-purple-950/30 border border-purple-200/50 dark:border-purple-800/40 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2.5">
                            <div className="p-2 rounded-md bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300">
                                <Hash size={16} />
                            </div>
                            <div>
                                <span className="text-[11px] font-semibold text-purple-700 dark:text-purple-300 block">
                                    Código de Chamado (Outsourcing)
                                </span>
                                <span className="text-sm font-mono font-bold text-zinc-900 dark:text-zinc-100">
                                    {printer.code || "Sem código atribuído"}
                                </span>
                            </div>
                        </div>

                        {printer.code && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleCopyCode(printer.code!)}
                                className="h-8 text-xs gap-1.5 border-purple-200 dark:border-purple-800 bg-white dark:bg-zinc-900 hover:bg-purple-50 dark:hover:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-semibold transition-colors"
                            >
                                {copied ? (
                                    <Check
                                        size={13}
                                        className="text-emerald-500"
                                    />
                                ) : (
                                    <Copy size={13} />
                                )}
                                {copied ? "Copiado!" : "Copiar Código"}
                            </Button>
                        )}
                    </div>
                </div>
            ) : (
                /* Formulário de Edição */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                            Modelo da Impressora
                        </label>
                        <Input
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            placeholder="Ex: Kyocera Ecosys M3655"
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
                            placeholder="Ex: KYOS-00329"
                            className="h-9 text-xs font-mono uppercase bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                        />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                        <label className="text-xs font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1">
                            <Hash size={12} /> Código de Chamado (Outsourcing)
                        </label>
                        <Input
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="Ex: COD-PRT-00329"
                            className="h-9 text-xs font-mono bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                        />
                    </div>
                </div>
            )}

            {/* Seção de Notas / Observações */}
            <div className="space-y-1.5 pt-1">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Notas & Observações
                </label>
                {isEditing ? (
                    <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Adicione observações sobre suprimentos, contrato ou histórico..."
                        className="text-xs min-h-20 resize-none bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                    />
                ) : (
                    <div className="p-3.5 bg-zinc-50/50 dark:bg-zinc-900/40 rounded-lg border border-zinc-100 dark:border-zinc-800/60 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {printer.notes || "Nenhuma observação registrada."}
                    </div>
                )}
            </div>
        </div>
    );
}
