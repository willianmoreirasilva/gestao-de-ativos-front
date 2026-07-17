"use client";

import { AlertTriangle, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

type Props = {
    name: string;
    onConfirm: () => void;
    isDeleting: boolean;
    disabled?: boolean;
    error?: string | null;
    open: boolean;
    setOpen: (open: boolean) => void;
};

export function ConfirmDeleteDialog({
    name,
    onConfirm,
    isDeleting,
    disabled,
    error,
    open,
    setOpen,
}: Props) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div
                    className="inline-block"
                    title={
                        disabled
                            ? "Não é possível excluir o ativo no momento"
                            : `Excluir ${name}`
                    }
                >
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-zinc-500 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-950/30 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-40"
                        disabled={disabled}
                    >
                        <Trash2 size={16} />
                    </Button>
                </div>
            </DialogTrigger>
            <DialogContent className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xl">
                <DialogHeader>
                    <DialogTitle className="text-zinc-900 dark:text-zinc-100 font-bold">
                        Tem certeza absoluta?
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground">
                        Esta ação não pode ser desfeita. Isso excluirá
                        permanentemente **{name}**
                    </DialogDescription>
                </DialogHeader>

                {/* EXIBIÇÃO DO ERRO DO SERVIDOR */}
                {error && (
                    <div className="flex items-start gap-2.5 p-3 text-xs font-medium rounded-lg bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 animate-in fade-in-50 duration-200">
                        <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}

                <DialogFooter className="pt-4 border-t border-zinc-100 dark:border-zinc-900 mt-4 gap-2 sm:gap-0">
                    <DialogClose asChild>
                        <Button
                            variant="ghost"
                            disabled={isDeleting}
                            className="h-9 text-xs font-bold hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300"
                        >
                            Cancelar
                        </Button>
                    </DialogClose>

                    {/* 🌟 CORRIGIDO: Bloqueia apenas se já estiver enviando a deleção */}
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="h-9 text-xs font-bold bg-red-600 hover:bg-red-700 text-white dark:bg-red-950 dark:hover:bg-red-900 dark:text-red-200 transition-colors"
                    >
                        {isDeleting ? "Excluindo..." : "Confirmar Exclusão"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
