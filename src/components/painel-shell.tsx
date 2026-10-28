import { AppSidebar } from "@/components/app-sidebar";
import { RoleProvider } from "@/components/permission-provider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { MyProfile, UserSession } from "@/types/user";

type Props = {
    // Perfil vindo de GET /api/users/me: única fonte confiável do papel,
    // pois o Better Auth não expõe o campo role na sessão.
    profile: MyProfile;
    children: React.ReactNode;
};

export function PainelShell({ profile, children }: Props) {
    const user: UserSession = {
        id: profile.id,
        name: profile.name ?? "",
        email: profile.email,
        image: profile.image,
        role: profile.role,
    };

    return (
        <RoleProvider role={user.role}>
            <TooltipProvider delayDuration={0}>
                <SidebarProvider>
                    <AppSidebar user={user} />

                    <div className="flex-1 min-w-0 relative p-4 pt-12 bg-zinc-50 dark:bg-zinc-950 min-h-screen">
                        <div className="absolute left-4 top-3">
                            <SidebarTrigger className="hover:bg-zinc-200 dark:hover:bg-zinc-800" />
                        </div>

                        <main className="w-full max-w-7xl mx-auto space-y-6">
                            {children}
                        </main>
                    </div>
                </SidebarProvider>
            </TooltipProvider>
        </RoleProvider>
    );
}
