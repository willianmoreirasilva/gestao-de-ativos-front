import { BackButton } from "@/components/users/back-button";
import { PageTitle } from "@/components/users/page-title";
import { DepartmentForm } from "@/components/departments/department-form";

export default function Page() {
    return (
        <div>
            <PageTitle
                title="Adicionar Departamento"
                leftSide={<BackButton fallbackUrl="/infra/departments" />}
            />

            <DepartmentForm />
        </div>
    );
}
