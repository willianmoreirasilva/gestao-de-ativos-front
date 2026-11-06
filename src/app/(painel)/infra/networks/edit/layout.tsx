import { RequirePermission } from "@/components/require-permission";

// Editar rede: SUPERADM e ADMIN (a API também recusa os demais)
export default function NetworkFormLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <RequirePermission
            resource="networks"
            action="update"
            message="Apenas Superadministradores e Administradores podem editar redes."
        >
            {children}
        </RequirePermission>
    );
}
