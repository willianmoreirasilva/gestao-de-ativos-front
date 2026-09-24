"use client";

import { Phone } from "lucide-react";
import React from "react";

interface ReportPhoneFiltersProps {
    hostname?: string;
    model?: string;
    phoneNumber?: string;
    onChange: (field: string, val: string | undefined) => void;
}

export function ReportPhoneFilters({
    hostname,
    model,
    phoneNumber,
    onChange,
}: ReportPhoneFiltersProps) {
    return (
        <div className="p-3.5 bg-muted/30 rounded-xl border border-border/80 space-y-2.5">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Phone
                    size={13}
                    className="text-emerald-600 dark:text-emerald-400"
                />{" "}
                Especificações do Telefone / Ramal
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                    <label className="text-[10px] font-medium text-muted-foreground mb-1 block">
                        Hostname / Nome
                    </label>
                    <input
                        type="text"
                        value={hostname || ""}
                        onChange={(e) =>
                            onChange("hostname", e.target.value || undefined)
                        }
                        placeholder="Ex: TEL-RECEPCAO-01"
                        className="w-full bg-background border border-border text-foreground placeholder:text-muted-foreground/60 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                </div>
                <div>
                    <label className="text-[10px] font-medium text-muted-foreground mb-1 block">
                        Modelo
                    </label>
                    <input
                        type="text"
                        value={model || ""}
                        onChange={(e) =>
                            onChange("model", e.target.value || undefined)
                        }
                        placeholder="Ex: GXP1625"
                        className="w-full bg-background border border-border text-foreground placeholder:text-muted-foreground/60 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                </div>
                <div>
                    <label className="text-[10px] font-medium text-muted-foreground mb-1 block">
                        Ramal / Número
                    </label>
                    <input
                        type="text"
                        value={phoneNumber || ""}
                        onChange={(e) =>
                            onChange("phoneNumber", e.target.value || undefined)
                        }
                        placeholder="Ex: 2001, 2002"
                        className="w-full bg-background border border-border text-foreground placeholder:text-muted-foreground/60 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                </div>
            </div>
        </div>
    );
}
