import { RequirePermission } from "@/components/require-permission";

// Detalhe de AP: só SUPERADM e ADMIN (a API responde 403 aos demais)
export default function AccessPointDetailsLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <RequirePermission
            resource="networkDevices"
            action="viewDetails"
            message="Você não tem acesso aos detalhes de access points."
        >
            {children}
        </RequirePermission>
    );
}
