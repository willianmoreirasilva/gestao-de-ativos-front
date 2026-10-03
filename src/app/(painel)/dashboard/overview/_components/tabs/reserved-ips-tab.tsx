"use client";

import { Ban, Loader2, RotateCcw, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { getReservedIpsAction } from "@/actions/ip-addresses";
import { NotesPopover } from "@/components/assets/shared/notes-popover";
import { Pagination } from "@/components/pagination";
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
    onRefreshAll?: () => void;
};

// Interface auxiliar flexível para capturar variações no nome do campo retornado pelo backend
type ExtendedPaginatedMeta = PaginatedMeta & {
    pageCount?: number;
    pages?: number;
};

export function ReservedIpsTab({
    networks,
    onRefreshAll,
}: ReservedIpsTabProps) {
    const [loading, setLoading] = useState(false);
    const [ips, setIps] = useState<IpAddress[]>([]);
    const [meta, setMeta] = useState<ExtendedPaginatedMeta | null>(null);
    const [networkId, setNetworkId] = useState<string>("ALL");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(3);

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
                limit,
            });

            if (res.success && res.data) {
                setIps(res.data);
                setMeta((res.meta as ExtendedPaginatedMeta) || null);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [networkId, search, page, limit]);

    useEffect(() => {
        loadReserved();
    }, [loadReserved]);

    const handleReset = () => {
        setNetworkId("ALL");
        setSearch("");
        setPage(1);
    };

    // Reseta para a página 1 ao alterar filtros de busca/sub-rede
    const handleNetworkChange = (value: string) => {
        setNetworkId(value);
        setPage(1);
    };

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setPage(1);
    };

    // Extrai o valor do totalPages tratando diferentes nomes que a API pode retornar
    const totalPages =
        meta?.totalPages ??
        meta?.pageCount ??
        meta?.pages ??
        (meta?.total ? Math.ceil(meta.total / limit) : 0);

    return (
        <div className="space-y-4">
            {/* Filtros */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-muted/20 p-3 rounded-lg border">
                <div className="space-y-1">
                    <label className="text-xs font-medium">
                        Filtrar Sub-rede
                    </label>
                    <Select
                        value={networkId}
                        onValueChange={handleNetworkChange}
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
                                    {net.networkAddress}/{net.cidr}{" "}
                                    {net.vlanTag ? `(VLAN ${net.vlanTag})` : ""}
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
                            onChange={(e) => handleSearchChange(e.target.value)}
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
                        className="h-8 text-xs gap-1 cursor-pointer"
                    >
                        <RotateCcw className="h-3 w-3" /> Limpar
                    </Button>
                </div>
            </div>

            {/* Tabela de IPs Reservados */}
            <div className="border rounded-md overflow-hidden bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-xs">
                                Endereço IP
                            </TableHead>
                            <TableHead className="text-xs">Sub-rede</TableHead>
                            <TableHead className="text-xs text-center w-28">
                                Motivo
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
                            ips.map((ip) => {
                                const matchedNetwork = networks.find(
                                    (n) => n.id === ip.networkId,
                                );
                                const networkLabel = ip.network
                                    ? `${ip.network.networkAddress}/${ip.network.cidr}`
                                    : matchedNetwork
                                      ? `${matchedNetwork.networkAddress}/${matchedNetwork.cidr}`
                                      : "-";

                                return (
                                    <TableRow key={ip.id}>
                                        <TableCell className="font-mono text-xs font-semibold">
                                            {ip.address}
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground font-mono">
                                            {networkLabel}
                                        </TableCell>

                                        <TableCell className="text-center">
                                            <div className="flex justify-center">
                                                <NotesPopover
                                                    notes={ip.reservationReason}
                                                />
                                            </div>
                                        </TableCell>

                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    setSelectedIpToCancel(ip)
                                                }
                                                className="h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 gap-1 cursor-pointer"
                                            >
                                                <Ban className="h-3 w-3" />{" "}
                                                Cancelar reserva
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Rodapé de Paginação Padrão */}
            {meta && (
                <Pagination
                    total={meta.total ?? 0}
                    page={page}
                    limit={limit}
                    totalPages={totalPages}
                    itemLabel="reservas"
                    onPageChange={(newPage) => setPage(newPage)}
                    onLimitChange={(newLimit) => {
                        setLimit(newLimit);
                        setPage(1);
                    }}
                />
            )}

            <CancelReservationDialog
                ip={selectedIpToCancel}
                onClose={() => setSelectedIpToCancel(null)}
                onSuccess={() => {
                    loadReserved();
                    onRefreshAll?.();
                }}
            />
        </div>
    );
}
