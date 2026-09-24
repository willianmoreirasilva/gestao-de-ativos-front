import React from "react";

interface AuditLogActionBadgeProps {
    action: string;
}

export function AuditLogActionBadge({ action }: AuditLogActionBadgeProps) {
    const formattedAction = action.toUpperCase();

    let variantClasses = "bg-muted/80 text-muted-foreground border-border";
    let label = action;

    switch (formattedAction) {
        case "CREATE":
            variantClasses =
                "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
            label = "Criou";
            break;
        case "UPDATE":
            variantClasses =
                "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
            label = "Atualizou";
            break;
        case "DELETE":
            variantClasses =
                "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
            label = "Excluiu";
            break;
        case "LOGIN":
            variantClasses =
                "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
            label = "Login";
            break;
        case "LOGOUT":
            variantClasses =
                "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20";
            label = "Logout";
            break;
        case "EXPORT":
            variantClasses =
                "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20";
            label = "Exportou";
            break;
    }

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors ${variantClasses}`}
        >
            {label}
        </span>
    );
}
