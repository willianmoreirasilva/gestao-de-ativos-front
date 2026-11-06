"use client";

import { TriangleAlert } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";

type PainelErrorProps = {
    error: Error & { digest?: string };
    retry: () => void;
};

// Erro inesperado numa página do painel: o menu e o cabeçalho continuam de pé
export default function PainelError({ error, retry }: PainelErrorProps) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div
            role="alert"
            className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-md mx-auto space-y-3"
        >
            <div className="p-3 bg-destructive/10 rounded-full text-destructive">
                <TriangleAlert size={28} strokeWidth={1.5} />
            </div>
            <h2 className="font-semibold text-foreground">Algo deu errado</h2>
            <p className="text-sm text-muted-foreground">
                Não foi possível carregar esta página. Tente novamente; se o
                problema continuar, avise um administrador.
            </p>
            {error.digest && (
                <p className="text-xs text-muted-foreground font-mono">
                    Código: {error.digest}
                </p>
            )}
            <Button variant="outline" size="sm" onClick={() => retry()}>
                Tentar novamente
            </Button>
        </div>
    );
}
