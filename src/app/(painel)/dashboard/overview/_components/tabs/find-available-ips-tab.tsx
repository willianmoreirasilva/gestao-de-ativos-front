"use client";

import { BookmarkPlus, Loader2, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { findAvailableIpsAction } from "@/actions/ip-addresses";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    FindAvailableIpsResponse,
    NetworkUsageMetric,
} from "@/types/ip-address";

import { ReserveIpsDialog } from "../dialogs/reserve-ips-dialog";

type FindAvailableIpsTabProps = {
    networks: NetworkUsageMetric[];
    onRefreshAll: () => void;
};

export function FindAvailableIpsTab({
    networks,
    onRefreshAll,
}: FindAvailableIpsTabProps) {
    const [selectedNetworkId, setSelectedNetworkId] = useState<string>("");
    const [quantity, setQuantity] = useState<number>(1);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<FindAvailableIpsResponse | null>(null);

    // Seleção de IPs para reserva
    const [selectedIps, setSelectedIps] = useState<string[]>([]);
    const [isReserveDialogOpen, setIsReserveDialogOpen] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedNetworkId) {
            toast.error("Selecione uma sub-rede.");
            return;
        }

        try {
            setLoading(true);
            setSelectedIps([]);
            const res = await findAvailableIpsAction(
                selectedNetworkId,
                quantity,
            );

            if (res.success && res.data) {
                setResult(res.data);

                if (res.data.available < quantity) {
                    toast.warning(
                        `Foram encontrados apenas ${res.data.available} IPs disponíveis para a quantidade solicitada.`,
                    );
                } else {
                    toast.info(
                        `${res.data.available} IPs disponíveis para a rede selecionada.`,
                    );
                }
            } else {
                toast.error(
                    res.error || "Não foi possível buscar IPs disponíveis.",
                );
                setResult(null);
            }
        } catch {
            toast.error("Erro ao buscar IPs livres.");
        } finally {
            setLoading(false);
        }
    };

    const toggleIp = (ip: string) => {
        setSelectedIps((prev) =>
            prev.includes(ip) ? prev.filter((i) => i !== ip) : [...prev, ip],
        );
    };

    const toggleAll = () => {
        if (!result) return;
        if (selectedIps.length === result.ips.length) {
            setSelectedIps([]);
        } else {
            setSelectedIps([...result.ips]);
        }
    };

    const handleReserveSuccess = () => {
        setSelectedIps([]);
        setResult(null);
        onRefreshAll?.();
    };

    return (
        <div className="space-y-4">
            <form
                onSubmit={handleSearch}
                className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end bg-muted/20 p-3 rounded-lg border"
            >
                <div className="space-y-1">
                    <label className="text-xs font-medium">Sub-rede</label>
                    <Select
                        value={selectedNetworkId}
                        onValueChange={setSelectedNetworkId}
                    >
                        <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="Selecione a rede..." />
                        </SelectTrigger>
                        <SelectContent>
                            {networks.map((net) => (
                                <SelectItem
                                    key={net.id}
                                    value={net.id}
                                    className="text-xs"
                                >
                                    {net.networkAddress}/{net.cidr}{" "}
                                    {net.vlanTag ? `(VLAN ${net.vlanTag})` : ""}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium">
                        Quantidade de IPs sequenciais
                    </label>
                    <Input
                        type="number"
                        min={1}
                        max={100}
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="h-8 text-xs"
                    />
                </div>

                <Button
                    type="submit"
                    size="sm"
                    disabled={loading || !selectedNetworkId}
                    className="h-8 text-xs gap-1.5"
                >
                    {loading ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                        <Search className="h-3.5 w-3.5" />
                    )}
                    Encontrar IPs
                </Button>
            </form>

            {result && (
                <div className="border rounded-md p-4 space-y-3 bg-card">
                    <div className="flex items-center justify-between border-b pb-2">
                        <div className="text-xs space-y-0.5">
                            <p className="font-semibold text-foreground">
                                Rede: {result.network.address}/
                                {result.network.cidr}
                            </p>
                            <p className="text-muted-foreground text-[11px]">
                                Solicitados: {result.requested} | Encontrados:{" "}
                                {result.available}
                            </p>
                        </div>

                        {result.ips.length > 0 && (
                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={toggleAll}
                                    className="h-7 text-[11px]"
                                >
                                    {selectedIps.length === result.ips.length
                                        ? "Desmarcar todos"
                                        : "Selecionar todos"}
                                </Button>
                                <Button
                                    type="button"
                                    size="sm"
                                    disabled={selectedIps.length === 0}
                                    onClick={() => setIsReserveDialogOpen(true)}
                                    className="h-7 text-xs gap-1.5"
                                >
                                    <BookmarkPlus className="h-3.5 w-3.5" />
                                    Reservar selecionados ({selectedIps.length})
                                </Button>
                            </div>
                        )}
                    </div>

                    {result.ips.length === 0 ? (
                        <p className="text-xs text-muted-foreground py-4 text-center">
                            Nenhum bloco disponível encontrado para a quantidade
                            solicitada.
                        </p>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                            {result.ips.map((ip) => {
                                const isChecked = selectedIps.includes(ip);
                                return (
                                    <label
                                        key={ip}
                                        className={`flex items-center gap-2 p-2 rounded border text-xs font-mono cursor-pointer transition-colors ${
                                            isChecked
                                                ? "bg-primary/10 border-primary"
                                                : "bg-muted/30 hover:bg-muted/60"
                                        }`}
                                    >
                                        <Checkbox
                                            checked={isChecked}
                                            onCheckedChange={() => toggleIp(ip)}
                                        />
                                        <span>{ip}</span>
                                    </label>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            <ReserveIpsDialog
                open={isReserveDialogOpen}
                networkId={selectedNetworkId}
                networkInfo={result?.network}
                selectedIps={selectedIps}
                onClose={() => setIsReserveDialogOpen(false)}
                onSuccess={handleReserveSuccess}
            />
        </div>
    );
}
