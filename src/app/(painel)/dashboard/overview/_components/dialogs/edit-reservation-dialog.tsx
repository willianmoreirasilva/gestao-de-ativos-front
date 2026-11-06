"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { updateIpReservationAction } from "@/actions/ip-addresses";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { IpAddress } from "@/types/ip-address";

type EditReservationDialogProps = {
    ip: IpAddress | null;
    onClose: () => void;
    onSuccess: () => void;
};

export function EditReservationDialog({
    ip,
    onClose,
    onSuccess,
}: EditReservationDialogProps) {
    if (!ip) return null;

    // A key remonta o formulário a cada reserva aberta (estado inicial limpo)
    return (
        <EditReservationForm
            key={ip.id}
            ip={ip}
            onClose={onClose}
            onSuccess={onSuccess}
        />
    );
}

function EditReservationForm({
    ip,
    onClose,
    onSuccess,
}: EditReservationDialogProps & { ip: IpAddress }) {
    const [loading, setLoading] = useState(false);
    const [reason, setReason] = useState(ip.reservationReason ?? "");
    const [newAddress, setNewAddress] = useState(ip.address);

    const handleSave = async () => {
        const address = newAddress.trim();
        const payload = {
            reason: reason.trim() === "" ? null : reason.trim(),
            ...(address !== ip.address && { newAddress: address }),
        };

        setLoading(true);
        const res = await updateIpReservationAction(ip.id, payload);
        setLoading(false);

        if (!res.success) {
            toast.error(res.error || "Não foi possível editar a reserva.");
            return;
        }

        toast.success(
            payload.newAddress
                ? `Reserva movida para ${payload.newAddress}.`
                : "Reserva atualizada.",
        );
        onSuccess();
        onClose();
    };

    return (
        <Dialog open onOpenChange={(open) => !loading && !open && onClose()}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle className="text-base font-bold">
                        Editar Reserva
                    </DialogTitle>
                    <DialogDescription className="text-xs">
                        Altere o motivo ou mova a reserva para outro IP livre da
                        mesma VLAN permitida.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-3 py-2">
                    <div className="space-y-1">
                        <label className="text-xs font-medium">
                            Endereço IP
                        </label>
                        <Input
                            value={newAddress}
                            onChange={(e) => setNewAddress(e.target.value)}
                            className="h-8 text-xs font-mono"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-medium">Motivo</label>
                        <Textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            maxLength={100}
                            className="text-xs min-h-16 resize-none"
                        />
                    </div>
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
                        size="sm"
                        onClick={handleSave}
                        disabled={loading}
                        className="text-xs gap-2 cursor-pointer"
                    >
                        {loading && (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        )}
                        Salvar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
