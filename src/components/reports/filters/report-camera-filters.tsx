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
        <div className="p-3 bg-zinc-950/50 rounded-lg border border-zinc-800 space-y-2">
            <span className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <Camera size={13} className="text-purple-400" /> Especificações
                da Câmera
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <label className="text-[10px] font-medium text-zinc-400 mb-1 block">
                        Hostname / Nome
                    </label>
                    <input
                        type="text"
                        value={activeHostname}
                        onChange={(e) =>
                            onChange("hostname", e.target.value || undefined)
                        }
                        placeholder="Ex: CAM-BLOCO-1-01"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
                    />
                </div>
                <div>
                    <label className="text-[10px] font-medium text-zinc-400 mb-1 block">
                        Modelo
                    </label>
                    <input
                        type="text"
                        value={activeModel}
                        onChange={(e) =>
                            onChange("model", e.target.value || undefined)
                        }
                        placeholder="Ex: VIP 1230 B"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
                    />
                </div>
            </div>
        </div>
    );
}
