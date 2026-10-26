import { AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ROLE_LABELS } from "@/lib/user-roles";
import { userService } from "@/services/user";

import { AcceptInviteForm } from "./_components/accept-invite-form";

type Props = {
    searchParams: Promise<{ token?: string }>;
};

export default async function AcceptInvitePage({ searchParams }: Props) {
    const { token = "" } = await searchParams;

    const invitation = token
        ? await userService.getInvitation(token)
        : {
              data: null,
              error: "O link do convite está incompleto. Abra novamente o link recebido por e-mail.",
          };

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
            <div className="w-full max-w-md space-y-6 rounded-xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex flex-col items-center space-y-2 text-center">
                    <div className="relative h-16 w-16 mb-1">
                        <Image
                            src="/logodi.svg"
                            alt="DI"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
                        Aceitar convite
                    </h1>
                    {invitation.data && (
                        <p className="text-sm text-muted-foreground">
                            Defina seu nome e sua senha para concluir o
                            cadastro.
                        </p>
                    )}
                </div>

                {invitation.data ? (
                    <AcceptInviteForm
                        token={token}
                        email={invitation.data.email}
                        roleLabel={ROLE_LABELS[invitation.data.role]}
                    />
                ) : (
                    <div className="space-y-4">
                        <div
                            role="alert"
                            className="flex items-start gap-3 text-destructive text-sm p-3 bg-destructive/10 rounded-lg border border-destructive/20"
                        >
                            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                            <span>{invitation.error}</span>
                        </div>
                        <Button asChild variant="outline" className="w-full">
                            <Link href="/login">Ir para o login</Link>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
