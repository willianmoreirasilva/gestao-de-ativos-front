"use client";

import {
    Camera,
    CornerDownLeft,
    Cpu,
    HardDrive,
    Loader2,
    Monitor,
    Phone,
    Printer,
    Wifi,
} from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

import {
    SearchAssetItem,
    searchAssetsAction,
} from "@/actions/assets/search-assets.action";
import { Badge } from "@/components/ui/badge";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const ASSET_ROUTE_MAP: Record<string, string> = {
    COMPUTER: "/assets/computers",
    PRINTER: "/assets/printers",
    PHONE: "/assets/phones",
    ACCESS_POINT: "/assets/access-points",
    CAMERA: "/assets/cameras",
    SWITCH: "/assets/switches",
};

const ASSET_TYPE_CONFIG: Record<
    string,
    { label: string; icon: React.ElementType; color: string }
> = {
    COMPUTER: {
        label: "Computador",
        icon: Monitor,
        color: "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20",
    },
    PRINTER: {
        label: "Impressora",
        icon: Printer,
        color: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
    PHONE: {
        label: "Telefone IP",
        icon: Phone,
        color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    ACCESS_POINT: {
        label: "Access Point",
        icon: Wifi,
        color: "text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20",
    },
    CAMERA: {
        label: "Câmera",
        icon: Camera,
        color: "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20",
    },
    SWITCH: {
        label: "Switch",
        icon: HardDrive,
        color: "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    },
    OTHER: {
        label: "Ativo",
        icon: Cpu,
        color: "text-muted-foreground bg-muted border-border",
    },
};

export function QuickSearchModal({
    open,
    onOpenChange,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const router = useRouter();
    const [query, setQuery] = React.useState("");
    const [results, setResults] = React.useState<SearchAssetItem[]>([]);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        if (!open) {
            setQuery("");
            setResults([]);
        }
    }, [open]);

    React.useEffect(() => {
        if (!query.trim() || query.length < 2) {
            setResults([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        const timer = setTimeout(async () => {
            try {
                const data = await searchAssetsAction(query);
                setResults(data);
            } catch (err) {
                console.error("Erro na busca de ativos:", err);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    const handleSelect = (asset: SearchAssetItem) => {
        onOpenChange(false);
        setQuery("");
        setResults([]);

        const routePrefix = ASSET_ROUTE_MAP[asset.type] || "/assets";
        router.push(`${routePrefix}/${asset.id}`);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl w-full p-0 gap-0 overflow-hidden bg-card border-border text-foreground rounded-2xl shadow-xl">
                <DialogHeader className="sr-only">
                    <DialogTitle>Busca Rápida de Ativos</DialogTitle>
                </DialogHeader>

                <Command className="bg-card text-foreground [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-xs">
                    <CommandInput
                        placeholder="Buscar por hostname, usuário, IP, MAC, patrimônio, AnyDesk..."
                        value={query}
                        onValueChange={setQuery}
                        className="border-b border-border/80 bg-background text-foreground placeholder:text-muted-foreground/60 h-13"
                    />

                    <CommandList className="max-h-[380px] p-2 bg-card text-foreground">
                        {loading && (
                            <div className="flex items-center justify-center p-6 text-sm text-muted-foreground gap-2">
                                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                Pesquisando no inventário...
                            </div>
                        )}

                        {!loading &&
                            query.length >= 2 &&
                            results.length === 0 && (
                                <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                                    Nenhum ativo localizado com os termos
                                    informados.
                                </CommandEmpty>
                            )}

                        {!loading && results.length > 0 && (
                            <CommandGroup
                                heading={`Resultados Encontrados (${results.length})`}
                            >
                                {results.map((asset) => {
                                    const typeConfig =
                                        ASSET_TYPE_CONFIG[asset.type] ||
                                        ASSET_TYPE_CONFIG.OTHER;
                                    const IconComponent = typeConfig.icon;

                                    const searchKeywords = `${asset.id} ${asset.displayName} ${asset.subTitle || ""} ${typeConfig.label} ${asset.ipAddress || ""} ${asset.mac || ""} ${asset.patrimony || ""}`;

                                    return (
                                        <CommandItem
                                            key={asset.id}
                                            value={searchKeywords}
                                            onSelect={() => handleSelect(asset)}
                                            className="flex items-center justify-between p-3 rounded-xl cursor-pointer hover:bg-muted/60 data-[selected=true]:bg-muted/80 transition-all border border-transparent hover:border-border/60 my-1 group text-foreground"
                                        >
                                            <div className="flex items-center gap-3.5 min-w-0">
                                                <div
                                                    className={`p-2.5 rounded-xl border shrink-0 ${typeConfig.color}`}
                                                >
                                                    <IconComponent className="h-5 w-5" />
                                                </div>

                                                <div className="flex flex-col gap-1 min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors truncate">
                                                            {asset.displayName}
                                                        </span>

                                                        <Badge
                                                            variant="outline"
                                                            className="text-[10px] font-mono px-1.5 py-0 uppercase bg-muted/80 border-border text-muted-foreground"
                                                        >
                                                            {typeConfig.label}
                                                        </Badge>

                                                        {asset.patrimony && (
                                                            <span className="text-[11px] font-mono text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded border border-border/60">
                                                                #
                                                                {
                                                                    asset.patrimony
                                                                }
                                                            </span>
                                                        )}
                                                    </div>

                                                    {asset.subTitle && (
                                                        <span className="text-xs text-muted-foreground truncate">
                                                            {asset.subTitle}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-end gap-1 text-xs font-mono ml-4 shrink-0">
                                                {asset.ipAddress ? (
                                                    <span className="text-blue-600 dark:text-blue-400 font-semibold bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                                                        {asset.ipAddress}
                                                    </span>
                                                ) : (
                                                    <span className="text-muted-foreground/60 text-[11px]">
                                                        Sem IP
                                                    </span>
                                                )}

                                                {asset.mac && (
                                                    <span className="text-[10px] text-muted-foreground tracking-wider">
                                                        {asset.mac}
                                                    </span>
                                                )}
                                            </div>
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                        )}
                    </CommandList>

                    {/* Rodapé customizado integrado ao tema */}
                    <div className="flex items-center justify-between px-4 py-2.5 border-t border-border/80 bg-muted/40 text-[11px] text-muted-foreground font-mono">
                        <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                                <kbd className="px-1.5 py-0.5 bg-background rounded border border-border text-foreground shadow-2xs">
                                    ↑↓
                                </kbd>{" "}
                                Navegar
                            </span>
                            <span className="flex items-center gap-1">
                                <kbd className="px-1.5 py-0.5 bg-background rounded border border-border text-foreground shadow-2xs flex items-center gap-0.5">
                                    <CornerDownLeft className="h-2.5 w-2.5" />{" "}
                                    Enter
                                </kbd>{" "}
                                Selecionar
                            </span>
                        </div>
                        <div>
                            <kbd className="px-1.5 py-0.5 bg-background rounded border border-border text-foreground shadow-2xs">
                                ESC
                            </kbd>{" "}
                            Fechar
                        </div>
                    </div>
                </Command>
            </DialogContent>
        </Dialog>
    );
}
