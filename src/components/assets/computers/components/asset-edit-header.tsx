"use client";

import { ArrowLeft, Save } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

interface HeaderProps {
    assetId: string;
    patrimony: string;
    isPending: boolean;
}

export function AssetEditHeader({
    assetId,
    patrimony,
    isPending,
}: HeaderProps) {
    const router = useRouter();

    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-100 dark:border-zinc-900 pb-5">
            <div>
                <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
                    <span>Ativos</span>
                    <span>/</span>
                    <span>Computadores</span>
                    <span>/</span>
                    <span className="text-zinc-900 dark:text-zinc-100 font-medium">
                        Editar
                    </span>
                </div>
                <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-500">
                    Editar Computador{" "}
                    <span className="text-zinc-400 dark:text-zinc-600 font-normal">
                        #{patrimony || assetId.slice(0, 8)}
                    </span>
                </h1>
            </div>

            <div className="flex items-center gap-3">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isPending}
                    onClick={() => router.push(`/assets/computers/${assetId}`)}
                    className="gap-2 text-xs font-medium h-9"
                >
                    <ArrowLeft size={14} /> Cancelar
                </Button>
                <Button
                    id="btn-submit-main"
                    type="submit"
                    size="sm"
                    disabled={isPending}
                    className="bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950 hover:bg-zinc-900 gap-2 text-xs font-semibold h-9 shadow-sm"
                >
                    <Save size={14} />
                    {isPending ? "Gravando..." : "Salvar Alterações"}
                </Button>
            </div>
        </div>
    );
}
