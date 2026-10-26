import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { resolveAvatarUrl } from "@/lib/avatar";
import { getInitials } from "@/lib/user-roles";
import { cn } from "@/lib/utils";

type UserAvatarProps = {
    image: string | null | undefined;
    name: string | null | undefined;
    email: string;
    className?: string;
    fallbackClassName?: string;
};

// Avatar do usuário com fallback para as iniciais
export function UserAvatar({
    image,
    name,
    email,
    className,
    fallbackClassName,
}: UserAvatarProps) {
    const src = resolveAvatarUrl(image);

    return (
        <Avatar className={cn("shrink-0", className)}>
            {src && (
                <AvatarImage
                    src={src}
                    alt={`Foto de ${name || email}`}
                    className="object-cover"
                />
            )}
            <AvatarFallback
                className={cn(
                    "bg-primary/10 text-primary font-semibold",
                    fallbackClassName,
                )}
            >
                {getInitials(name ?? null, email)}
            </AvatarFallback>
        </Avatar>
    );
}
