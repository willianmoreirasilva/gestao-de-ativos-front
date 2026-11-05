import type { Metadata } from "next";

import { DepartmentForm } from "@/components/infra/departments/department-form";
import { BackButton } from "@/components/users/back-button";
import { PageTitle } from "@/components/users/page-title";
import { loadOrNotFound } from "@/lib/load-or-not-found";
import { departmentService } from "@/services/department";

export const metadata: Metadata = { title: "Departamento" };

type Props = {
    params: Promise<{ id: string }>;
};

export default async function EditDepartmentPage({ params }: Props) {
    const { id } = await params;

    // Busca os dados do departamento pelo ID
    const departmentRes = await departmentService.getDepartmentById(id);

    // 404/400: página "não encontrado". Outro erro: cai no error.tsx do painel
    const department = loadOrNotFound(departmentRes, "o departamento");

    return (
        <div className="w-full max-w-2xl mx-auto px-4 py-8 space-y-6">
            {/* Header com Título e Subtítulo informativo */}
            <div className="flex flex-col gap-1.5">
                <PageTitle
                    title="Editar Departamento"
                    leftSide={<BackButton fallbackUrl="/infra/departments" />}
                />
                <p className="text-sm text-muted-foreground pl-10">
                    Alterando as informações de{" "}
                    <span className="font-semibold text-foreground">
                        &quot;{department.name}&quot;
                    </span>
                </p>
            </div>

            {/* Form de Edição populado com os dados atuais */}
            <DepartmentForm department={department} />
        </div>
    );
}
