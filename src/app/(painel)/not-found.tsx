import { FileQuestion } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

// Registro inexistente (notFound()) dentro do painel
export default function PainelNotFound() {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-md mx-auto space-y-3">
            <div className="p-3 bg-muted rounded-full text-muted-foreground">
                <FileQuestion size={28} strokeWidth={1.5} />
            </div>
            <h2 className="font-semibold text-foreground">
                Página não encontrada
            </h2>
            <p className="text-sm text-muted-foreground">
                O registro não existe ou foi removido.
            </p>
            <Button asChild variant="outline" size="sm">
                <Link href="/dashboard">Voltar ao dashboard</Link>
            </Button>
        </div>
    );
}
