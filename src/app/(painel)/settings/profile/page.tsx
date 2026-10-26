import { AlertCircle, CalendarDays, Mail, ShieldCheck } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
    getInitials,
    ROLE_BADGE_VARIANT,
    ROLE_LABELS,
} from "@/lib/user-roles";
import { userService } from "@/services/user";

import { ChangePasswordForm } from "./_components/change-password-form";
import { ProfileForm } from "./_components/profile-form";

const TITLE = "Minha Conta";
const DESCRIPTION = "Consulte e atualize suas informações pessoais.";

export default async function ProfilePage() {
    const { data: profile, error } = await userService.getMyProfile();

    if (!profile) {
        return (
            <div className="space-y-6">
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
        <div className="space-y-6 max-w-3xl">
            <PageTitle title={TITLE} description={DESCRIPTION} />

            <Card>
                <CardContent className="flex flex-col sm:flex-row sm:items-center gap-4 pt-6">
                    <Avatar className="h-16 w-16 border border-primary/20">
                        {profile.image && (
                            <AvatarImage
                                src={profile.image}
                                alt={profile.name || profile.email}
                                className="object-cover"
                            />
                        )}
                        <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                            {getInitials(profile.name, profile.email)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 space-y-1.5">
                        <p className="text-lg font-semibold text-foreground truncate">
                            {profile.name || "Sem nome"}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
                            <span className="inline-flex items-center gap-1.5 min-w-0">
                                <Mail size={14} className="shrink-0" />
                                <span className="truncate">
                                    {profile.email}
                                </span>
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <ShieldCheck size={14} />
                                <Badge
                                    variant={ROLE_BADGE_VARIANT[profile.role]}
                                >
                                    {ROLE_LABELS[profile.role]}
                                </Badge>
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <CalendarDays size={14} />
                                Desde {formatDateBR(profile.createdAt)}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">
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
                    <CardTitle className="text-base">
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
