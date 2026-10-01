"use client";

import { BookmarkPlus, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { getAvailableIpsAction } from "@/actions/ip-addresses";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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

import { ReserveIpsDialog } from "../dialogs/reserve-ips-dialog";

type AvailableIpsTabProps = {
    networks: NetworkUsageMetric[];
    onRefreshAll: () => void;
};

export function AvailableIpsTab({
    networks,
    onRefreshAll,
}: AvailableIpsTabProps) {
    const [selectedNetworkId, setSelectedNetworkId] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [ips, setIps] = useState<IpAddress[]>([]);
    const [meta, setMeta] = useState<PaginatedMeta | null>(null);
    const [page, setPage] = useState(1);

    const [selectedIps, setSelectedIps] = useState<string[]>([]);
    const [isReserveDialogOpen, setIsReserveDialogOpen] = useState(false);

    useEffect(() => {
        if (networks.length > 0 && !selectedNetworkId) {
            setSelectedNetworkId(networks[0].id);
        }
    }, [networks, selectedNetworkId]);

    const fetchAvailableIps = useCallback(async () => {
        if (!selectedNetworkId) return;
        try {
            setLoading(true);
            setSelectedIps([]);
            const res = await getAvailableIpsAction(
                selectedNetworkId,
                page,
                15,
            );
            if (res.success && res.data) {
                setIps(res.data);
                setMeta(res.meta || null);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [selectedNetworkId, page]);

    useEffect(() => {
        fetchAvailableIps();
    }, [fetchAvailableIps]);

    const toggleIp = (ipStr: string) => {
        setSelectedIps((prev) =>
            prev.includes(ipStr)
                ? prev.filter((i) => i !== ipStr)
                : [...prev, ipStr],
        );
    };

    const togglePageAll = () => {
        const pageAddresses = ips.map((i) => i.address);
        const allSelected = pageAddresses.every((addr) =>
            selectedIps.includes(addr),
        );

        if (allSelected) {
            setSelectedIps((prev) =>
                prev.filter((addr) => !pageAddresses.includes(addr)),
            );
        } else {
            setSelectedIps((prev) =>
                Array.from(new Set([...prev, ...pageAddresses])),
            );
        }
    };

    const activeNetwork = networks.find((n) => n.id === selectedNetworkId);

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-muted/20 p-3 rounded-lg border">
                <div className="w-full sm:w-72 space-y-1">
                    <label className="text-xs font-medium">
                        Filtrar por Sub-rede
                    </label>
                    <Select
                        value={selectedNetworkId}
                        onValueChange={(val) => {
                            setSelectedNetworkId(val);
                            setPage(1);
                        }}
                    >
                        <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="Selecione a sub-rede" />
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

                {selectedIps.length > 0 && (
                    <Button
                        size="sm"
                        onClick={() => setIsReserveDialogOpen(true)}
                        className="h-8 text-xs gap-1.5 self-end sm:self-auto"
                    >
                        <BookmarkPlus className="h-3.5 w-3.5" />
                        Reservar selecionados ({selectedIps.length})
                    </Button>
                )}
            </div>

            <div className="border rounded-md overflow-hidden bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-10">
                                <Checkbox
                                    checked={
                                        ips.length > 0 &&
                                        ips.every((i) =>
                                            selectedIps.includes(i.address),
                                        )
                                    }
                                    onCheckedChange={togglePageAll}
                                />
                            </TableHead>
                            <TableHead className="text-xs">
                                Endereço IP
                            </TableHead>
                            <TableHead className="text-xs">Status</TableHead>
                            <TableHead className="text-xs">Sub-rede</TableHead>
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
                                        Carregando IPs...
                                    </span>
                                </TableCell>
                            </TableRow>
                        ) : ips.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    className="h-24 text-center text-xs text-muted-foreground"
                                >
                                    Nenhum IP disponível nesta sub-rede.
                                </TableCell>
                            </TableRow>
                        ) : (
                            ips.map((ip) => {
                                const isChecked = selectedIps.includes(
                                    ip.address,
                                );
                                return (
                                    <TableRow
                                        key={ip.id}
                                        className={
                                            isChecked ? "bg-primary/5" : ""
                                        }
                                    >
                                        <TableCell>
                                            <Checkbox
                                                checked={isChecked}
                                                onCheckedChange={() =>
                                                    toggleIp(ip.address)
                                                }
                                            />
                                        </TableCell>
                                        <TableCell className="font-mono text-xs font-semibold">
                                            {ip.address}
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-medium">
                                                {ip.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground font-mono">
                                            {ip.network
                                                ? `${ip.network.networkAddress}/${ip.network.cidr}`
                                                : "-"}
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            {meta && meta.totalPages ? (
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                    <span>
                        Página {meta.page} de {meta.totalPages} ({meta.total}{" "}
                        livres)
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

            <ReserveIpsDialog
                open={isReserveDialogOpen}
                networkId={selectedNetworkId}
                networkInfo={
                    activeNetwork
                        ? {
                              address: activeNetwork.networkAddress,
                              cidr: activeNetwork.cidr,
                              vlanTag: activeNetwork.vlanTag,
                          }
                        : undefined
                }
                selectedIps={selectedIps}
                onClose={() => setIsReserveDialogOpen(false)}
                onSuccess={() => {
                    setSelectedIps([]);
                    fetchAvailableIps();
                    onRefreshAll();
                }}
            />
        </div>
    );
}
