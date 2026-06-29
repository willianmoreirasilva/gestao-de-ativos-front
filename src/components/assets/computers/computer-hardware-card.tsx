import { Cpu, HardDrive, Monitor } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ComputerHardwareCardProps {
    computer?: {
        os?: string | null;
        hostname?: string | null;
        processor?: string | null;
        memory?: string | null;
        disk?: string | null;
        mac?: string | null;
    } | null;
}

export function ComputerHardwareCard({ computer }: ComputerHardwareCardProps) {
    return (
        <Card className="md:col-span-2 shadow-sm border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
            <CardHeader className="border-b border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/20 py-4">
                <CardTitle className="text-sm font-bold tracking-wide uppercase text-zinc-500 flex items-center gap-2">
                    <Monitor size={16} className="text-blue-500" /> Especificações do Sistema
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-4">
                <div className="space-y-1">
                    <span className="text-xs text-muted-foreground block">Sistema Operacional</span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">{computer?.os || "Não Informado"}</span>
                </div>
                <div className="space-y-1">
                    <span className="text-xs text-muted-foreground block">Hostname Interno</span>
                    <span className="font-mono font-medium text-sm text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20 px-2 py-0.5 rounded w-fit block">
                        {computer?.hostname || "N/A"}
                    </span>
                </div>
                <div className="space-y-1">
                    <span className="text-xs text-muted-foreground block">Processador (CPU)</span>
                    <div className="flex items-center gap-1.5 font-semibold text-zinc-900 dark:text-zinc-100">
                        <Cpu size={14} className="text-zinc-400" />
                        <span>{computer?.processor || "N/A"}</span>
                    </div>
                </div>
                <div className="space-y-1">
                    <span className="text-xs text-muted-foreground block">Memória RAM Instalada</span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">{computer?.memory || "N/A"}</span>
                </div>
                <div className="space-y-1">
                    <span className="text-xs text-muted-foreground block">Armazenamento (Disco)</span>
                    <div className="flex items-center gap-1.5 font-semibold text-zinc-900 dark:text-zinc-100">
                        <HardDrive size={14} className="text-zinc-400" />
                        <span>{computer?.disk || "N/A"}</span>
                    </div>
                </div>
                <div className="space-y-1">
                    <span className="text-xs text-muted-foreground block">Endereço MAC físico</span>
                    <span className="font-mono text-sm font-semibold text-zinc-700 dark:text-zinc-300">{computer?.mac || "—"}</span>
                </div>
            </CardContent>
        </Card>
    );
}