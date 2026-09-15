import React from "react";

import type { AssetReportData } from "@/types/report";

interface ReportTableContentProps {
    data: AssetReportData[];
}

const TYPE_LABELS: Record<string, string> = {
    COMPUTER: "Computador",
    PRINTER: "Impressora",
    SWITCH: "Switch",
    CAMERA: "Câmera",
    PHONE: "Telefone IP",
    ACCESS_POINT: "Access Point",
    SERVER: "Servidor",
};

export function ReportTableContent({ data }: ReportTableContentProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
                <thead>
                    <tr className="border-b border-zinc-800 bg-zinc-950/50 text-zinc-400">
                        <th className="py-3 px-6 font-medium">PATRIMÔNIO</th>
                        <th className="py-3 px-6 font-medium">
                            ATIVO / HOSTNAME
                        </th>
                        <th className="py-3 px-6 font-medium">TIPO</th>
                        <th className="py-3 px-6 font-medium">DEPARTAMENTO</th>
                        <th className="py-3 px-6 font-medium">LOCALIDADE</th>
                        <th className="py-3 px-6 font-medium">ENDEREÇO IP</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-zinc-200">
                    {data.length === 0 ? (
                        <tr>
                            <td
                                colSpan={6}
                                className="py-8 text-center text-zinc-500"
                            >
                                Nenhum ativo encontrado para os filtros
                                selecionados.
                            </td>
                        </tr>
                    ) : (
                        data.map((item) => {
                            const ipAddress =
                                typeof item.ip === "object"
                                    ? item.ip?.address
                                    : item.ip || item.ipAddress;

                            const hostname =
                                item.computer?.hostname ||
                                item.printer?.hostname ||
                                item.camera?.hostname ||
                                item.switch?.hostname ||
                                item.phone?.phoneNumber ||
                                item.accessPoint?.ssid ||
                                item.name ||
                                "-";

                            return (
                                <tr
                                    key={item.id}
                                    className="hover:bg-zinc-800/30 transition-colors"
                                >
                                    <td className="py-3.5 px-6 font-mono text-zinc-300">
                                        {item.patrimony || "S/N"}
                                    </td>
                                    <td className="py-3.5 px-6 font-medium text-white">
                                        {hostname}
                                    </td>
                                    <td className="py-3.5 px-6">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700">
                                            {TYPE_LABELS[item.type] ||
                                                item.type}
                                        </span>
                                    </td>
                                    <td className="py-3.5 px-6 text-zinc-300">
                                        {item.department?.name || "-"}
                                    </td>
                                    <td className="py-3.5 px-6 text-zinc-300">
                                        {item.location?.name || "-"}
                                    </td>
                                    <td className="py-3.5 px-6">
                                        {ipAddress ? (
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-mono bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                                                {ipAddress}
                                            </span>
                                        ) : (
                                            <span className="text-zinc-500 text-xs">
                                                Sem IP
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
}
