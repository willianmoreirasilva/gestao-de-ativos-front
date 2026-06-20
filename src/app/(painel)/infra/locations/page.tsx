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

    // 1. Busca os dados da API (que agora traz { total, data })
    const locationRes = await locationService.getLocations(
        offset,
        limit,
        query,
    );

    const locations = locationRes?.data ?? [];

    const total = locationRes?.total ?? 0;

    // Empty state global: banco zerado real (página 1, sem busca, sem dados)
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

            {/* Campo de Busca Reutilizável */}
            <SearchInput />

            {/* CENÁRIO 1: A lista está vazia E o usuário buscou por algo que não existe */}
            {locations.length === 0 && query ? (
                <div className="text-center p-12 text-muted-foreground  rounded-lg border border-dashed border-zinc-200">
                    Nenhum local encontrado para a busca &quot;{query}&quot;.
                </div>
            ) : (
                /* CENÁRIO 2: O sistema tem dados (ou caiu em uma página futura avançada) */
                <>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Prédio/Bloco</TableHead>
                                <TableHead>Andar</TableHead>
                                <TableHead>Sala</TableHead>
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
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="text-center py-12 text-zinc-400"
                                    >
                                        Nenhum local encontrado nesta página.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    {/* PAGINAÇÃO INTELIGENTE E SEM COMPLICAÇÕES:
                        Travas e cálculos gerenciados pelo total real do banco. */}
                    <Pagination
                        disablePrev={page <= 1}
                        //Se o deslocamento atual + itens na tela somarem o total do banco, o botão "Próximo" trava na hora!
                        disableNext={offset + locations.length >= total}
                    />
                </>
            )}
        </div>
    );
}
