import { locationService } from "@/app/services/location";
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
import Link from "next/link";

type Props = {
    searchParams: Promise<{ page?: string; q?: string }>;
};

const pageTitle = (
    <PageTitle
        title="Locais e Prédios"
        leftSide={<BackButton fallbackUrl="/infra/locations" />} 
        rightSide={
            <Link href="/infra/locations/add">
                <Button>Adicionar Local</Button>
            </Link>
        }
    />
);

export default async function Page({ searchParams }: Props) {
    const params = await searchParams;
    const page = parseInt(params.page || "1");
    const query = params.q || "";
    const limit = 10;
    const offset = (page - 1) * limit;

    const locationRes = await locationService.getLocations(offset, limit, query);
    const locations = locationRes?.data ?? [];
    const total = locationRes?.total ?? 0;

    if (page === 1 && locations.length === 0 && !query) {
        return (
            <div>
                {pageTitle}
                <EmptyState
                    message="Nenhum local cadastrado."
                    label="Adicionar"
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
                <div className="text-center p-12 text-muted-foreground rounded-lg border border-dashed border-zinc-200">
                    Nenhum local encontrado para a busca &quot;{query}&quot;.
                </div>
            ) : (
                <>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Prédio/Bloco</TableHead>
                                
                                {/* 🌟 ESCONDENDO NO MOBILE / MOSTRANDO NO TABLET+ (md) */}
                                <TableHead className="hidden md:table-cell">Andar</TableHead>
                                <TableHead className="hidden md:table-cell">Sala</TableHead>
                                <TableHead className="hidden sm:table-cell w-20 text-center">Notas</TableHead>
                                
                                <TableHead className="w-24">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {locations.length > 0 ? (
                                locations.map((item) => (
                                    <LocationItem key={item.id} location={item} />
                                ))
                            ) : (
                                <TableRow className="hover:bg-transparent">
                                <TableCell colSpan={6} className="text-center py-16">
                                    <div className="flex flex-col items-center justify-center gap-3">
                                        <p className="text-zinc-400">Nenhum local encontrado nesta página.</p>
                    
                                        {/* 🌟 BOTÃO DE RESGATE EXTERNO */}
                                        {page > 1 && (
                                            <Link href="?page=1">
                                                <Button variant="outline" size="sm">
                                                    Voltar para a primeira página
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
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