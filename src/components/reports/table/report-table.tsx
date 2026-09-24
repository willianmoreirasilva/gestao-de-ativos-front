"use client";

import React from "react";

import { Card } from "@/components/ui/card";

import { ReportPagination } from "./report-pagination";
import { ReportTableContent } from "./report-table-content";

interface ReportTableProps {
    data: any[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
    isLoading: boolean;
    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
}

export function ReportTable({
    data,
    meta,
    isLoading,
    onPageChange,
    onLimitChange,
}: ReportTableProps) {
    return (
        <Card className="border border-border/80 bg-card rounded-2xl overflow-hidden shadow-xs transition-colors p-0 flex flex-col">
            {/* Tabela de Conteúdo */}
            <ReportTableContent data={data} isLoading={isLoading} />

            {/* Rodapé e Paginação Integrada */}
            <ReportPagination
                meta={meta}
                isPending={isLoading}
                onPageChange={onPageChange}
                onLimitChange={onLimitChange}
            />
        </Card>
    );
}
