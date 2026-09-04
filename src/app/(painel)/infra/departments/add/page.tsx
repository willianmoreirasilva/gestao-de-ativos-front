import { DepartmentForm } from "@/components/infra/departments/department-form";
import { BackButton } from "@/components/users/back-button";
import { PageTitle } from "@/components/users/page-title";

export default function NewDepartmentPage() {
    return (
        <div className="w-full max-w-2xl mx-auto px-4 py-8 space-y-6">
            {/* Header da Página */}
            <div className="flex flex-col gap-2">
                <PageTitle
                    title="Adicionar Departamento"
                    leftSide={<BackButton fallbackUrl="/infra/departments" />}
                />
                <p className="text-sm text-muted-foreground pl-10">
                    Cadastre um novo departamento para organizar os setores e
                    permissões dos colaboradores.
                </p>
            </div>

            {/* Form de Cadastro */}
            <DepartmentForm />
        </div>
    );
}
