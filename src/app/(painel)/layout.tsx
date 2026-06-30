"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { UserSession } from "@/services/auth";
// 1. Importe o TooltipProvider do seu ecossistema de componentes
import { TooltipProvider } from "@/components/ui/tooltip";

export default function PainelLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter();

    const { data: session, isPending } = authClient.useSession();

    useEffect(() => {
        if (!isPending && (!session || !session.user)) {
            router.push("/login");
        }
    }, [session, isPending, router]);

    if (isPending) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
                <div className="flex flex-col items-center gap-2">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    <p className="text-xs text-muted-foreground font-medium animate-pulse">
                        Autenticando sessão...
                    </p>
                </div>
            </div>
        );
    }

    if (!session || !session.user) {
        return null;
    }

    const mappedUser: UserSession = {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image ?? null,
        emailVerified: session.user.emailVerified,
        role: ((session.user as { role?: UserSession["role"] }).role ??
            "USER") as UserSession["role"],
    };

    return (
        // 2. Envolva o SidebarProvider com o TooltipProvider
        <TooltipProvider delayDuration={0}>
            <SidebarProvider>
                <AppSidebar user={mappedUser} />

                <div className="flex-1 relative p-4 pt-12 bg-zinc-50 dark:bg-zinc-950 min-h-screen">
                    <div className="absolute left-4 top-3">
                        <SidebarTrigger className="hover:bg-zinc-200 dark:hover:bg-zinc-800" />
                    </div>

                    <main className="w-full max-w-7xl mx-auto space-y-6">
                        {children}
                    </main>
                </div>
            </SidebarProvider>
        </TooltipProvider>
    );
}
