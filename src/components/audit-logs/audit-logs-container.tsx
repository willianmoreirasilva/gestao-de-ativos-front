"use client";

import { FileText, RefreshCw, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";

import { AuditLogDetailsModal } from "@/components/audit-logs/audit-log-details-modal";
import { AuditLogFilters } from "@/components/audit-logs/audit-log-filters";
import { AuditLogPagination } from "@/components/audit-logs/audit-log-pagination";
import { AuditLogTable } from "@/components/audit-logs/audit-log-table";
import type { AuditLog, AuditLogResponse } from "@/types/audit";

interface AuditLogsContainerProps {
    initialData: AuditLogResponse;
}

export function AuditLogsContainer({ initialData }: AuditLogsContainerProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

    const handleRefresh = () => {
        startTransition(() => {
            router.refresh();
        });
    };

    const hasLogs = initialData.data.length > 0;

    return (
        <div className="space-y-6 p-6">
            {/* Cabeçalho */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
                        <FileText className="w-6 h-6 text-indigo-500" />
                        Logs de Auditoria
                    </h1>
                    <p className="text-sm text-zinc-400 mt-1">
                        Acompanhe todas as atividades, acessos e alterações
                        realizadas no sistema.
                    </p>
                </div>
                <button
                    onClick={handleRefresh}
                    disabled={isPending}
                    className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-zinc-700 w-fit disabled:opacity-50"
                >
                    <RefreshCw
                        className={`w-4 h-4 ${isPending ? "animate-spin" : ""}`}
                    />
                    Atualizar
                </button>
            </div>

            {/* Componente de Filtros e Busca */}
            <AuditLogFilters />

            {/* Container da Tabela e Paginação */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
                {!hasLogs && !isPending ? (
                    <div className="py-16 text-center space-y-3">
                        <ShieldAlert className="w-12 h-12 text-zinc-600 mx-auto" />
                        <h3 className="text-base font-semibold text-zinc-300">
                            Nenhum registro encontrado
                        </h3>
                        <p className="text-sm text-zinc-500 max-w-sm mx-auto">
                            Não encontramos registros de auditoria para os
                            parâmetros e filtros selecionados.
                        </p>
                    </div>
                ) : (
                    <>
                        <AuditLogTable
                            logs={initialData.data}
                            isLoading={isPending}
                            onSelectLog={(log) => setSelectedLog(log)}
                        />

                        {/* Paginação fixa na parte inferior da tabela */}
                        <AuditLogPagination
                            total={initialData.meta.total}
                            page={initialData.meta.page}
                            limit={initialData.meta.limit}
                            totalPages={initialData.meta.totalPages}
                        />
                    </>
                )}
            </div>

            {/* Modal de Detalhes do Log */}
            <AuditLogDetailsModal
                log={selectedLog}
                isOpen={!!selectedLog}
                onClose={() => setSelectedLog(null)}
            />
        </div>
    );
}
