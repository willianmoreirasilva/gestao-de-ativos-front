import {
    Building2,
    Camera,
    Cpu,
    HardDrive,
    Laptop,
    Layers,
    Network,
    PhoneCall,
    Printer,
    Wifi,
} from "lucide-react";
import Link from "next/link";

import { getAssetDashboardData } from "@/actions/asset-dashboard.action";
import { QuickSearchTrigger } from "@/components/assets/quick-search-Trigger";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const ASSET_TYPE_CONFIG: Record<
    string,
    {
        label: string;
        icon: any;
        color: string;
        href: string;
        description: string;
    }
> = {
    COMPUTER: {
        label: "Computadores",
        icon: Laptop,
        color: "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20 group-hover:border-blue-500/50",
        href: "/assets/computers",
        description: "Desktops, Notebooks e Estações de Trabalho",
    },
    PRINTER: {
        label: "Impressoras",
        icon: Printer,
        color: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20 group-hover:border-amber-500/50",
        href: "/assets/printers",
        description: "Térmicas, Laser e Multifuncionais",
    },
    PHONE: {
        label: "Telefones VoIP",
        icon: PhoneCall,
        color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20 group-hover:border-emerald-500/50",
        href: "/assets/phones",
        description: "Ramais e Aparelhos IP",
    },
    SWITCH: {
        label: "Switches",
        icon: Network,
        color: "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20 group-hover:border-indigo-500/50",
        href: "/assets/switches",
        description: "Concentradores de Rede Gerenciáveis",
    },
    ACCESS_POINT: {
        label: "Access Points",
        icon: Wifi,
        color: "text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20 group-hover:border-purple-500/50",
        href: "/assets/access-points",
        description: "Pontos de Acesso Wi-Fi Corporativos",
    },
    CAMERA: {
        label: "Câmeras IP",
        icon: Camera,
        color: "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20 group-hover:border-rose-500/50",
        href: "/assets/cameras",
        description: "CFTV e Monitoramento",
    },
};

export default async function AssetsDashboardPage() {
    const { data, error } = await getAssetDashboardData();

    if (error || !data) {
        return (
            <div className="p-8 text-center text-destructive font-medium border border-destructive/20 bg-destructive/5 rounded-2xl">
                {error || "Erro crítico ao carregar as informações dos ativos."}
            </div>
        );
    }

    const totalAssets = data.summary.totalAssets || 0;
    const totalDepartments = data.summary.totalDepartments || 0;
    const assetsByType = data.assetsByType || [];

    return (
        <div className="space-y-8 p-6 md:p-8 max-w-7xl mx-auto">
            {/* Header com fontes adaptáveis ao tema */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-border/80 pb-6">
                <div className="space-y-1">
                    <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                            <Layers size={26} />
                        </div>
                        Gestão e Inventário de Ativos
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Controle centralizado de hardware, equipamentos e
                        distribuição por categorias.
                    </p>
                </div>

                <div className="w-full md:w-auto">
                    <QuickSearchTrigger />
                </div>
            </div>

            {/* Top KPIs Corrigidos sem gradiente escuro estático */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <Card className="bg-card border-border/80 shadow-xs relative overflow-hidden transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                            Total de Ativos Cadastrados
                        </CardTitle>
                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                            <Cpu className="h-5 w-5" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <div className="text-4xl font-black text-foreground">
                            {totalAssets}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Equipamentos em monitoramento contínuo
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-card border-border/80 shadow-xs transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Categorias Mapeadas
                        </CardTitle>
                        <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                            <Layers className="h-5 w-5" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <div className="text-4xl font-black text-foreground">
                            {assetsByType.length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Tipos de equipamentos catalogados
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-card border-border/80 shadow-xs transition-colors sm:col-span-2 lg:col-span-1">
                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Setores Atendidos
                        </CardTitle>
                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            <Building2 className="h-5 w-5" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <div className="text-4xl font-black text-foreground">
                            {totalDepartments}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Departamentos com ativos vinculados
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Categorias de Ativos */}
            <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-foreground">
                            Distribuição por Categoria
                        </h2>
                        <p className="text-xs text-muted-foreground">
                            Clique em um card para abrir a listagem filtrada
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {assetsByType.map((item) => {
                        const config = ASSET_TYPE_CONFIG[item.type] || {
                            label: item.type,
                            icon: Cpu,
                            color: "text-muted-foreground bg-muted border-border",
                            href: "#",
                            description: "Dispositivos catalogados",
                        };
                        const Icon = config.icon;
                        const percentage = totalAssets
                            ? Math.round((item.count / totalAssets) * 100)
                            : 0;

                        return (
                            <Link key={item.type} href={config.href}>
                                <Card className="bg-card border-border/80 hover:border-primary/50 transition-all duration-200 cursor-pointer group shadow-xs hover:shadow-md p-2">
                                    <CardHeader className="p-4 pb-3 flex flex-row items-start justify-between space-y-0">
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={`p-3 rounded-xl border transition-all duration-200 ${config.color}`}
                                            >
                                                <Icon className="h-6 w-6" />
                                            </div>
                                            <div className="space-y-1">
                                                <CardTitle className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                                                    {config.label}
                                                </CardTitle>
                                                <CardDescription className="text-xs line-clamp-1 text-muted-foreground">
                                                    {config.description}
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-2 flex items-center justify-between border-t border-border/60 mt-2">
                                        <Badge
                                            variant="secondary"
                                            className="text-xs font-semibold px-2.5 py-0.5 bg-muted text-muted-foreground border border-border/80"
                                        >
                                            {percentage}% do inventário
                                        </Badge>
                                        <span className="text-3xl font-black text-foreground tracking-tight">
                                            {item.count}
                                        </span>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
