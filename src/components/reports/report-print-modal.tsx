"use client";

import { FileText, Printer, X } from "lucide-react";
import React from "react";

interface PrintModalProps {
    isOpen: boolean;
    onClose: () => void;
    activeFiltersLabels: Array<{ key: string; label: string; value: string }>;
    summary: {
        totalAssets: number;
        withIp: number;
        withoutIp: number;
        departmentsCount: number;
    };
    data: any[];
}

export function ReportPrintModal({
    isOpen,
    onClose,
    activeFiltersLabels,
    summary,
    data,
}: PrintModalProps) {
    if (!isOpen) return null;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 overflow-y-auto">
            <div className="bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl">
                {/* Cabeçalho da Modal */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 print:hidden">
                    <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-indigo-400" />
                        <h3 className="font-semibold text-lg">
                            Pré-visualização do Relatório
                        </h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                            <Printer className="w-4 h-4" />
                            Imprimir / Exportar PDF
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Conteúdo Imprimível */}
                <div className="p-8 overflow-y-auto print:p-0 print:overflow-visible text-black bg-white">
                    {/* Estilos específicos de impressão */}
                    <style jsx global>{`
                        @media print {
                            body * {
                                visibility: hidden;
                            }
                            .print-container,
                            .print-container * {
                                visibility: visible;
                            }
                            .print-container {
                                position: absolute;
                                left: 0;
                                top: 0;
                                width: 100%;
                                font-family: sans-serif;
                                font-size: 11px;
                                color: #000;
                            }
                            .page-break {
                                page-break-after: always;
                            }
                            thead {
                                display: table-header-group;
                            }
                        }
                    `}</style>

                    <div className="print-container space-y-6">
                        {/* Header do Relatório */}
                        <div className="border-b-2 border-zinc-900 pb-4 flex justify-between items-end">
                            <div>
                                <h1 className="text-2xl font-bold uppercase tracking-tight text-zinc-900">
                                    Relatório Inventário de Ativos
                                </h1>
                                <p className="text-xs text-zinc-600">
                                    Sistema de Gestão de Infraestrutura e TI
                                </p>
                            </div>
                            <div className="text-right text-xs text-zinc-500">
                                <p>
                                    Gerado em:{" "}
                                    {new Date().toLocaleString("pt-BR")}
                                </p>
                                <p>Total de registros: {summary.totalAssets}</p>
                            </div>
                        </div>

                        {/* Filtros Aplicados */}
                        <div className="bg-zinc-100 p-4 rounded-lg text-xs space-y-2 border border-zinc-200">
                            <span className="font-bold text-zinc-800 uppercase block mb-1">
                                Filtros Aplicados na Consulta
                            </span>
                            {activeFiltersLabels.length === 0 ? (
                                <p className="text-zinc-500 italic">
                                    Nenhum filtro restritivo aplicado (Exibindo
                                    escopo geral).
                                </p>
                            ) : (
                                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                    {activeFiltersLabels.map((f, i) => (
                                        <div key={i} className="flex gap-1">
                                            <span className="font-semibold text-zinc-700">
                                                {f.label}:
                                            </span>
                                            <span className="text-zinc-900">
                                                {f.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Resumo dos KPIs */}
                        <div className="grid grid-cols-4 gap-4 text-center">
                            <div className="border border-zinc-300 p-3 rounded">
                                <span className="block text-xs text-zinc-500 font-semibold uppercase">
                                    Total Ativos
                                </span>
                                <span className="text-xl font-bold text-zinc-900">
                                    {summary.totalAssets}
                                </span>
                            </div>
                            <div className="border border-zinc-300 p-3 rounded">
                                <span className="block text-xs text-zinc-500 font-semibold uppercase">
                                    Com IP
                                </span>
                                <span className="text-xl font-bold text-emerald-700">
                                    {summary.withIp}
                                </span>
                            </div>
                            <div className="border border-zinc-300 p-3 rounded">
                                <span className="block text-xs text-zinc-500 font-semibold uppercase">
                                    Sem IP
                                </span>
                                <span className="text-xl font-bold text-amber-700">
                                    {summary.withoutIp}
                                </span>
                            </div>
                            <div className="border border-zinc-300 p-3 rounded">
                                <span className="block text-xs text-zinc-500 font-semibold uppercase">
                                    Setores
                                </span>
                                <span className="text-xl font-bold text-purple-700">
                                    {summary.departmentsCount}
                                </span>
                            </div>
                        </div>

                        {/* Tabela Principal */}
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="border-b-2 border-zinc-800 bg-zinc-100 text-zinc-800">
                                    <th className="py-2 px-2 font-bold">
                                        Patrimônio
                                    </th>
                                    <th className="py-2 px-2 font-bold">
                                        Ativo / Hostname
                                    </th>
                                    <th className="py-2 px-2 font-bold">
                                        Tipo
                                    </th>
                                    <th className="py-2 px-2 font-bold">
                                        Departamento
                                    </th>
                                    <th className="py-2 px-2 font-bold">
                                        Localidade
                                    </th>
                                    <th className="py-2 px-2 font-bold">
                                        Endereço IP
                                    </th>
                                    <th className="py-2 px-2 font-bold">
                                        VLAN
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item, index) => (
                                    <tr
                                        key={item.id || index}
                                        className="border-b border-zinc-200 hover:bg-zinc-50"
                                    >
                                        <td className="py-2 px-2 font-mono">
                                            {item.patrimony || "S/N"}
                                        </td>
                                        <td className="py-2 px-2 font-medium">
                                            {item.computer?.hostname ||
                                                item.printer?.hostname ||
                                                item.camera?.hostname ||
                                                item.phone?.phoneNumber ||
                                                "-"}
                                        </td>
                                        <td className="py-2 px-2">
                                            {item.type}
                                        </td>
                                        <td className="py-2 px-2">
                                            {item.department?.name || "-"}
                                        </td>
                                        <td className="py-2 px-2">
                                            {item.location?.name || "-"}
                                        </td>
                                        <td className="py-2 px-2 font-mono">
                                            {item.ip?.address || "Sem IP"}
                                        </td>
                                        <td className="py-2 px-2">
                                            {item.ip?.network?.vlanTag
                                                ? `VLAN ${item.ip.network.vlanTag}`
                                                : "-"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
