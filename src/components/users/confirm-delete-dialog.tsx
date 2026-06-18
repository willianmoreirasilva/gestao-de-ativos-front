"use client";

import { Delete, AlertTriangle } from "lucide-react";
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
import { Button } from "@/components/ui/button";

type Props = {
    name: string;
    onConfirm: () => void;
    isDeleting: boolean;
    disabled?: boolean;
    error?: string | null; // receber erro da Action
    open: boolean; // Controla se o modal está aberto
    setOpen: (open: boolean) => void; // Função para mudar o estado de aberto/fechado
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
                <Button variant="destructive" disabled={disabled}>
                    <Delete size={16} />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Tem certeza?</DialogTitle>
                    <DialogDescription>
                        Esta ação não pode ser desfeita. Isso excluirá
                        permanentemente "{name}".
                    </DialogDescription>
                </DialogHeader>
                {/* 🌟 EXIBIÇÃO DO ERRO DENTRO DO MODAL */}
                {error && (
                    <div className="flex items-center gap-2 p-3 text-sm rounded-lg bg-destructive/10 text-destructive border border-destructive/20 animate-in fade-in-50 duration-200">
                        <AlertTriangle size={16} className="shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <DialogFooter className="gap-2 sm:gap-0">
                    <DialogClose asChild>
                        <Button variant="outline" disabled={isDeleting}>
                            Cancelar
                        </Button>
                    </DialogClose>

                    {/* 🌟 REMOVIDO o <DialogClose> daqui para o modal não sumir se der erro */}
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={isDeleting || !!error}
                    >
                        {isDeleting ? "Excluindo..." : "Excluir"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
