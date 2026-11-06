import { redirect } from "next/navigation";

import { ErrorBox } from "@/components/error-box";
import { PainelShell } from "@/components/painel-shell";
import { userService } from "@/services/user";

export default async function PainelLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { data: profile, error, status } = await userService.getMyProfile();

    // Sessão ausente, expirada ou conta desativada: o servidor decide, sem
    // renderizar o painel nem esperar a sessão do cliente
    if (status === 401) redirect("/login");

    // API fora do ar ou com erro: não é "sem sessão", então não desloga
    if (!profile) {
        return (
            <div className="mx-auto flex min-h-screen max-w-md items-center justify-center p-4">
                <ErrorBox message={error} retryHref="/dashboard" />
            </div>
        );
    }

    return <PainelShell profile={profile}>{children}</PainelShell>;
}
