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

export default async function DepartmentPage({ searchParams }: Props) {
    const params = await searchParams;
    const page = Math.max(1, parseInt(params.page || "1", 10));
    const query = params.q || "";
    const limit = 8;

    // Busca os dados passando paginação nativa (page/limit/search)
    const departmentsRes = await departmentService.getDepartments(
        page,
        limit,
        query,
    );

    const departments = departmentsRes?.data ?? [];
    const meta = departmentsRes?.meta ?? {
        total: 0,
        page: 1,
        limit: 8,
        totalPages: 0,
    };

    const emptyMessage = `Nenhum departamento foi encontrado para "${query}".`;

    const pageTitle = (
        <PageTitle
            title="Departamentos"
            leftSide={<BackButton />}
            rightSide={
                <Link href="/infra/departments/add">
                    <Button className="flex items-center gap-2 shadow-sm">
                        <Plus size={16} />
                        Novo Departamento
                    </Button>
                </Link>
            }
        />
    );

    // Estado limpo/vazio quando não há nenhum departamento cadastrado no sistema
    if (page === 1 && departments.length === 0 && !query) {
        return (
            <div className="space-y-6">
                {pageTitle}
                <EmptyState
                    message="Nenhum departamento cadastrado até o momento."
                    label="Cadastrar Primeiro Departamento"
                    href="/infra/departments/add"
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
                        placeholder="Buscar por nome do departamento..."
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
                                Nome
                            </TableHead>
                            <TableHead className="font-semibold hidden sm:table-cell">
                                Criado em
                            </TableHead>
                            <TableHead className="font-semibold hidden md:table-cell">
                                Atualizado em
                            </TableHead>
                            <TableHead className="w-24 text-right font-semibold pr-4">
                                Ações
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {departments.length > 0 ? (
                            departments.map((department) => (
                                <DepartmentItem
                                    key={department.id}
                                    department={department}
                                />
                            ))
                        ) : (
                            <TableRow className="hover:bg-transparent">
                                <TableCell
                                    colSpan={4}
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
                                                ? "Cadastrar Departamento"
                                                : "Voltar para Página 1"
                                        }
                                        href={
                                            query
                                                ? "/infra/departments/add"
                                                : "?page=1"
                                        }
                                    />
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Componente de paginação usando as propriedades calculadas do meta */}
            {meta.totalPages > 1 && (
                <div className="flex items-center justify-between pt-2">
                    <p className="text-sm text-muted-foreground">
                        Página <strong>{meta.page}</strong> de{" "}
                        <strong>{meta.totalPages}</strong>
                    </p>
                    <Pagination
                        disablePrev={meta.page <= 1}
                        disableNext={meta.page >= meta.totalPages}
                    />
                </div>
            )}
        </div>
    );
}
