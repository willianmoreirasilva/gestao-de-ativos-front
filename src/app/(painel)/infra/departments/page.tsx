import { departmentService } from "@/app/services/department";
import { DepartmentItem } from "@/components/departments/department-item";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
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
                <Button>Adicionar Departamento</Button>
            </Link>
        }
    />
);

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page({ searchParams }: Props) {
    const params = await searchParams;
    const page = typeof params.page === "string" ? parseInt(params.page) : 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const departmentsRes = await departmentService.getAllDepartments();
    const departments = (departmentsRes.data as Department[]) || [];
    const paginatedDepartments = departments.slice(offset, offset + limit);

    if (departments.length === 0) {
        return (
            <div>
                {pageTitle}
                <EmptyState
                    message="Nenhum departamento cadastrado."
                    label="Adicionar Departamento"
                    href="/infra/departments/add"
                />
            </div>
        );
    }

    return (
        <div>
            {pageTitle}

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nome</TableHead>

                        <TableHead className="w-37.5">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedDepartments.map((item) => (
                        <DepartmentItem key={item.id} department={item} />
                    ))}
                </TableBody>
            </Table>
            <Pagination limit={limit} count={departments.length} />
        </div>
    );
}
