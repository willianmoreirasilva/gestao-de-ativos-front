import {
    AlertCircle,
    CalendarDays,
    KeyRound,
    Mail,
    UserRound,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { PageTitle } from "@/components/users/page-title";
import {
    formatDateBR,
    ROLE_BADGE_VARIANT,
    ROLE_LABELS,
} from "@/lib/user-roles";
import { userService } from "@/services/user";

import { ChangePasswordForm } from "./_components/change-password-form";
import { ProfileAvatarCard } from "./_components/profile-avatar-card";
import { ProfileForm } from "./_components/profile-form";

const TITLE = "Minha Conta";
const DESCRIPTION = "Consulte e atualize suas informações pessoais.";

export default async function ProfilePage() {
    const { data: profile, error } = await userService.getMyProfile();

    if (!profile) {
        return (
            <div className="mx-auto w-full max-w-3xl space-y-6">
                <PageTitle title={TITLE} description={DESCRIPTION} />
                <div
                    role="alert"
                    className="flex items-start gap-3 text-destructive text-sm p-4 bg-destructive/10 rounded-lg border border-destructive/20"
                >
                    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>{error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-3xl space-y-6">
            <PageTitle title={TITLE} description={DESCRIPTION} />

            {/* Cabeçalho do perfil */}
            <Card className="overflow-hidden pt-0">
                <div
                    aria-hidden
                    className="h-24 sm:h-28 bg-linear-to-r from-primary/25 via-primary/10 to-primary/5"
                />
                <CardContent className="-mt-16 pb-2">
                    <ProfileAvatarCard
                        image={profile.image}
                        name={profile.name}
                        email={profile.email}
                    >
                        <div className="min-w-0 max-w-full space-y-2">
                            <p className="text-xl font-semibold text-foreground truncate">
                                {profile.name || "Sem nome"}
                            </p>
                            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                                <span className="inline-flex items-center gap-1.5 min-w-0 max-w-full">
                                    <Mail size={14} className="shrink-0" />
                                    <span className="truncate">
                                        {profile.email}
                                    </span>
                                </span>
                                <Badge
                                    variant={ROLE_BADGE_VARIANT[profile.role]}
                                >
                                    {ROLE_LABELS[profile.role]}
                                </Badge>
                                <span className="inline-flex items-center gap-1.5">
                                    <CalendarDays size={14} />
                                    Desde {formatDateBR(profile.createdAt)}
                                </span>
                            </div>
                        </div>
                    </ProfileAvatarCard>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                        <UserRound size={18} className="text-primary" />
                        Informações pessoais
                    </CardTitle>
                    <CardDescription>
                        Seu e-mail e sua função são definidos pela administração
                        e não podem ser alterados aqui.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ProfileForm
                        name={profile.name ?? ""}
                        email={profile.email}
                        roleLabel={ROLE_LABELS[profile.role]}
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                        <KeyRound size={18} className="text-primary" />
                        Segurança e senha
                    </CardTitle>
                    <CardDescription>
                        Ao alterar a senha, as suas outras sessões ativas serão
                        encerradas.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ChangePasswordForm />
                </CardContent>
            </Card>
        </div>
    );
}
