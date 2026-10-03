"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { reserveIpsAction } from "@/actions/ip-addresses";
import { Badge } from "@/components/ui/badge";
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
import { Label } from "@/components/ui/label";

type ReserveIpsDialogProps = {
    open: boolean;
    networkId: string;
    networkInfo?: {
        address: string;
        cidr: number;
        vlanTag: number | null;
    };
    selectedIps: string[];
    onClose: () => void;
    onSuccess: () => void;
};

export function ReserveIpsDialog({
    open,
    networkId,
    networkInfo,
    selectedIps,
    onClose,
    onSuccess,
}: ReserveIpsDialogProps) {
    const [loading, setLoading] = useState(false);
    const [reason, setReason] = useState("");

    if (!open || selectedIps.length === 0) return null;

    const handleConfirm = async () => {
        setLoading(true);

        try {
            const res = await reserveIpsAction({
                ipAddresses: selectedIps,
                networkId,
                reason: reason.trim() || null,
            });

            if (res.success) {
                toast.success(
                    `Reserva realizada com sucesso. ${res.count || selectedIps.length} IP(s) reservado(s).`,
                );
                setReason("");

                // Fecha o modal primeiro e isola a execução do onSuccess de forma segura
                onClose();
                setTimeout(() => {
                    onSuccess?.(); // Chamada opcional segura
                }, 0);
            } else {
                toast.error(res.error || "Erro ao efetuar reserva.");
            }
        } catch (error) {
            console.error("Erro na reserva de IPs:", error);
            toast.error("Erro inesperado ao realizar reserva.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(val) => !loading && !val && onClose()}
        >
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-base font-bold">
                        Reservar IPs Selecionados
                    </DialogTitle>
                    <DialogDescription className="text-xs">
                        Confirme a reserva dos endereços IPs selecionados.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2 text-xs">
                    <div className="grid grid-cols-2 gap-2 bg-muted/40 p-3 rounded-md border">
                        <div>
                            <span className="text-muted-foreground block text-[11px]">
                                Sub-rede:
                            </span>
                            <strong className="font-mono">
                                {networkInfo
                                    ? `${networkInfo.address}/${networkInfo.cidr}`
                                    : networkId}
                            </strong>
                        </div>
                        {networkInfo?.vlanTag !== undefined && (
                            <div>
                                <span className="text-muted-foreground block text-[11px]">
                                    VLAN:
                                </span>
                                <strong className="font-mono">
                                    {networkInfo.vlanTag ?? "N/A"}
                                </strong>
                            </div>
                        )}
                        <div className="col-span-2 pt-1">
                            <span className="text-muted-foreground block text-[11px]">
                                Quantidade de IPs:
                            </span>
                            <Badge
                                variant="secondary"
                                className="font-mono text-xs mt-0.5"
                            >
                                {selectedIps.length} IP(s) selecionado(s)
                            </Badge>
                        </div>
                    </div>

                    <div>
                        <span className="text-muted-foreground block mb-1 text-[11px] font-medium">
                            IPs selecionados:
                        </span>
                        <div className="mt-2 max-h-24 overflow-y-auto bg-background border rounded p-2 text-xs font-mono flex flex-wrap gap-1">
                            {selectedIps.map((ip) => (
                                <span
                                    key={ip}
                                    className="bg-muted px-1.5 py-0.5 rounded text-[11px]"
                                >
                                    {ip}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="reason" className="text-xs">
                            Motivo da reserva{" "}
                            <span className="text-muted-foreground font-normal">
                                (opcional)
                            </span>
                        </Label>
                        <Input
                            id="reason"
                            placeholder="Ex: Reserva para novos servidores de banco de dados"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            maxLength={100}
                            disabled={loading}
                            className="text-xs h-9 mt-4"
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
                        Cancelar
                    </Button>
                    <Button
                        size="sm"
                        onClick={handleConfirm}
                        disabled={loading}
                        className="text-xs gap-2 cursor-pointer"
                    >
                        {loading && (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        )}
                        Confirmar Reserva
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
