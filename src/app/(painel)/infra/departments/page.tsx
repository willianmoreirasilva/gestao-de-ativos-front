import { departmentService } from "@/app/services/department";
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
import { EmptyState } from "@/components/users/empty-state";

import { PageTitle } from "@/components/users/page-title";
import { Pagination } from "@/components/users/pagination";

import Link from "next/link";

type Props = {
    searchParams: Promise<{ page?: string; q?: string }>;
};

const pageTitle = (
    <PageTitle
        title="Departamentos"
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
                {pageTitle}
                <EmptyState
                    message="Nenhum Departamento cadastrado."
                    label="Adicionar"
                    href="/infra/departments/add"
                />
            </div>
        );
    }

    return (
        <div>
            {pageTitle}
            {/* Campo de Busca Reutilizável */}
            <SearchInput />

            {/* 🌟 CORREÇÃO 1: Trocado 'name' por 'query' para validar se há texto digitado */}
            {departments.length === 0 && query ? (
                <div className="text-center p-12 text-muted-foreground bg-zinc-50 rounded-lg border border-dashed border-zinc-200">
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
                                <TableRow>
                                    <TableCell
                                        colSpan={2}
                                        className="text-center py-12 text-zinc-400"
                                    >
                                        Nenhum departamento encontrado nesta
                                        página.
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
