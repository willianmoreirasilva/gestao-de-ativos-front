import { Boxes, Globe, ShieldAlert, Wifi } from "lucide-react";

interface ReportKpiCardsProps {
    summary: {
        totalAssets: number;
        withIp: number;
        withoutIp: number;
        departmentsCount: number;
    };
}

export function ReportKpiCards({ summary }: ReportKpiCardsProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl flex items-center justify-between">
                <div>
                    <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">
                        Total de Ativos
                    </p>
                    <p className="text-2xl font-bold text-white mt-1">
                        {summary.totalAssets}
                    </p>
                </div>
                <div className="p-3 bg-zinc-800/80 text-indigo-400 rounded-lg">
                    <Boxes className="w-6 h-6" />
                </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl flex items-center justify-between">
                <div>
                    <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">
                        Com Endereço IP
                    </p>
                    <p className="text-2xl font-bold text-emerald-400 mt-1">
                        {summary.withIp}
                    </p>
                </div>
                <div className="p-3 bg-emerald-950/40 text-emerald-400 rounded-lg">
                    <Globe className="w-6 h-6" />
                </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl flex items-center justify-between">
                <div>
                    <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">
                        Sem Endereço IP
                    </p>
                    <p className="text-2xl font-bold text-amber-400 mt-1">
                        {summary.withoutIp}
                    </p>
                </div>
                <div className="p-3 bg-amber-950/40 text-amber-400 rounded-lg">
                    <ShieldAlert className="w-6 h-6" />
                </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl flex items-center justify-between">
                <div>
                    <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">
                        Setores Atendidos
                    </p>
                    <p className="text-2xl font-bold text-purple-400 mt-1">
                        {summary.departmentsCount}
                    </p>
                </div>
                <div className="p-3 bg-purple-950/40 text-purple-400 rounded-lg">
                    <Wifi className="w-6 h-6" />
                </div>
            </div>
        </div>
    );
}
