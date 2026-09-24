"use client";

import { RefreshCw, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";

import { AuditLogDetailsModal } from "@/components/audit-logs/audit-log-details-modal";
import { AuditLogFilters } from "@/components/audit-logs/audit-log-filters";
import { AuditLogTable } from "@/components/audit-logs/audit-log-table";
import { BackButton } from "@/components/users/back-button";
import { PageTitle } from "@/components/users/page-title";
import type { AuditLog, AuditLogResponse } from "@/types/audit";

import { Pagination } from "../pagination";

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
        <div className="space-y-6 px-1.5 md:px-0">
            {/* Cabeçalho Padronizado */}
            <PageTitle
                title="Logs de Auditoria"
                description="Acompanhe todas as atividades, acessos e alterações realizadas no sistema."
                leftSide={<BackButton />}
                rightSide={
                    <button
                        onClick={handleRefresh}
                        disabled={isPending}
                        className="flex items-center gap-2 bg-secondary hover:bg-muted text-secondary-foreground px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border border-border/80 w-fit cursor-pointer shadow-2xs disabled:opacity-50"
                    >
                        <RefreshCw
                            className={`w-4 h-4 text-muted-foreground ${
                                isPending ? "animate-spin text-primary" : ""
                            }`}
                        />
                        Atualizar
                    </button>
                }
            />

            {/* Componente de Filtros e Busca */}
            <AuditLogFilters />

            {/* Container da Tabela e Paginação */}
            <div className="bg-card border border-border/80 rounded-2xl overflow-hidden shadow-xs transition-colors">
                {!hasLogs && !isPending ? (
                    <div className="py-16 text-center space-y-3 px-4">
                        <div className="w-12 h-12 rounded-full bg-muted/60 border border-border/80 flex items-center justify-center mx-auto text-muted-foreground">
                            <ShieldAlert className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-semibold text-foreground">
                            Nenhum registro encontrado
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
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
                        <Pagination
                            total={initialData.meta.total}
                            page={initialData.meta.page}
                            limit={initialData.meta.limit}
                            totalPages={initialData.meta.totalPages}
                            itemLabel="logs"
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
