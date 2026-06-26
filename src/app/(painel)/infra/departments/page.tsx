import { Plus } from "lucide-react";
import Link from "next/link";

import { DepartmentItem } from "@/components/infra/departments/department-item";
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
    const emptyMessage = `Nenhum departamento foi encontrado com o nome "${query}".`;

    //PADRÃO: Título da página isolado em uma constante
    const pageTitle = (
        <PageTitle
            title="Departamentos"
            leftSide={<BackButton />}
            rightSide={
                <Link href="/infra/departments/add">
                    <Button className="flex items-center gap-2">
                        <Plus size={16} />
                        Novo Departamento
                    </Button>
                </Link>
            }
        />
    );

    // Empty state global: banco zerado real (página 1, sem busca, sem dados)
    if (page === 1 && departments.length === 0 && !query) {
        return (
            <div className="space-y-6">
                {pageTitle}
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
                <Table>
                    <TableRow className="hover:bg-transparent">
                        <TableCell colSpan={6} className="py-4">
                            <EmptyState
                                message={emptyMessage}
                                label="Cadastrar Novo Departamento"
                                href="/infra/departments/add"
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
                                    <TableCell colSpan={6} className="py-4">
                                        <EmptyState
                                            message="Nenhum departamento encontrado nesta página."
                                            label="Voltar para pagina 1"
                                            href="?page=1"
                                        />
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
