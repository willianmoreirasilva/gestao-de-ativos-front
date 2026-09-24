import { Plus } from "lucide-react";
import Link from "next/link";

import { LocationItem } from "@/components/infra/locations/location-item";
import { Pagination } from "@/components/pagination";
import { SearchInput } from "@/components/search-input";
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
import { locationService } from "@/services/location";

type Props = {
    searchParams: Promise<{ page?: string; limit?: string; q?: string }>;
};

export default async function LocationsPage({ searchParams }: Props) {
    const params = await searchParams;
    const page = Math.max(1, parseInt(params.page || "1", 10));
    const limit = Math.max(1, parseInt(params.limit || "8", 10));
    const query = params.q || "";

    // Busca os dados passando paginação nativa (page/limit/query)
    const locationsRes = await locationService.getLocations(page, limit, query);

    const locations = locationsRes?.data ?? [];

    // Tratamento unificado de metadados utilizando o limit dinâmico
    const totalRecords = locationsRes?.meta?.total ?? locationsRes?.total ?? 0;
    const meta = {
        total: totalRecords,
        page,
        limit,
        totalPages:
            locationsRes?.meta?.totalPages ?? Math.ceil(totalRecords / limit),
    };

    const emptyMessage = `Nenhum local foi encontrado para "${query}".`;

    const pageTitle = (
        <PageTitle
            title="Locais e Prédios"
            leftSide={<BackButton fallbackUrl="/infra" />}
            rightSide={
                <Link href="/infra/locations/add">
                    <Button className="flex items-center gap-2 shadow-sm">
                        <Plus size={16} />
                        Novo Local
                    </Button>
                </Link>
            }
        />
    );

    // Estado limpo/vazio quando não há nenhum local cadastrado no sistema
    if (page === 1 && locations.length === 0 && !query) {
        return (
            <div className="space-y-6">
                {pageTitle}
                <EmptyState
                    message="Nenhum local cadastrado até o momento."
                    label="Cadastrar Primeiro Local"
                    href="/infra/locations/add"
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {pageTitle}

            <div className="flex items-center justify-between gap-4">
                <div className="w-full max-w-sm">
                    <SearchInput
                        placeholder="Buscar por nome, prédio ou sala..."
                        queryParamName="q"
                    />
                </div>
                {meta.total > 0 && (
                    <span className="text-sm text-muted-foreground hidden sm:inline-block">
                        Total:{" "}
                        <strong className="text-foreground">
                            {meta.total}
                        </strong>{" "}
                        registro(s)
                    </span>
                )}
            </div>

            <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="font-semibold">
                                Nome / Sala
                            </TableHead>
                            <TableHead className="font-semibold">
                                Prédio / Bloco
                            </TableHead>
                            <TableHead className="font-semibold hidden md:table-cell">
                                Andar
                            </TableHead>
                            <TableHead className="font-semibold hidden md:table-cell">
                                Sala
                            </TableHead>
                            <TableHead className="font-semibold hidden sm:table-cell w-20 text-center">
                                Notas
                            </TableHead>
                            <TableHead className="w-24 text-right font-semibold pr-4">
                                Ações
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {locations.length > 0 ? (
                            locations.map((item) => (
                                <LocationItem key={item.id} location={item} />
                            ))
                        ) : (
                            <TableRow className="hover:bg-transparent">
                                <TableCell
                                    colSpan={6}
                                    className="h-48 text-center"
                                >
                                    <EmptyState
                                        message={
                                            query
                                                ? emptyMessage
                                                : "Nenhum resultado nesta página."
                                        }
                                        label={
                                            query
                                                ? "Cadastrar Local"
                                                : "Voltar para Página 1"
                                        }
                                        href={
                                            query
                                                ? "/infra/locations/add"
                                                : "?page=1"
                                        }
                                    />
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Componente de paginação unificado */}
            {meta && meta.totalPages > 0 && (
                <Pagination {...meta} itemLabel="localidades" />
            )}
        </div>
    );
}
