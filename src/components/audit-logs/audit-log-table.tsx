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
            <div className="p-4 space-y-3 bg-card rounded-2xl border border-border/80">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="h-12 bg-muted/60 rounded-xl animate-pulse"
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="bg-card border border-border/80 rounded-2xl overflow-hidden shadow-xs transition-colors">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-foreground">
                    <thead className="bg-muted/40 border-b border-border/80 text-xs text-muted-foreground font-semibold">
                        <tr>
                            <th className="py-3.5 px-4">Usuário</th>
                            <th className="py-3.5 px-4">Ação</th>
                            <th className="py-3.5 px-4">Entidade</th>
                            <th className="py-3.5 px-4">ID da Entidade</th>
                            <th className="py-3.5 px-4">Data/Hora</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
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
                                    className={`hover:bg-muted/50 transition-colors ${
                                        onSelectLog ? "cursor-pointer" : ""
                                    }`}
                                >
                                    <td className="py-3.5 px-4">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-7 h-7 rounded-full bg-secondary border border-border/80 flex items-center justify-center text-xs font-semibold text-secondary-foreground shrink-0">
                                                {userName
                                                    .substring(0, 2)
                                                    .toUpperCase()}
                                            </div>
                                            <div className="truncate max-w-[200px]">
                                                <p className="font-medium text-foreground leading-tight truncate">
                                                    {userName}
                                                </p>
                                                {userEmail && (
                                                    <span className="text-[11px] text-muted-foreground block truncate">
                                                        {userEmail}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3.5 px-4 whitespace-nowrap">
                                        <AuditLogActionBadge
                                            action={log.action}
                                        />
                                    </td>

                                    <td className="py-3.5 px-4 font-semibold text-foreground whitespace-nowrap">
                                        {getFormattedEntity(log)}
                                    </td>

                                    <td className="py-3.5 px-4 font-mono text-xs text-muted-foreground truncate max-w-[150px]">
                                        {log.entityId || "-"}
                                    </td>
                                    <td className="py-3.5 px-4 text-xs text-muted-foreground whitespace-nowrap">
                                        {dateFormatted}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
