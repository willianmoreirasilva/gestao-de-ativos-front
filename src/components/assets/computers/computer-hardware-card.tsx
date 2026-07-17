"use client";

import { Cpu, HardDrive, Monitor, Pencil } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { AssetNotesCard } from "../assets-notes-card";
import { SystemSpecsEditModal } from "./components/system-specs-edit-modal";

type OptionItem = { id: string; name: string };

type ComputerDetails = {
    hostname?: string | null;
    username: string;
    memory?: string | null;
    mac?: string | null;
    processor?: OptionItem | null;
    disk?: OptionItem | null;
    operatingSystem?: OptionItem | null;
    notes?: string | null;
};

type Props = {
    assetId: string;
    computer: ComputerDetails | null | undefined;
    options: {
        processors: OptionItem[];
        operatingSystems: OptionItem[];
        disks: OptionItem[];
    };
};

export function ComputerHardwareCard({ assetId, computer, options }: Props) {
    const [isEditOpen, setIsEditOpen] = useState(false);

    return (
        <Card className="md:col-span-2 shadow-sm border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
            {/* Header com botão de edição fixo e discreto à direita */}
            <CardHeader className="border-b border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/20 py-3 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-bold tracking-wide uppercase text-zinc-500 flex items-center gap-2">
                    <Monitor size={16} className="text-blue-500" />{" "}
                    Especificações do Sistema
                </CardTitle>
                <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                    onClick={() => setIsEditOpen(true)}
                    title="Editar especificações"
                >
                    <Pencil size={14} />
                </Button>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-4">
                <div className="space-y-1">
                    <span className="text-xs text-muted-foreground block">
                        Sistema Operacional
                    </span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                        {computer?.operatingSystem?.name || "Não Informado"}
                    </span>
                </div>
                <div className="space-y-1">
                    <span className="text-xs text-muted-foreground block">
                        Hostname Interno
                    </span>
                    <span className="font-mono font-medium text-sm text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20 px-2 py-0.5 rounded w-fit block">
                        {computer?.hostname || "N/A"}
                    </span>
                </div>
                <div className="space-y-1">
                    <span className="text-xs text-muted-foreground block">
                        Processador (CPU)
                    </span>
                    <div className="flex items-center gap-1.5 font-semibold text-zinc-900 dark:text-zinc-100">
                        <Cpu size={14} className="text-zinc-400" />
                        <span>{computer?.processor?.name || "N/A"}</span>
                    </div>
                </div>
                <div className="space-y-1">
                    <span className="text-xs text-muted-foreground block">
                        Memória RAM Instalada
                    </span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                        {computer?.memory || "N/A"}
                    </span>
                </div>
                <div className="space-y-1">
                    <span className="text-xs text-muted-foreground block">
                        Armazenamento (Disco)
                    </span>
                    <div className="flex items-center gap-1.5 font-semibold text-zinc-900 dark:text-zinc-100">
                        <HardDrive size={14} className="text-zinc-400" />
                        <span>{computer?.disk?.name || "N/A"}</span>
                    </div>
                </div>
                <div className="space-y-1">
                    <span className="text-xs text-muted-foreground block">
                        Endereço MAC físico
                    </span>
                    <span className="font-mono text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                        {computer?.mac || "N/A"}
                    </span>
                </div>
                <AssetNotesCard notes={computer?.notes} />
            </CardContent>

            <SystemSpecsEditModal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                assetId={assetId}
                computer={computer}
                options={options}
            />
        </Card>
    );
}
