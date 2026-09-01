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
        color: "text-blue-400 bg-blue-500/10 border-blue-500/20 group-hover:border-blue-500/50",
        href: "/assets/computers",
        description: "Desktops, Notebooks e Estações de Trabalho",
    },
    PRINTER: {
        label: "Impressoras",
        icon: Printer,
        color: "text-amber-400 bg-amber-500/10 border-amber-500/20 group-hover:border-amber-500/50",
        href: "/assets/printers",
        description: "Térmicas, Laser e Multifuncionais",
    },
    PHONE: {
        label: "Telefones VoIP",
        icon: PhoneCall,
        color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 group-hover:border-emerald-500/50",
        href: "/assets/phones",
        description: "Ramais e Aparelhos IP",
    },
    SWITCH: {
        label: "Switches",
        icon: Network,
        color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20 group-hover:border-indigo-500/50",
        href: "/assets/switches",
        description: "Concentradores de Rede Gerenciáveis",
    },
    ACCESS_POINT: {
        label: "Access Points",
        icon: Wifi,
        color: "text-purple-400 bg-purple-500/10 border-purple-500/20 group-hover:border-purple-500/50",
        href: "/assets/access-points",
        description: "Pontos de Acesso Wi-Fi Corporativos",
    },
    CAMERA: {
        label: "Câmeras IP",
        icon: Camera,
        color: "text-rose-400 bg-rose-500/10 border-rose-500/20 group-hover:border-rose-500/50",
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
        <div className="space-y-8 p-8 max-w-400 mx-auto">
            {/* Header com fontes maiores e buscador destacado */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-zinc-200 dark:border-zinc-800/80 pb-6">
                <div className="space-y-1">
                    <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500">
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

            {/* Top KPIs com Tipografia Robusta */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <Card className="bg-linear-to-br from-blue-950/20 to-zinc-950 border-blue-900/30 dark:border-blue-800/30 shadow-lg relative overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-blue-400">
                            Total de Ativos Cadastrados
                        </CardTitle>
                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                            <Cpu className="h-5 w-5" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <div className="text-4xl font-black text-zinc-900 dark:text-zinc-50">
                            {totalAssets}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Equipamentos em monitoramento contínuo
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800/80 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Categorias Mapeadas
                        </CardTitle>
                        <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                            <Layers className="h-5 w-5" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <div className="text-4xl font-black text-zinc-900 dark:text-zinc-50">
                            {assetsByType.length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Tipos de equipamentos catalogados
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800/80 shadow-sm sm:col-span-2 lg:col-span-1">
                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Setores Atendidos
                        </CardTitle>
                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                            <Building2 className="h-5 w-5" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <div className="text-4xl font-black text-zinc-900 dark:text-zinc-50">
                            {totalDepartments}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Departamentos com ativos vinculados
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Categorias de Ativos com Espaçamento Amplo */}
            <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
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
                            color: "text-zinc-400 bg-zinc-500/10 border-zinc-500/20",
                            href: "#",
                            description: "Dispositivos catalogados",
                        };
                        const Icon = config.icon;
                        const percentage = totalAssets
                            ? Math.round((item.count / totalAssets) * 100)
                            : 0;

                        return (
                            <Link key={item.type} href={config.href}>
                                <Card className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800/80 hover:border-zinc-400 dark:hover:border-zinc-700 transition-all duration-200 cursor-pointer group shadow-sm hover:shadow-md p-2">
                                    <CardHeader className="p-4 pb-3 flex flex-row items-start justify-between space-y-0">
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={`p-3 rounded-xl border transition-all duration-200 ${config.color}`}
                                            >
                                                <Icon className="h-6 w-6" />
                                            </div>
                                            <div className="space-y-1">
                                                <CardTitle className="text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-400 transition-colors">
                                                    {config.label}
                                                </CardTitle>
                                                <CardDescription className="text-xs line-clamp-1">
                                                    {config.description}
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-2 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-900/60 mt-2">
                                        <Badge
                                            variant="secondary"
                                            className="text-xs font-semibold px-2.5 py-0.5 bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800"
                                        >
                                            {percentage}% do inventário
                                        </Badge>
                                        <span className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
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
