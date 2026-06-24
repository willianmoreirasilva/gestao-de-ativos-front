import { Plus } from "lucide-react";
import Link from "next/link";

import { LocationItem } from "@/components/locations/location-item";
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
import { Pagination } from "@/components/users/pagination";
import { locationService } from "@/services/location";

type Props = {
    searchParams: Promise<{ page?: string; q?: string }>;
};

export default async function Page({ searchParams }: Props) {
    const params = await searchParams;
    const page = parseInt(params.page || "1");
    const query = params.q || "";
    const limit = 10;
    const offset = (page - 1) * limit;

    const locationRes = await locationService.getLocations(
        offset,
        limit,
        query,
    );
    const locations = locationRes?.data ?? [];
    const total = locationRes?.total ?? 0;

    const emptyMessage = `Nenhum Local foi encontrado com o nome "${query}".`;

    //PADRÃO: Título da página isolado em uma constante
    const pageTitle = (
        <PageTitle
            title="Locais e Prédios"
            leftSide={<BackButton fallbackUrl="/infra/locations" />}
            rightSide={
                <Link href="/infra/locations/add">
                    <Button className="flex items-center gap-2">
                        <Plus size={16} />
                        Novo Local
                    </Button>
                </Link>
            }
        />
    );

    // Empty state global: banco zerado real (página 1, sem busca, sem dados)
    if (page === 1 && locations.length === 0 && !query) {
        return (
            <div className="space-y-6">
                {pageTitle}
                <EmptyState
                    message="Nenhum Local cadastrado ou base de dados desconectada."
                    label="Novo Local"
                    href="/infra/locations/add"
                />
            </div>
        );
    }

    return (
        <div>
            {pageTitle}

            <SearchInput placeholder="Buscar locais..." queryParamName="q" />

            {locations.length === 0 && query ? (
                <Table>
                    <TableRow className="hover:bg-transparent">
                        <TableCell colSpan={6} className="py-4">
                            <EmptyState
                                message={emptyMessage}
                                label="Cadastrar Novo Local"
                                href="/infra/locations/add"
                            />
                        </TableCell>
                    </TableRow>
                </Table>
            ) : (
                <>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Prédio/Bloco</TableHead>

                                {/* 🌟 ESCONDENDO NO MOBILE / MOSTRANDO NO TABLET+ (md) */}
                                <TableHead className="hidden md:table-cell">
                                    Andar
                                </TableHead>
                                <TableHead className="hidden md:table-cell">
                                    Sala
                                </TableHead>
                                <TableHead className="hidden sm:table-cell w-20 text-center">
                                    Notas
                                </TableHead>

                                <TableHead className="w-24">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {locations.length > 0 ? (
                                locations.map((item) => (
                                    <LocationItem
                                        key={item.id}
                                        location={item}
                                    />
                                ))
                            ) : (
                                <TableRow className="hover:bg-transparent">
                                    <TableCell colSpan={6} className="py-4">
                                        <EmptyState
                                            message="Nenhum local encontrado nesta página."
                                            label="Voltar para pagina 1"
                                            href="?page=1"
                                        />
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    <Pagination
                        disablePrev={page <= 1}
                        disableNext={offset + locations.length >= total}
                    />
                </>
            )}
        </div>
    );
}
