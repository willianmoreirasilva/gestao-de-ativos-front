import { RequirePermission } from "@/components/require-permission";

// Detalhe de switch: só SUPERADM e ADMIN (a API responde 403 aos demais)
export default function SwitchDetailsLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <RequirePermission
            resource="networkDevices"
            action="viewDetails"
            message="Você não tem acesso aos detalhes de switches."
        >
            {children}
        </RequirePermission>
    );
}
