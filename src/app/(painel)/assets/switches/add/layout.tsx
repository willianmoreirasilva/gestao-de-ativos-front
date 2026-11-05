import type { Metadata } from "next";

import { RequirePermission } from "@/components/require-permission";

export const metadata: Metadata = { title: "Novo switch" };

// Cadastro de switch: só SUPERADM e ADMIN
export default function AddSwitchLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <RequirePermission
            resource="networkDevices"
            action="create"
            message="Você não tem permissão para cadastrar switches."
        >
            {children}
        </RequirePermission>
    );
}
