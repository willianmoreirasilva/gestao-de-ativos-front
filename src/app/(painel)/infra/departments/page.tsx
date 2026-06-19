import { departmentService } from "@/app/services/department";
import { DepartmentItem } from "@/components/departments/department-item";
import { DepartmentSearch } from "@/components/departments/department-search";
import { EmptyDepartments } from "@/components/departments/empty-departments";
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
import { Department } from "@/types/department";
import Link from "next/link";

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

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page({ searchParams }: Props) {
    const params = await searchParams;
    const name = typeof params.name === "string" ? params.name : undefined;
    const page = typeof params.page === "string" ? parseInt(params.page) : 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    // 1. Busca os dados já paginados direto da API
    const departmentsRes = await departmentService.getDepartments(
        offset,
        limit,
        name,
    );
    const departments = (departmentsRes.data as Department[]) || [];

    // No department and no active search → show empty state
    if (departments.length === 0 && !name) {
        return (
            <div>
                {pageTitle}
                <EmptyDepartments />
            </div>
        );
    }

    return (
        <div>
            {pageTitle}
            <DepartmentSearch />
            {departments.length === 0 ? (
                <div className="text-center p-8 text-muted-foreground">
                    Não existe departamento com o nome "{name}" .
                </div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>

                            <TableHead className="w-37.5">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {/* 2. Renderiza a lista direta vinda do backend */}
                        {departments.map((item) => (
                            <DepartmentItem key={item.id} department={item} />
                        ))}
                        {/* Feedback caso o usuário avance para uma página vazia por engano */}
                        {departments.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={2}
                                    className="text-center py-4 text-zinc-400"
                                >
                                    Nenhum registro encontrado nesta página.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            )}
            {/* 3. Lógica refinada de desabilitar */}
            <Pagination
                disablePrev={page <= 1}
                // Se a API trouxe menos itens do que o limite estipulado,
                // com certeza não existe uma próxima página!
                disableNext={departments.length < limit}
            />
        </div>
    );
}
