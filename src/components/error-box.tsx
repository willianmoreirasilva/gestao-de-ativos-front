import { AlertCircle } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

type ErrorBoxProps = {
    message: string;
    retryHref?: string;
};

// Falha ao carregar dados: nunca deve parecer uma lista vazia
export function ErrorBox({ message, retryHref }: ErrorBoxProps) {
    return (
        <div
            role="alert"
            className="flex flex-col sm:flex-row sm:items-center gap-3 text-destructive text-sm p-4 bg-destructive/10 rounded-lg border border-destructive/20"
        >
            <div className="flex items-start gap-3 flex-1">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{message}</span>
            </div>
            {retryHref && (
                <Button asChild variant="outline" size="sm">
                    <Link href={retryHref}>Tentar novamente</Link>
                </Button>
            )}
        </div>
    );
}
