import { Plus } from "lucide-react";
import Link from "next/link";

import { AssetFilters } from "@/components/assets/shared/asset-filters";
import { SwitchRowItem } from "@/components/assets/switches/switch-row-item";
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
import { switchService } from "@/services/switches";

type PageProps = {
    searchParams: Promise<{
        search?: string;
        hasIp?: "true" | "false" | "ALL";
        page?: string;
        limit?: string;
    }>;
};

export default async function SwitchesPage({ searchParams }: PageProps) {
    const params = await searchParams;

    const currentPage = Math.max(1, Number(params.page || "1"));
    const currentLimit = Math.max(1, Number(params.limit || "8"));

    const searchQuery = params.search || "";
    const hasIpQuery = params.hasIp || "ALL";

    const { data, meta, error } = await switchService.getSwitches({
        search: searchQuery,
        hasIp: hasIpQuery,
        page: currentPage,
        limit: currentLimit,
    });

    const switches = Array.isArray(data) ? data : [];

    const pageTitle = (
        <PageTitle
            title="Switches & Infraestrutura de Rede"
            leftSide={<BackButton />}
            rightSide={
                <Link href="/assets/switches/add">
                    <Button className="flex items-center gap-2 text-xs font-semibold h-9 shadow-sm bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950 hover:bg-zinc-900">
                        <Plus size={15} />
                        Novo Switch
                    </Button>
                </Link>
            }
        />
    );

    const hasNoFilters = !searchQuery && (hasIpQuery === "ALL" || !hasIpQuery);
    if (currentPage === 1 && switches.length === 0 && hasNoFilters && !error) {
        return (
            <div className="space-y-6">
                {pageTitle}
                <EmptyState
                    message="Nenhum switch cadastrado no inventário de rede."
                    label="Cadastrar Switch"
                    href="/assets/switches/add"
                />
            </div>
        );
    }

    return (
        <div className="space-y-6 px-1.5 md:px-0">
            {pageTitle}

            <AssetFilters searchPlaceholder="Buscar por hostname, modelo, fabricante, IP ou patrimônio..." />

            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm overflow-hidden">
                <div className="overflow-x-auto w-full">
                    <Table className="min-w-150 md:min-w-full">
                        <TableHeader>
                            <TableRow className="bg-zinc-50/40 dark:bg-zinc-900/20 border-b border-zinc-200 dark:border-zinc-800">
                                <TableHead className="text-xs font-bold text-zinc-500 uppercase tracking-wider py-3.5 pl-5">
                                    Hostname / Patrimônio
                                </TableHead>
                                <TableHead className="text-xs font-bold text-zinc-500 uppercase tracking-wider py-3.5">
                                    Modelo / Fabricante
                                </TableHead>
                                <TableHead className="text-xs font-bold text-zinc-500 uppercase tracking-wider py-3.5">
                                    IP de Gerência
                                </TableHead>
                                <TableHead className="text-xs font-bold text-zinc-500 uppercase tracking-wider py-3.5 hidden sm:table-cell">
                                    Portas
                                </TableHead>
                                <TableHead className="text-xs font-bold text-zinc-500 uppercase tracking-wider py-3.5 hidden sm:table-cell">
                                    Setor / Localização
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

                            {!error &&
                                switches.length === 0 &&
                                (searchQuery || hasIpQuery !== "ALL") && (
                                    <TableRow className="hover:bg-transparent">
                                        <TableCell
                                            colSpan={6}
                                            className="py-10"
                                        >
                                            <EmptyState
                                                message="Nenhum switch encontrado com os filtros aplicados."
                                                label="Cadastrar Novo Switch"
                                                href="/assets/switches/add"
                                            />
                                        </TableCell>
                                    </TableRow>
                                )}

                            {!error &&
                                switches.length > 0 &&
                                switches.map((item) => (
                                    <SwitchRowItem
                                        key={item.id}
                                        switchItem={item}
                                    />
                                ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {!error && switches.length > 0 && (
                <Pagination {...meta} itemLabel="switches" />
            )}
        </div>
    );
}
