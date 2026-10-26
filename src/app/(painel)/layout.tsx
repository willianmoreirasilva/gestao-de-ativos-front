import { PainelShell } from "@/components/painel-shell";
import { userService } from "@/services/user";

export default async function PainelLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // Sem sessão o perfil vem nulo; o PainelShell cuida do redirecionamento
    const { data: profile } = await userService.getMyProfile();

    return <PainelShell profile={profile}>{children}</PainelShell>;
}
