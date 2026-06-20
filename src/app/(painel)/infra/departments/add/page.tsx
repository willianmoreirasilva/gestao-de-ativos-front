import { BackButton } from "@/components/users/back-button";
import { PageTitle } from "@/components/users/page-title";
import { DepartmentForm } from "@/components/departments/department-form";

export default function Page() {
    return (
        /* max-w limita o tamanho em telas grandes, mx-auto centraliza, 
           w-full garante que no celular ocupe 100% e px-4 evita que cole nas bordas */
        <div className="w-full max-w-2xl mx-auto px-4 py-6 space-y-6">
            <PageTitle
                title="Adicionar Departamento"
                leftSide={<BackButton fallbackUrl="/infra/departments" />}
            />

            <DepartmentForm />
        </div>
    );
}
