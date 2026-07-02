import { Plus } from "lucide-react";
import Link from "next/link";

import { ComputerFilters } from "@/components/assets/computers/computer-filters";
import { ComputerRowItem } from "@/components/assets/computers/computer-row-item";
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
import { Pagination } from "@/components/users/pagination";
import { getAssets } from "@/services/assets";

type PageProps = {
    searchParams: Promise<{
        search?: string;
        hasIp?: "true" | "false";
        page?: string;
        limit?: string;
    }>;
};

export default async function ComputersPage({ searchParams }: PageProps) {
    const params = await searchParams;

    const currentPage = Math.max(1, Number(params.page || "1"));
    const currentLimit = Math.max(1, Number(params.limit || "8"));
    const offset = (currentPage - 1) * currentLimit;

    const searchQuery = params.search || "";
    const hasIpQuery = params.hasIp || undefined;

    const { data, meta, error } = await getAssets({
        type: "COMPUTER",
        search: searchQuery,
        hasIp: hasIpQuery,
        page: currentPage,
        limit: currentLimit,
    });

    const computers = Array.isArray(data) ? data : [];
    const totalRecords = meta?.total ?? 0;

    const pageTitle = (
        <PageTitle
            title="Inventário de Computadores"
            leftSide={<BackButton />}
            rightSide={
                <Link href="/assets/computers/add">
                    <Button className="flex items-center gap-2 text-xs font-semibold h-9 shadow-sm bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950 hover:bg-zinc-900">
                        <Plus size={15} />
                        Novo Computador
                    </Button>
                </Link>
            }
        />
    );

    const hasNoFilters = !searchQuery && !hasIpQuery;
    if (currentPage === 1 && computers.length === 0 && hasNoFilters && !error) {
        return (
            <div className="space-y-6">
                {pageTitle}
                <EmptyState
                    message="Nenhum computador ou servidor foi localizado na base técnica de inventário."
                    label="Cadastrar Computador"
                    href="/assets/computers/add"
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {pageTitle}

            <ComputerFilters />

            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-zinc-50/40 dark:bg-zinc-900/20 border-b border-zinc-200 dark:border-zinc-800">
                            <TableHead className="text-xs font-bold text-zinc-500 uppercase tracking-wider py-3.5 pl-5">
                                Hostname / Patrimônio
                            </TableHead>
                            <TableHead className="text-xs font-bold text-zinc-500 uppercase tracking-wider py-3.5">
                                Endereço IP
                            </TableHead>
                            <TableHead className="text-xs font-bold text-zinc-500 uppercase tracking-wider py-3.5">
                                Usuário
                            </TableHead>
                            <TableHead className="text-xs font-bold text-zinc-500 uppercase tracking-wider py-3.5 hidden md:table-cell">
                                Especificações de Hardware
                            </TableHead>
                            <TableHead className="text-xs font-bold text-zinc-500 uppercase tracking-wider py-3.5 hidden sm:table-cell">
                                Alocação Operacional
                            </TableHead>
                            <TableHead className="text-xs font-bold text-zinc-500 uppercase tracking-wider py-3.5 w-20 text-center pr-5">
                                Ações
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {error && (
                            <TableRow className="hover:bg-transparent">
                                <TableCell
                                    colSpan={6}
                                    className="text-center py-12 text-sm text-destructive font-medium"
                                >
                                    {error}
                                </TableCell>
                            </TableRow>
                        )}

                        {!error && computers.length === 0 && searchQuery && (
                            <TableRow className="hover:bg-transparent">
                                <TableCell colSpan={6} className="py-10">
                                    <EmptyState
                                        message={`Nenhum computador encontrado para os critérios: "${searchQuery}"`}
                                        label="Cadastrar Novo Computador"
                                        href="/assets/computers/add"
                                    />
                                </TableCell>
                            </TableRow>
                        )}

                        {!error && computers.length === 0 && !searchQuery && (
                            <TableRow className="hover:bg-transparent">
                                <TableCell colSpan={6} className="py-10">
                                    <EmptyState
                                        message="Nenhum computador encontrado nesta página."
                                        label="Voltar para a página 1"
                                        href="?page=1"
                                    />
                                </TableCell>
                            </TableRow>
                        )}

                        {!error &&
                            computers.length > 0 &&
                            computers.map((asset) => (
                                <ComputerRowItem key={asset.id} asset={asset} />
                            ))}
                    </TableBody>
                </Table>
            </div>

            {!error && computers.length > 0 && (
                <Pagination
                    disablePrev={currentPage <= 1}
                    disableNext={offset + computers.length >= totalRecords}
                />
            )}
        </div>
    );
}
