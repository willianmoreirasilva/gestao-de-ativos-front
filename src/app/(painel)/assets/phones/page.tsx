import { Plus } from "lucide-react";
import Link from "next/link";

import { PhoneRowItem } from "@/components/assets/phones/phone-row-item";
import { AssetFilters } from "@/components/assets/shared/asset-filters";
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
import { getAssets } from "@/services/assets";

type PageProps = {
    searchParams: Promise<{
        search?: string;
        hasIp?: "true" | "false";
        page?: string;
        limit?: string;
    }>;
};

export default async function PhonesPage({ searchParams }: PageProps) {
    const params = await searchParams;

    const currentPage = Math.max(1, Number(params.page || "1"));
    const currentLimit = Math.max(1, Number(params.limit || "8"));
    const offset = (currentPage - 1) * currentLimit;

    const searchQuery = params.search || "";
    const hasIpQuery = params.hasIp || undefined;

    const { data, meta, error } = await getAssets({
        type: "PHONE",
        search: searchQuery,
        hasIp: hasIpQuery,
        page: currentPage,
        limit: currentLimit,
    });

    const phones = Array.isArray(data) ? data : [];
    const totalRecords = meta?.total ?? 0;

    const pageTitle = (
        <PageTitle
            title="Inventário de Telefones / Ramais"
            leftSide={<BackButton />}
            rightSide={
                <Link href="/assets/phones/add">
                    <Button className="flex items-center gap-2 text-xs font-semibold h-9 shadow-sm bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950 hover:bg-zinc-900">
                        <Plus size={15} />
                        Novo Telefone
                    </Button>
                </Link>
            }
        />
    );

    const hasNoFilters = !searchQuery && !hasIpQuery;
    if (currentPage === 1 && phones.length === 0 && hasNoFilters && !error) {
        return (
            <div className="space-y-6">
                {pageTitle}
                <EmptyState
                    message="Nenhum telefone ou ramal registrado no inventário."
                    label="Cadastrar Telefone"
                    href="/assets/phones/add"
                />
            </div>
        );
    }

    return (
        <div className="space-y-6 px-1.5 md:px-0">
            {pageTitle}

            <AssetFilters searchPlaceholder="Buscar por hostname, ramal, modelo, patrimônio ou IP..." />

            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm overflow-hidden">
                <div className="overflow-x-auto w-full">
                    <Table className="min-w-150 md:min-w-full">
                        <TableHeader>
                            <TableRow className="bg-zinc-50/40 dark:bg-zinc-900/20 border-b border-zinc-200 dark:border-zinc-800">
                                <TableHead className="text-xs font-bold text-zinc-500 uppercase tracking-wider py-3.5 pl-5">
                                    Hostname / Ramal
                                </TableHead>
                                <TableHead className="text-xs font-bold text-zinc-500 uppercase tracking-wider py-3.5">
                                    Modelo / Patrimônio
                                </TableHead>
                                <TableHead className="text-xs font-bold text-zinc-500 uppercase tracking-wider py-3.5">
                                    Endereço IP
                                </TableHead>
                                <TableHead className="text-xs font-bold text-zinc-500 uppercase tracking-wider py-3.5 hidden sm:table-cell">
                                    Conexão Switch
                                </TableHead>
                                <TableHead className="text-xs font-bold text-zinc-500 uppercase tracking-wider py-3.5 hidden sm:table-cell">
                                    Alocação / Setor
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

                            {!error && phones.length === 0 && searchQuery && (
                                <TableRow className="hover:bg-transparent">
                                    <TableCell colSpan={6} className="py-10">
                                        <EmptyState
                                            message={`Nenhum telefone encontrado para: "${searchQuery}"`}
                                            label="Cadastrar Novo Telefone"
                                            href="/assets/phones/add"
                                        />
                                    </TableCell>
                                </TableRow>
                            )}

                            {!error &&
                                phones.length > 0 &&
                                phones.map((asset) => (
                                    <PhoneRowItem
                                        key={asset.id}
                                        asset={asset}
                                    />
                                ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {!error && phones.length > 0 && (
                <Pagination {...meta} itemLabel="telefones" />
            )}
        </div>
    );
}
