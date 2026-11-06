import { RequirePermission } from "@/components/require-permission";

// Câmeras: o USER não tem nenhum acesso (a API também responde 404)
export default function CamerasLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <RequirePermission
            resource="cameras"
            action="view"
            message="Você não tem acesso às câmeras."
        >
            {children}
        </RequirePermission>
    );
}
