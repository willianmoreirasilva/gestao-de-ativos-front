import Link from "next/link";

import { DepartmentItem } from "@/components/departments/department-item";
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
import { departmentService } from "@/services/department";

type Props = {
    searchParams: Promise<{ page?: string; q?: string }>;
};

const pageTitle = (
    <PageTitle
        title="Departamentos"
        leftSide={<BackButton fallbackUrl="/infra/departments" />}
        rightSide={
            <Link href="/infra/departments/add">
                <Button>Novo Departamento</Button>
            </Link>
        }
    />
);

export default async function Page({ searchParams }: Props) {
    const params = await searchParams;
    const page = parseInt(params.page || "1");
    const query = params.q || ""; //  O SearchInput joga "q" na URL
    const limit = 10;
    const offset = (page - 1) * limit;

    // 1. Busca os dados já paginados direto da API
    const departmentsRes = await departmentService.getDepartments(
        offset,
        limit,
        query, // Passa o "q" capturado da URL como a query para o service
    );

    const departments = departmentsRes?.data ?? [];
    const total = departmentsRes?.total ?? 0;

    // Empty state global: banco zerado real (página 1, sem busca, sem dados)
    if (page === 1 && departments.length === 0 && !query) {
        return (
            <div>
                <EmptyState
                    message="Nenhum departamento cadastrado ou base de dados desconectada."
                    label="Novo Departamento"
                    href="/infra/departments/add"
                />
            </div>
        );
    }

    return (
        <div>
            {pageTitle}
            {/* Usa o padrão 'q' que já configuramos */}
            <SearchInput
                placeholder="Buscar departamentos ..."
                queryParamName="q"
            />

            {departments.length === 0 && query ? (
                <div className="text-center p-12 text-muted-foreground  rounded-lg border border-dashed border-zinc-200">
                    Nenhum departamento encontrado para a busca &quot;{query}
                    &quot;.
                </div>
            ) : (
                /* CENÁRIO 2: O sistema tem dados (ou caiu em uma página vazia) */
                <>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead className="w-37.5">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {departments.length > 0 ? (
                                departments.map((item) => (
                                    <DepartmentItem
                                        key={item.id}
                                        department={item}
                                    />
                                ))
                            ) : (
                                <TableRow className="hover:bg-transparent">
                                    <TableCell
                                        colSpan={2}
                                        className="text-center py-16"
                                    >
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <p className="text-zinc-400">
                                                Nenhum departamento encontrado
                                                nesta página.
                                            </p>

                                            {/* 🌟 BOTÃO DE RESGATE EXTERNO */}
                                            {page > 1 && (
                                                <Link href="?page=1">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                    >
                                                        Voltar para a primeira
                                                        página
                                                    </Button>
                                                </Link>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    {/* PAGINAÇÃO LIMPA E INTELIGENTE */}
                    <Pagination
                        disablePrev={page <= 1}
                        disableNext={offset + departments.length >= total}
                    />
                </>
            )}
        </div>
    );
}
