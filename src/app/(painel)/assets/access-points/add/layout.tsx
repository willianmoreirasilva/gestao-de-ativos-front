import type { Metadata } from "next";

import { RequirePermission } from "@/components/require-permission";

export const metadata: Metadata = { title: "Novo Access Point" };

// Cadastro de AP: só SUPERADM e ADMIN
export default function AddAccessPointLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <RequirePermission
            resource="networkDevices"
            action="create"
            message="Você não tem permissão para cadastrar access points."
        >
            {children}
        </RequirePermission>
    );
}
