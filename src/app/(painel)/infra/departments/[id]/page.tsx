import { notFound } from "next/navigation";

import { DepartmentForm } from "@/components/infra/departments/department-form";
import { BackButton } from "@/components/users/back-button";
import { PageTitle } from "@/components/users/page-title";
import { departmentService } from "@/services/department";
import { Department } from "@/types/department";

type Props = {
    params: Promise<{ id: string }>;
};

export default async function EditDepartmentPage({ params }: Props) {
    const { id } = await params;

    // Busca os dados do departamento pelo ID
    const departmentRes = await departmentService.getDepartmentById(id);

    // Se houver erro de busca ou o registro não existir, dispara a página 404 nativa do Next.js
    if (departmentRes.error || !departmentRes.data) {
        console.error(
            "Erro na busca do departamento para edição:",
            departmentRes.error,
        );
        notFound();
    }

    const department = departmentRes.data as Department;

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
                        "{department.name}"
                    </span>
                </p>
            </div>

            {/* Form de Edição populado com os dados atuais */}
            <DepartmentForm department={department} />
        </div>
    );
}
