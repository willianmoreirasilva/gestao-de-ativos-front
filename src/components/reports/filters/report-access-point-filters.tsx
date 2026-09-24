"use client";

import { Wifi } from "lucide-react";
import React from "react";

interface ReportAccessPointFiltersProps {
    model?: string;
    vendor?: string;
    ssid?: string;
    frequencyBand?: string;
    onChange: (field: string, val: string | undefined) => void;
}

export function ReportAccessPointFilters({
    model,
    vendor,
    ssid,
    frequencyBand,
    onChange,
}: ReportAccessPointFiltersProps) {
    return (
        <div className="p-3.5 bg-muted/30 rounded-xl border border-border/80 space-y-2.5">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Wifi
                    size={13}
                    className="text-amber-600 dark:text-amber-400"
                />{" "}
                Especificações do Access Point
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                    <label className="text-[10px] font-medium text-muted-foreground mb-1 block">
                        Fabricante
                    </label>
                    <input
                        type="text"
                        value={vendor || ""}
                        onChange={(e) =>
                            onChange("vendor", e.target.value || undefined)
                        }
                        placeholder="Ex: Ubiquiti, TP-Link"
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
                        placeholder="Ex: UniFi AP AC Pro"
                        className="w-full bg-background border border-border text-foreground placeholder:text-muted-foreground/60 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                </div>
                <div>
                    <label className="text-[10px] font-medium text-muted-foreground mb-1 block">
                        SSID
                    </label>
                    <input
                        type="text"
                        value={ssid || ""}
                        onChange={(e) =>
                            onChange("ssid", e.target.value || undefined)
                        }
                        placeholder="Ex: Wi-Fi Corporativo"
                        className="w-full bg-background border border-border text-foreground placeholder:text-muted-foreground/60 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                </div>
                <div>
                    <label className="text-[10px] font-medium text-muted-foreground mb-1 block">
                        Frequência / Banda
                    </label>
                    <input
                        type="text"
                        value={frequencyBand || ""}
                        onChange={(e) =>
                            onChange(
                                "frequencyBand",
                                e.target.value || undefined,
                            )
                        }
                        placeholder="Ex: 5GHz, Dual-Band"
                        className="w-full bg-background border border-border text-foreground placeholder:text-muted-foreground/60 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                </div>
            </div>
        </div>
    );
}
