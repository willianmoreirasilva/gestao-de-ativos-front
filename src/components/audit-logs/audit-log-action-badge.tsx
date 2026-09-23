import React from "react";

import { Badge } from "@/components/ui/badge";

interface AuditLogActionBadgeProps {
    action: string;
}

export function AuditLogActionBadge({ action }: AuditLogActionBadgeProps) {
    const formattedAction = action.toUpperCase();

    let variantClasses = "bg-zinc-800 text-zinc-300 border-zinc-700";
    let label = action;

    switch (formattedAction) {
        case "CREATE":
            variantClasses =
                "bg-emerald-950/60 text-emerald-400 border-emerald-800/50";
            label = "Criou";
            break;
        case "UPDATE":
            variantClasses =
                "bg-amber-950/60 text-amber-400 border-amber-800/50";
            label = "Atualizou";
            break;
        case "DELETE":
            variantClasses = "bg-rose-950/60 text-rose-400 border-rose-800/50";
            label = "Excluiu";
            break;
        case "LOGIN":
            variantClasses = "bg-blue-950/60 text-blue-400 border-blue-800/50";
            label = "Login";
            break;
        case "EXPORT":
            variantClasses =
                "bg-indigo-950/60 text-indigo-400 border-indigo-800/50";
            label = "Exportou";
            break;
    }

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variantClasses}`}
        >
            {label}
        </span>
    );
}
