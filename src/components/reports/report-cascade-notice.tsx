import { AlertTriangle } from "lucide-react";

import type { ReportCascadeInfo } from "@/types/report";

interface ReportCascadeNoticeProps {
    cascade?: ReportCascadeInfo;
}

// Aviso de que a cascata foi cortada no limite de níveis: há ativos mais
// abaixo que não entraram no resultado
export function ReportCascadeNotice({ cascade }: ReportCascadeNoticeProps) {
    if (!cascade?.truncated) return null;

    return (
        <div
            role="alert"
            className="flex items-center gap-2 border-b border-amber-300/60 bg-amber-50 px-4 py-2.5 text-xs font-medium text-amber-800 dark:border-amber-800/40 dark:bg-amber-950/40 dark:text-amber-300"
        >
            <AlertTriangle className="h-4 w-4 shrink-0" />
            Resultado limitado a {cascade.maxDepth} níveis: há ativos mais
            abaixo na cascata que não aparecem aqui.
        </div>
    );
}
