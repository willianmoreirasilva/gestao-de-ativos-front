import { RequirePermission } from "@/components/require-permission";

// Cadastrar rede: SUPERADM e ADMIN (a API também recusa os demais)
export default function NetworkFormLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <RequirePermission
            resource="networks"
            action="create"
            message="Apenas Superadministradores e Administradores podem cadastrar redes."
        >
            {children}
        </RequirePermission>
    );
}
