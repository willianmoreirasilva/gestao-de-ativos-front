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

    // Busca utilizando a action padronizada
    const { data, meta, error } = await getAssets({
        type: "COMPUTER",
        search: searchQuery,
        hasIp: hasIpQuery,
        page: currentPage,
        limit: currentLimit,
    });

    const computers = Array.isArray(data) ? data : [];
    const totalRecords = meta?.total ?? 0;

    // PADRÃO: Título da página isolado em uma constante
    const pageTitle = (
        <PageTitle
            title="Inventário de Computadores"
            leftSide={<BackButton />}
            rightSide={
                <Link href="/assets/computers/add">
                    <Button className="flex items-center gap-2">
                        <Plus size={16} />
                        Novo Computador
                    </Button>
                </Link>
            }
        />
    );

    // Condicional de Empty State Global (Banco zerado real: página 1, sem filtros e sem dados)
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

            <div className="rounded-md border bg-white dark:bg-zinc-950 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-zinc-50/50 dark:bg-zinc-900/30">
                            <TableHead>Hostname / Patrimônio</TableHead>
                            <TableHead>Endereço IP</TableHead>
                            <TableHead>Usuário</TableHead>
                            <TableHead className="hidden md:table-cell">
                                Hardware
                            </TableHead>
                            <TableHead className="hidden sm:table-cell">
                                Alocação (Local/Setor)
                            </TableHead>
                            <TableHead className="w-16 text-center">
                                Ficha
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {/* Tratamento 1: Erro de API */}
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

                        {/* Tratamento 2: O usuário digitou algo na busca que não existe (Ex: "willi") */}
                        {!error && computers.length === 0 && searchQuery && (
                            <TableRow className="hover:bg-transparent">
                                <TableCell colSpan={6} className="py-8">
                                    <EmptyState
                                        message={`Nenhum computador encontrado para os critérios: "${searchQuery}"`}
                                        label="Cadastrar Novo Computador"
                                        href="/assets/computers/add"
                                    />
                                </TableCell>
                            </TableRow>
                        )}

                        {/* Tratamento 3: O usuário mudou de página para um índice onde não existem mais registros */}
                        {!error && computers.length === 0 && !searchQuery && (
                            <TableRow className="hover:bg-transparent">
                                <TableCell colSpan={6} className="py-8">
                                    <EmptyState
                                        message="Nenhum computador encontrado nesta página."
                                        label="Voltar para a página 1"
                                        href="?page=1"
                                    />
                                </TableCell>
                            </TableRow>
                        )}

                        {/* Renderização normal da lista se houver dados */}
                        {!error &&
                            computers.length > 0 &&
                            computers.map((asset) => (
                                <ComputerRowItem key={asset.id} asset={asset} />
                            ))}
                    </TableBody>
                </Table>
            </div>

            {/* Paginação baseada nos cálculos idênticos ao do módulo de locais */}
            {!error && computers.length > 0 && (
                <Pagination
                    disablePrev={currentPage <= 1}
                    disableNext={offset + computers.length >= totalRecords}
                />
            )}
        </div>
    );
}
