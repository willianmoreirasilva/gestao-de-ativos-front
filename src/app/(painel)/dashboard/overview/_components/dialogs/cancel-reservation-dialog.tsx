"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { cancelIpReservationAction } from "@/actions/ip-addresses";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { IpAddress } from "@/types/ip-address";

type CancelReservationDialogProps = {
    ip: IpAddress | null;
    onClose: () => void;
    onSuccess: () => void;
};

export function CancelReservationDialog({
    ip,
    onClose,
    onSuccess,
}: CancelReservationDialogProps) {
    const [loading, setLoading] = useState(false);

    if (!ip) return null;

    const handleConfirm = async () => {
        try {
            setLoading(true);
            const res = await cancelIpReservationAction(ip.id, ip.networkId);

            if (res?.success) {
                toast.success(
                    `Reserva cancelada. O IP ${ip.address} está novamente disponível.`,
                );
                onSuccess();
                onClose();
            } else {
                toast.error(
                    res?.error || "Não foi possível cancelar a reserva.",
                );
            }
        } catch (error: any) {
            console.error("Erro no cliente ao cancelar reserva:", error);
            toast.error(
                error?.message || "Erro inesperado ao cancelar reserva.",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={!!ip}
            onOpenChange={(open) => !loading && !open && onClose()}
        >
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle className="text-base font-bold">
                        Cancelar Reserva?
                    </DialogTitle>
                    <DialogDescription className="text-xs">
                        Esta ação liberará o IP para ser utilizado na rede.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-2 text-xs space-y-2">
                    <div className="bg-muted/40 p-3 rounded border space-y-1">
                        <div>
                            <span className="text-muted-foreground text-[11px]">
                                Endereço IP:{" "}
                            </span>
                            <strong className="font-mono text-foreground">
                                {ip.address}
                            </strong>
                        </div>
                        {ip.network && (
                            <div>
                                <span className="text-muted-foreground text-[11px]">
                                    Rede:{" "}
                                </span>
                                <span className="font-mono">
                                    {ip.network.networkAddress}/
                                    {ip.network.cidr}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Caixa de Motivo corrigida para textos longos */}
                    {ip.reservationReason && (
                        <div className="text-[11px] bg-amber-500/10 text-amber-700 dark:text-amber-400 p-2.5 rounded border border-amber-500/20 max-h-28 overflow-y-auto break-words break-all leading-relaxed">
                            <strong className="block mb-0.5 font-semibold">
                                Motivo registrado:
                            </strong>
                            <span>{ip.reservationReason}</span>
                        </div>
                    )}
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onClose}
                        disabled={loading}
                        className="text-xs cursor-pointer"
                    >
                        Voltar
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleConfirm}
                        disabled={loading}
                        className="text-xs gap-2 cursor-pointer"
                    >
                        {loading && (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        )}
                        Confirmar Liberar IP
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
