"use client";

import {
    Ban,
    ChevronLeft,
    ChevronRight,
    Loader2,
    RotateCcw,
    Search,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { getReservedIpsAction } from "@/actions/ip-addresses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    IpAddress,
    NetworkUsageMetric,
    PaginatedMeta,
} from "@/types/ip-address";

import { CancelReservationDialog } from "../dialogs/cancel-reservation-dialog";

type ReservedIpsTabProps = {
    networks: NetworkUsageMetric[];
    onRefreshAll: () => void;
};

export function ReservedIpsTab({
    networks,
    onRefreshAll,
}: ReservedIpsTabProps) {
    const [loading, setLoading] = useState(false);
    const [ips, setIps] = useState<IpAddress[]>([]);
    const [meta, setMeta] = useState<PaginatedMeta | null>(null);
    const [networkId, setNetworkId] = useState<string>("ALL");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const [selectedIpToCancel, setSelectedIpToCancel] =
        useState<IpAddress | null>(null);

    const loadReserved = useCallback(async () => {
        try {
            setLoading(true);
            const net = networkId === "ALL" ? undefined : networkId;
            const res = await getReservedIpsAction({
                networkId: net,
                search: search || undefined,
                page,
                limit: 10,
            });

            if (res.success && res.data) {
                setIps(res.data);
                setMeta(res.meta || null);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [networkId, search, page]);

    useEffect(() => {
        loadReserved();
    }, [loadReserved]);

    const handleReset = () => {
        setNetworkId("ALL");
        setSearch("");
        setPage(1);
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-muted/20 p-3 rounded-lg border">
                <div className="space-y-1">
                    <label className="text-xs font-medium">
                        Filtrar Sub-rede
                    </label>
                    <Select
                        value={networkId}
                        onValueChange={(v) => {
                            setNetworkId(v);
                            setPage(1);
                        }}
                    >
                        <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="Todas as redes" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL" className="text-xs">
                                Todas as sub-redes
                            </SelectItem>
                            {networks.map((net) => (
                                <SelectItem
                                    key={net.id}
                                    value={net.id}
                                    className="text-xs"
                                >
                                    {net.networkAddress}/{net.cidr}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium">
                        Buscar IP ou motivo
                    </label>
                    <div className="relative">
                        <Input
                            placeholder="Ex: 192.168.1.10"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            className="h-8 text-xs pr-8"
                        />
                        <Search className="h-3.5 w-3.5 absolute right-2.5 top-2 text-muted-foreground" />
                    </div>
                </div>

                <div className="flex items-end gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleReset}
                        className="h-8 text-xs gap-1"
                    >
                        <RotateCcw className="h-3 w-3" /> Limpar
                    </Button>
                </div>
            </div>

            <div className="border rounded-md overflow-hidden bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-xs">
                                Endereço IP
                            </TableHead>
                            <TableHead className="text-xs">Sub-rede</TableHead>
                            <TableHead className="text-xs">
                                Motivo da Reserva
                            </TableHead>
                            <TableHead className="text-xs text-right">
                                Ação
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    className="h-24 text-center"
                                >
                                    <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                                    <span className="text-xs text-muted-foreground">
                                        Carregando reservas...
                                    </span>
                                </TableCell>
                            </TableRow>
                        ) : ips.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    className="h-24 text-center text-xs text-muted-foreground"
                                >
                                    Nenhum IP reservado encontrado.
                                </TableCell>
                            </TableRow>
                        ) : (
                            ips.map((ip) => (
                                <TableRow key={ip.id}>
                                    <TableCell className="font-mono text-xs font-semibold">
                                        {ip.address}
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground font-mono">
                                        {ip.network
                                            ? `${ip.network.networkAddress}/${ip.network.cidr}`
                                            : "-"}
                                    </TableCell>
                                    <TableCell className="text-xs max-w-xs truncate">
                                        {ip.reservationReason || (
                                            <span className="text-muted-foreground italic">
                                                Sem motivo informado
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                setSelectedIpToCancel(ip)
                                            }
                                            className="h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 gap-1"
                                        >
                                            <Ban className="h-3 w-3" /> Cancelar
                                            reserva
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {meta && meta.totalPages ? (
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                    <span>
                        Página {meta.page} de {meta.totalPages} ({meta.total}{" "}
                        reservados)
                    </span>
                    <div className="flex gap-1">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            disabled={page <= 1}
                            onClick={() => setPage((p) => p - 1)}
                        >
                            <ChevronLeft className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            disabled={page >= meta.totalPages}
                            onClick={() => setPage((p) => p + 1)}
                        >
                            <ChevronRight className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </div>
            ) : null}

            <CancelReservationDialog
                ip={selectedIpToCancel}
                onClose={() => setSelectedIpToCancel(null)}
                onSuccess={() => {
                    loadReserved();
                    onRefreshAll();
                }}
            />
        </div>
    );
}
