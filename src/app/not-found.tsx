import Link from "next/link";

import { Button } from "@/components/ui/button";

// Endereço que não corresponde a nenhuma rota (fora do painel)
export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-3 p-4 text-center">
            <h1 className="text-lg font-semibold text-foreground">
                Página não encontrada
            </h1>
            <p className="text-sm text-muted-foreground">
                O endereço não existe ou foi removido.
            </p>
            <Button asChild variant="outline" size="sm">
                <Link href="/dashboard">Voltar ao dashboard</Link>
            </Button>
        </div>
    );
}
