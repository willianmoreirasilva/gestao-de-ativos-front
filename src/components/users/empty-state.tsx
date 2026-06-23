import { FolderOpen } from "lucide-react"; // Ícone genérico elegante
import Link from "next/link";

import { Button } from "@/components/ui/button";

type Props = {
    message: string;
    label?: string; // 🌟 Opcional agora
    href?: string; // 🌟 Opcional agora
};

export function EmptyState({ message, label, href }: Props) {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center max-w-sm mx-auto space-y-4">
            {/* Ícone sutil de estado vazio comum em sistemas modernos */}
            <div className="p-3 bg-zinc-100 dark:bg-zinc-900 rounded-full text-zinc-400">
                <FolderOpen size={28} strokeWidth={1.5} />
            </div>

            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
                {message}
            </p>

            {href && label && (
                <Link href={href} className="pt-2">
                    <Button size="sm" className="shadow-sm font-medium">
                        {label}
                    </Button>
                </Link>
            )}
        </div>
    );
}
