import { RequirePermission } from "@/components/require-permission";

// Cadastro de câmera: SUPERADM e CAM_OPERATOR
export default function AddCameraLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <RequirePermission
            resource="cameras"
            action="create"
            message="Você não tem permissão para cadastrar câmeras."
        >
            {children}
        </RequirePermission>
    );
}
