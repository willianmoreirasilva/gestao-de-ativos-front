import { ShieldOff } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

type AccessDeniedProps = {
    message?: string;
};

// Aviso exibido quando a role do usuário não permite acessar a página
export function AccessDenied({
    message = "Você não tem permissão para acessar esta página.",
}: AccessDeniedProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-md mx-auto space-y-3">
            <div className="p-3 bg-muted rounded-full text-muted-foreground">
                <ShieldOff size={28} strokeWidth={1.5} />
            </div>
            <h2 className="font-semibold text-foreground">Acesso restrito</h2>
            <p className="text-sm text-muted-foreground">{message}</p>
            <Button asChild variant="outline" size="sm">
                <Link href="/dashboard">Voltar ao início</Link>
            </Button>
        </div>
    );
}
