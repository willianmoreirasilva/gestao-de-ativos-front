"use client";

import { Camera } from "lucide-react";
import React from "react";

interface ReportCameraFiltersProps {
    hostname?: string;
    model?: string;
    cameraHostname?: string; // Fallback de compatibilidade
    cameraModel?: string; // Fallback de compatibilidade
    onChange: (field: string, val: string | undefined) => void;
}

export function ReportCameraFilters({
    hostname,
    model,
    cameraHostname,
    cameraModel,
    onChange,
}: ReportCameraFiltersProps) {
    const activeHostname = hostname ?? cameraHostname ?? "";
    const activeModel = model ?? cameraModel ?? "";

    return (
        <div className="p-3.5 bg-muted/30 rounded-xl border border-border/80 space-y-2.5">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Camera
                    size={13}
                    className="text-purple-600 dark:text-purple-400"
                />{" "}
                Especificações da Câmera
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <label className="text-[10px] font-medium text-muted-foreground mb-1 block">
                        Hostname / Nome
                    </label>
                    <input
                        type="text"
                        value={activeHostname}
                        onChange={(e) =>
                            onChange("hostname", e.target.value || undefined)
                        }
                        placeholder="Ex: CAM-BLOCO-1-01"
                        className="w-full bg-background border border-border text-foreground placeholder:text-muted-foreground/60 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                </div>
                <div>
                    <label className="text-[10px] font-medium text-muted-foreground mb-1 block">
                        Modelo
                    </label>
                    <input
                        type="text"
                        value={activeModel}
                        onChange={(e) =>
                            onChange("model", e.target.value || undefined)
                        }
                        placeholder="Ex: VIP 1230 B"
                        className="w-full bg-background border border-border text-foreground placeholder:text-muted-foreground/60 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                </div>
            </div>
        </div>
    );
}
