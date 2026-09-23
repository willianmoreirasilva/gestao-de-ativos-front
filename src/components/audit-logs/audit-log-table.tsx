"use client";

import React from "react";

import { getFormattedEntity } from "@/lib/audit-utils";
import type { AuditLog } from "@/types/audit";

import { AuditLogActionBadge } from "./audit-log-action-badge";

interface AuditLogTableProps {
    logs: AuditLog[];
    isLoading: boolean;
    onSelectLog?: (log: AuditLog) => void;
}

export function AuditLogTable({
    logs,
    isLoading,
    onSelectLog,
}: AuditLogTableProps) {
    if (isLoading) {
        return (
            <div className="p-4 space-y-3">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="h-12 bg-zinc-800/40 rounded-lg animate-pulse"
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-300">
                <thead className="bg-zinc-950/60 border-b border-zinc-800 text-xs text-zinc-400 font-medium">
                    <tr>
                        <th className="py-3.5 px-4">Usuário</th>
                        <th className="py-3.5 px-4">Ação</th>
                        <th className="py-3.5 px-4">Entidade</th>
                        <th className="py-3.5 px-4">ID da Entidade</th>
                        <th className="py-3.5 px-4">Data/Hora</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                    {logs.map((log) => {
                        const dateFormatted = new Date(
                            log.createdAt,
                        ).toLocaleString("pt-BR", {
                            dateStyle: "short",
                            timeStyle: "medium",
                        });

                        const userName =
                            log.user?.name ?? "Usuário desconhecido";
                        const userEmail = log.user?.email ?? "";

                        return (
                            <tr
                                key={log.id}
                                onClick={() => onSelectLog?.(log)}
                                className={`hover:bg-zinc-800/40 transition-colors ${
                                    onSelectLog ? "cursor-pointer" : ""
                                }`}
                            >
                                <td className="py-3.5 px-4">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-semibold text-zinc-200 shrink-0">
                                            {userName
                                                .substring(0, 2)
                                                .toUpperCase()}
                                        </div>
                                        <div className="truncate">
                                            <p className="font-medium text-zinc-200 leading-tight">
                                                {userName}
                                            </p>
                                            {userEmail && (
                                                <span className="text-[11px] text-zinc-500 block truncate">
                                                    {userEmail}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="py-3.5 px-4">
                                    <AuditLogActionBadge action={log.action} />
                                </td>

                                {/* Célula de Entidade formatada com sub-tipo */}
                                <td className="py-3.5 px-4 font-medium text-zinc-200">
                                    {getFormattedEntity(log)}
                                </td>

                                <td className="py-3.5 px-4 font-mono text-xs text-zinc-400 truncate max-w-30">
                                    {log.entityId || "-"}
                                </td>
                                <td className="py-3.5 px-4 text-xs text-zinc-400 whitespace-nowrap">
                                    {dateFormatted}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
