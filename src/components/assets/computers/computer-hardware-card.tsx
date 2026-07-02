"use client";

import { Cpu, HardDrive, Monitor, Pencil } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { SystemSpecsEditModal } from "./components/system-specs-edit-modal"; // 🌟 Import do modal técnico

// Definição estrita das novas tipagens alinhadas ao banco
type OptionItem = { id: string; name: string };

type ComputerDetails = {
    hostname?: string | null;
    username: string;
    memory?: string | null;
    mac?: string | null;
    processor?: OptionItem | null;
    disk?: OptionItem | null;
    operatingSystem?: OptionItem | null; // 🌟 Mapeado conforme seu novo retorno de API
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
        // 🌟 'relative group': Permite a microinteração do botão flutuante sumir/aparecer suavemente
        <Card className="relative group md:col-span-2 shadow-sm border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 transition-all duration-200 hover:border-zinc-300 dark:hover:border-zinc-700">
            {/* 🌟 Botão de Ação Flutuante Contextual com Blur */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 translate-y-1 group-hover:translate-y-0">
                <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 text-xs font-semibold gap-1.5 shadow-sm border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm"
                    onClick={() => setIsEditOpen(true)}
                >
                    <Pencil size={13} /> Modificar Hardware
                </Button>
            </div>

            <CardHeader className="border-b border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/20 py-4">
                <CardTitle className="text-sm font-bold tracking-wide uppercase text-zinc-500 flex items-center gap-2">
                    <Monitor size={16} className="text-blue-500" />{" "}
                    Especificações do Sistema
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-4">
                {/* Sistema Operacional - Lendo .operatingSystem.name */}
                <div className="space-y-1">
                    <span className="text-xs text-muted-foreground block">
                        Sistema Operacional
                    </span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                        {computer?.operatingSystem?.name || "Não Informado"}
                    </span>
                </div>

                {/* Hostname Interno */}
                <div className="space-y-1">
                    <span className="text-xs text-muted-foreground block">
                        Hostname Interno
                    </span>
                    <span className="font-mono font-medium text-sm text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20 px-2 py-0.5 rounded w-fit block">
                        {computer?.hostname || "N/A"}
                    </span>
                </div>

                {/* Processador (CPU) - Lendo .processor.name */}
                <div className="space-y-1">
                    <span className="text-xs text-muted-foreground block">
                        Processador (CPU)
                    </span>
                    <div className="flex items-center gap-1.5 font-semibold text-zinc-900 dark:text-zinc-100">
                        <Cpu size={14} className="text-zinc-400" />
                        <span>{computer?.processor?.name || "N/A"}</span>
                    </div>
                </div>

                {/* Memória RAM */}
                <div className="space-y-1">
                    <span className="text-xs text-muted-foreground block">
                        Memória RAM Instalada
                    </span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                        {computer?.memory || "N/A"}
                    </span>
                </div>

                {/* Armazenamento (Disco) - Lendo .disk.name */}
                <div className="space-y-1">
                    <span className="text-xs text-muted-foreground block">
                        Armazenamento (Disco)
                    </span>
                    <div className="flex items-center gap-1.5 font-semibold text-zinc-900 dark:text-zinc-100">
                        <HardDrive size={14} className="text-zinc-400" />
                        <span>{computer?.disk?.name || "N/A"}</span>
                    </div>
                </div>

                {/* Endereço MAC Físico */}
                <div className="space-y-1">
                    <span className="text-xs text-muted-foreground block">
                        Endereço MAC físico
                    </span>
                    <span className="font-mono text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                        {computer?.mac || "—"}
                    </span>
                </div>
            </CardContent>

            {/* 🌟 Modal de Edição In-Place com os Comboboxes de Criação Rápida */}
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
