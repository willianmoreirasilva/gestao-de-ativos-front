import {
    AlertTriangle,
    ArrowRight,
    Building2,
    Layers,
    MapPin,
    Network,
} from "lucide-react";
import Link from "next/link";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// Componentes Oficiais do Shadcn UI instalados
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PageTitle } from "@/components/users/page-title";

export default function InfraDashboardPage() {
    // 📊 DADOS FALSOS (MOCK) - Altere estes números para testar o comportamento visual
    const mockData = {
        totalNetworks: 13,
        totalDepartments: 8,
        totalLocations: 3,
        ipsAllocated: 142,
        ipsTotal: 254, // Exemplo de um escopo /24 cheio
        networksRunningLow: 2, // Quantidade de redes com poucos IPs disponíveis
    };

    // Cálculo da porcentagem de uso de IP
    const allocationPercentage = Math.round(
        (mockData.ipsAllocated / mockData.ipsTotal) * 100,
    );
    const ipsAvailable = mockData.ipsTotal - mockData.ipsAllocated;

    return (
        <div className="space-y-8">
            <PageTitle title="Visão Geral da Infraestrutura" />

            {/* 🌟 1. LINHA DE CARDS ESTATÍSTICOS (KPIs do Shadcn) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Card 1: Redes */}
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="space-y-0.5">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Redes Ativas
                            </CardTitle>
                        </div>
                        <div className="p-2 bg-zinc-100 dark:bg-zinc-900 rounded-lg text-zinc-600 dark:text-zinc-400">
                            <Network size={18} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {mockData.totalNetworks}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Escopos IPv4 ativos
                        </p>
                    </CardContent>
                </Card>

                {/* Card 2: Departamentos */}
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="space-y-0.5">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Departamentos
                            </CardTitle>
                        </div>
                        <div className="p-2 bg-zinc-100 dark:bg-zinc-900 rounded-lg text-zinc-600 dark:text-zinc-400">
                            <Layers size={18} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {mockData.totalDepartments}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Setores vinculados
                        </p>
                    </CardContent>
                </Card>

                {/* Card 3: Locais */}
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="space-y-0.5">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Locais Físicos
                            </CardTitle>
                        </div>
                        <div className="p-2 bg-zinc-100 dark:bg-zinc-900 rounded-lg text-zinc-600 dark:text-zinc-400">
                            <Building2 size={18} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {mockData.totalLocations}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Prédios e filiais ativas
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* 🌟 2. ÁREA CENTRAL: CAPACIDADE E LINKS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bloco Esquerdo: Monitoramento de IPs e Alertas */}
                <Card className="shadow-sm flex flex-col justify-between">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">
                            Capacidade Geral de Endereçamento
                        </CardTitle>
                        <CardDescription>
                            Métrica consolidada de IPs em uso na infraestrutura.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Utilização da barra de Progresso do Shadcn */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                    Consumo de IPs utilizáveis
                                </span>
                                <span className="font-semibold">
                                    {allocationPercentage}%
                                </span>
                            </div>
                            <Progress
                                value={allocationPercentage}
                                className="h-2.5"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground pt-1">
                                <span>
                                    {mockData.ipsAllocated} IPs Alocados
                                </span>
                                <span>{ipsAvailable} IPs Livres</span>
                            </div>
                        </div>

                        {/* Alerta de Segurança Condicional */}
                        {mockData.networksRunningLow > 0 && (
                            <Alert
                                variant="destructive"
                                className="bg-amber-50/50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-400 border-amber-200/60 dark:border-amber-900/40"
                            >
                                <AlertTriangle className="h-4 w-4 !text-amber-600 dark:!text-amber-400" />
                                <AlertTitle className="font-medium">
                                    Sub-redes Próximas do Limite
                                </AlertTitle>
                                <AlertDescription className="text-xs text-amber-800 dark:text-amber-400/90">
                                    Há {mockData.networksRunningLow} redes
                                    operando com menos de 15 IPs disponíveis.
                                    Recomenda-se expandir o CIDR ou liberar
                                    escopos obsoletos.
                                </AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                </Card>

                {/* Bloco Direito: Menu de Atalhos Rápidos */}
                <div className="space-y-4">
                    <h3 className="font-medium text-sm text-muted-foreground pl-1">
                        Módulos da Área Técnica
                    </h3>

                    {/* Atalho 1: Redes */}
                    <Link href="/infra/networks" className="group block">
                        <Card className="hover:border-zinc-300 dark:hover:border-zinc-700 transition-all shadow-sm">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-zinc-50 dark:bg-zinc-900 group-hover:bg-zinc-100 text-zinc-600 dark:text-zinc-400 rounded-lg transition-colors">
                                        <Network size={20} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm text-zinc-900 dark:text-zinc-50">
                                            Gerenciar Sub-redes
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Topologia CIDR, mapeamento de VLANs
                                            e escopos técnicos.
                                        </p>
                                    </div>
                                </div>
                                <ArrowRight
                                    size={16}
                                    className="text-muted-foreground group-hover:translate-x-1 transition-transform"
                                />
                            </CardContent>
                        </Card>
                    </Link>

                    {/* Atalho 2: Departamentos */}
                    <Link href="/infra/departments" className="group block">
                        <Card className="hover:border-zinc-300 dark:hover:border-zinc-700 transition-all shadow-sm">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-zinc-50 dark:bg-zinc-900 group-hover:bg-zinc-100 text-zinc-600 dark:text-zinc-400 rounded-lg transition-colors">
                                        <Layers size={20} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm text-zinc-900 dark:text-zinc-50">
                                            Gerenciar Departamentos
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Organização hierárquica e vinculação
                                            de ativos de rede.
                                        </p>
                                    </div>
                                </div>
                                <ArrowRight
                                    size={16}
                                    className="text-muted-foreground group-hover:translate-x-1 transition-transform"
                                />
                            </CardContent>
                        </Card>
                    </Link>

                    {/* Atalho 3: Locais */}
                    <Link href="/infra/locations" className="group block">
                        <Card className="hover:border-zinc-300 dark:hover:border-zinc-700 transition-all shadow-sm">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-zinc-50 dark:bg-zinc-900 group-hover:bg-zinc-100 text-zinc-600 dark:text-zinc-400 rounded-lg transition-colors">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm text-zinc-900 dark:text-zinc-50">
                                            Gerenciar Locais Físicos
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Cadastro de matriz, filiais, galpões
                                            e salas técnicas.
                                        </p>
                                    </div>
                                </div>
                                <ArrowRight
                                    size={16}
                                    className="text-muted-foreground group-hover:translate-x-1 transition-transform"
                                />
                            </CardContent>
                        </Card>
                    </Link>
                </div>
            </div>
        </div>
    );
}
