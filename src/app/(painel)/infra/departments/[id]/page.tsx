import { redirect } from "next/navigation";

import { DepartmentForm } from "@/components/infra/departments/department-form";
import { BackButton } from "@/components/users/back-button";
import { PageTitle } from "@/components/users/page-title";
import { departmentService } from "@/services/department";
import { Department } from "@/types/department";

type Props = {
    params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
    const { id } = await params;

    // O Service agora retorna { data: Department, error: string | null }
    const departmentRes = await departmentService.getDepartmentById(id);

    if (departmentRes.error || !departmentRes.data) {
        console.error(
            "Error na busca do departamento para edição:",
            departmentRes.error,
        );
        redirect("/infra/departments");
    }

    const department = departmentRes.data as Department;

    return (
        /* O CONTAINER DE RESGATE: Limita a largura em monitores grandes,
           centraliza na tela, adiciona um espaçamento interno nas bordas e um recuo vertical */
        <div className="w-full max-w-2xl mx-auto px-4 py-6 space-y-6">
            <PageTitle
                title={`Editar Departamento`}
                leftSide={<BackButton fallbackUrl="/infra/departments" />}
            />

            <DepartmentForm department={department} />
        </div>
    );
}
