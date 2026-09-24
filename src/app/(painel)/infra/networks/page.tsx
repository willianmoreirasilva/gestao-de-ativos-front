import { Plus } from "lucide-react";
import Link from "next/link";

import { NetworkFilters } from "@/components/infra/networks/network-filters";
import { NetworkItem } from "@/components/infra/networks/network-item";
import { Pagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { BackButton } from "@/components/users/back-button";
import { EmptyState } from "@/components/users/empty-state";
import { PageTitle } from "@/components/users/page-title";
import { networkService } from "@/services/network";
import type { Network } from "@/types/network";

type PageProps = {
    searchParams: Promise<{
        search?: string;
        vlanTag?: string;
        type?: string;
        page?: string;
        limit?: string;
    }>;
};

export default async function NetworksPage({ searchParams }: PageProps) {
    const params = await searchParams;

    // Parâmetros de busca e paginação
    const currentPage = Math.max(1, Number(params.page || "1"));
    const currentLimit = Math.max(1, Number(params.limit || "10"));
    const offset = (currentPage - 1) * currentLimit;

    const searchQuery = params.search || "";
    const vlanQuery = params.vlanTag || "";
    const typeQuery = params.type || "";

    // Busca os dados no service
    const { data, meta, error } = await networkService.getNetworks({
        search: searchQuery,
        vlanTag: vlanQuery,
        type: typeQuery,
        offset,
        limit: currentLimit,
    });

    const networks: Network[] = Array.isArray(data) ? data : [];
    const totalRecords = meta?.total ?? 0;
    const currentLimitActive = meta?.limit ?? currentLimit;
    const totalPages = Math.ceil(totalRecords / currentLimitActive);

    // Título da página
    const pageTitle = (
        <PageTitle
            title="Infraestrutura de Redes"
            leftSide={<BackButton />}
            rightSide={
                <Link href="/infra/networks/add">
                    <Button className="flex items-center gap-2">
                        <Plus size={16} />
                        Nova Rede
                    </Button>
                </Link>
            }
        />
    );

    // Empty State para banco vazio na primeira página
    const hasNoFilters =
        !searchQuery && !vlanQuery && (!typeQuery || typeQuery === "ALL");

    if (currentPage === 1 && networks.length === 0 && hasNoFilters && !error) {
        return (
            <div className="space-y-6">
                {pageTitle}
                <EmptyState
                    message="Nenhuma rede de infraestrutura cadastrada ou base de dados desconectada."
                    label="Cadastrar Nova Rede"
                    href="/infra/networks/add"
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {pageTitle}

            <NetworkFilters />

            <div className="rounded-md border bg-white dark:bg-zinc-950 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-zinc-50/50 dark:bg-zinc-900/30">
                            <TableHead>Rede / CIDR</TableHead>
                            <TableHead>VLAN</TableHead>
                            <TableHead className="hidden sm:table-cell">
                                Tipo de Rede
                            </TableHead>
                            <TableHead className="hidden md:table-cell">
                                IPs Alocados
                            </TableHead>
                            <TableHead className="hidden md:table-cell">
                                IPs Disponíveis
                            </TableHead>
                            <TableHead className="w-24">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {error && (
                            <TableRow className="hover:bg-transparent">
                                <TableCell
                                    colSpan={6}
                                    className="text-center py-10 text-destructive font-medium"
                                >
                                    {error}
                                </TableCell>
                            </TableRow>
                        )}

                        {!error && networks.length === 0 && (
                            <TableRow className="hover:bg-transparent">
                                <TableCell colSpan={6} className="py-4">
                                    <EmptyState
                                        message="Nenhuma rede de infraestrutura foi localizada com os filtros aplicados."
                                        label="Cadastrar Nova Rede"
                                        href="/infra/networks/add"
                                    />
                                </TableCell>
                            </TableRow>
                        )}

                        {!error &&
                            networks.map((network) => (
                                <NetworkItem
                                    key={network.id}
                                    network={network}
                                />
                            ))}
                    </TableBody>
                </Table>
            </div>

            {/* 🌟 COMPONENTE PAGINATION GLOBAL UNIFICADO */}
            {!error && networks.length > 0 && (
                <Pagination
                    total={totalRecords}
                    page={currentPage}
                    limit={currentLimitActive}
                    totalPages={totalPages}
                    itemLabel="redes"
                />
            )}
        </div>
    );
}
