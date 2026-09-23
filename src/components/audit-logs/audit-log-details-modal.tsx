"use client";

import { Activity, Calendar, Check, Copy, Tag } from "lucide-react";
import React, { useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { getFormattedEntity } from "@/lib/audit-utils";
import type { AuditLog } from "@/types/audit";

import { AuditLogActionBadge } from "./audit-log-action-badge";

interface AuditLogDetailsModalProps {
    log: AuditLog | null;
    isOpen: boolean;
    onClose: () => void;
}

// Dicionário de tradução para chaves do banco de dados em nomes legíveis
const FIELD_LABELS: Record<string, string> = {
    ipId: "Endereço IP",
    ipAddress: "Endereço IP",
    connectedToSwitchId: "Switch Conectado",
    switchName: "Switch Conectado",
    switchId: "Switch",
    status: "Status",
    name: "Nome",
    description: "Descrição",
};

export function AuditLogDetailsModal({
    log,
    isOpen,
    onClose,
}: AuditLogDetailsModalProps) {
    const [copied, setCopied] = useState(false);

    if (!log) return null;

    const formattedDate = new Date(log.createdAt).toLocaleString("pt-BR", {
        dateStyle: "medium",
        timeStyle: "medium",
    });

    const handleCopyJson = () => {
        navigator.clipboard.writeText(JSON.stringify(log.details, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    /**
     * Formata os valores de 'antes' e 'depois'.
     * Suporta dados primitivos e objetos enriquecidos enviados pelo backend:
     * Exemplo de objeto: { address: '192.168.1.10' } ou { name: 'SW-CORE-01' }
     */
    const formatValue = (val: any): string => {
        if (val === null || val === undefined || val === "—") return "—";

        if (typeof val === "object") {
            if (val.address && val.name) return `${val.address} (${val.name})`;
            if (val.address) return val.address;
            if (val.name) return val.name;
            if (val.label) return val.label;
            return JSON.stringify(val);
        }

        return String(val);
    };

    // Processamento estruturado de Before / After ou Changes
    const renderChanges = () => {
        if (!log.details)
            return (
                <p className="text-sm text-zinc-500">
                    Nenhum detalhe adicional registrado.
                </p>
            );

        const details = log.details;
        console.log("DETAILS = ", details);
        let diffs: Array<{ field: string; before: any; after: any }> = [];

        if (details.before || details.after) {
            const beforeObj = details.before || {};
            const afterObj = details.after || {};
            const allKeys = Array.from(
                new Set([...Object.keys(beforeObj), ...Object.keys(afterObj)]),
            );

            diffs = allKeys
                .filter(
                    (key) =>
                        JSON.stringify(beforeObj[key]) !==
                        JSON.stringify(afterObj[key]),
                )
                .map((key) => ({
                    field: key,
                    before: beforeObj[key] ?? "—",
                    after: afterObj[key] ?? "—",
                }));
        } else if (details.changes && typeof details.changes === "object") {
            diffs = Object.entries(details.changes).map(
                ([field, val]: [string, any]) => ({
                    field,
                    before: val?.before ?? "—",
                    after: val?.after ?? "—",
                }),
            );
        }

        if (diffs.length > 0) {
            return (
                <div className="border border-zinc-800 rounded-lg overflow-x-auto bg-zinc-950/50">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 font-medium">
                            <tr>
                                <th className="p-3">Campo</th>
                                <th className="p-3">Antes</th>
                                <th className="p-3">Depois</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                            {diffs.map((diff, i) => (
                                <tr key={i} className="hover:bg-zinc-900/40">
                                    <td className="p-3 font-mono text-indigo-400 font-medium break-all">
                                        {FIELD_LABELS[diff.field] || diff.field}
                                    </td>
                                    <td className="p-3 text-rose-400/90 font-mono break-all">
                                        {formatValue(diff.before)}
                                    </td>
                                    <td className="p-3 text-emerald-400/90 font-mono break-all">
                                        {formatValue(diff.after)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        }

        // Se for JSON genérico de detalhes (como os logs de login/logout/ações diretas)
        return (
            <div className="relative bg-zinc-950 border border-zinc-800 rounded-lg p-4 font-mono text-xs text-zinc-300 overflow-hidden">
                <button
                    onClick={handleCopyJson}
                    className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-zinc-800/90 hover:bg-zinc-700 text-zinc-300 px-2 py-1 rounded text-[11px] transition-colors border border-zinc-700"
                >
                    {copied ? (
                        <Check size={12} className="text-emerald-400" />
                    ) : (
                        <Copy size={12} />
                    )}
                    {copied ? "Copiado!" : "Copiar JSON"}
                </button>
                <pre className="whitespace-pre-wrap break-all pr-24 overflow-x-auto">
                    {JSON.stringify(log.details, null, 2)}
                </pre>
            </div>
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl w-full max-h-[90vh] bg-zinc-900 border-zinc-800 text-zinc-100 p-6 flex flex-col overflow-hidden">
                <DialogHeader className="shrink-0">
                    <DialogTitle className="text-lg font-semibold flex items-center gap-2">
                        <Activity className="w-5 h-5 text-indigo-400" />
                        Detalhes da Atividade
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 pt-2 overflow-y-auto pr-1">
                    {/* Grid de Metadados */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-950/40 border border-zinc-800/80 rounded-xl p-4">
                        <div className="flex items-start gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-full bg-zinc-800 flex shrink-0 items-center justify-center text-xs font-bold text-indigo-400">
                                {log.user.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                                <span className="text-xs text-zinc-500 block">
                                    Usuário
                                </span>
                                <p className="text-sm font-medium text-zinc-200 truncate">
                                    {log.user.name}
                                </p>
                                <span className="text-xs text-zinc-400 truncate block">
                                    {log.user.email}
                                </span>
                            </div>
                        </div>

                        <div>
                            <span className="text-xs text-zinc-500 block">
                                Ação
                            </span>
                            <div className="mt-1">
                                <AuditLogActionBadge action={log.action} />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Tag className="w-4 h-4 text-zinc-500 shrink-0" />
                            <div>
                                <span className="text-xs text-zinc-500 block">
                                    Entidade
                                </span>
                                <p className="text-sm font-medium text-zinc-200">
                                    {getFormattedEntity(log)}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-zinc-500 shrink-0" />
                            <div>
                                <span className="text-xs text-zinc-500 block">
                                    Data/Hora
                                </span>
                                <p className="text-sm font-medium text-zinc-200">
                                    {formattedDate}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Alterações */}
                    <div className="min-w-0">
                        <h4 className="text-sm font-medium text-zinc-300 mb-2">
                            Alterações Registradas
                        </h4>
                        {renderChanges()}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
