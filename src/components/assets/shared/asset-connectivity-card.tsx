import { Terminal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { QuickChangeIpModal } from "./quick-change-ip-modal";

interface AssetConnectivityCardProps {
    assetId: string;
    patrimony?: string | null;
    ip?: { address: string } | null;
    vlanType: "GENERAL_DATA" | "CAMERA_VLAN" | "SWITCH_MGMT" | "WIFI_MGMT";
}

export function AssetConnectivityCard({ assetId, patrimony, ip, vlanType }: AssetConnectivityCardProps) {
    return (
        <Card className="shadow-sm border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col justify-between">
            <CardHeader className="border-b border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/20 py-4">
                <CardTitle className="text-sm font-bold tracking-wide uppercase text-zinc-500 flex items-center gap-2">
                    <Terminal size={16} className="text-emerald-500" /> Conectividade IP
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                    <div className="space-y-1">
                        <span className="text-xs text-muted-foreground block">Endereço IPv4 Atribuído</span>
                        {ip?.address ? (
                            <Badge className="text-sm font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-none px-3 py-0.5">
                                {ip.address}
                            </Badge>
                        ) : (
                            <Badge variant="destructive" className="text-xs font-semibold">Sem Endereço IP</Badge>
                        )}
                    </div>
                    
                    <div className="space-y-1">
                        <span className="text-xs text-muted-foreground block">Patrimônio Corporativo</span>
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100 uppercase">
                            {patrimony || "Sem Etiqueta"}
                        </span>
                    </div>
                </div>

                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-900">
                    <QuickChangeIpModal assetId={assetId} currentIp={ip?.address || null} vlanType={vlanType} />
                </div>
            </CardContent>
        </Card>
    );
}