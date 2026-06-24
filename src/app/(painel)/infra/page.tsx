import { getInfraDashboardData } from "@/actions/infra-dashboard";
import { CapacityChart } from "@/components/infra/dashboard/capactity-chart";
import { DashboardHeader } from "@/components/infra/dashboard/header";
import { ModuleShortcuts } from "@/components/infra/dashboard/module-shortcuts";
import { StatsCards } from "@/components/infra/dashboard/stats-cards";

export default async function InfraDashboardPage() {
    const { data, error } = await getInfraDashboardData();

    if (error || !data) {
        return (
            <div className="p-6 text-center text-destructive font-medium border border-destructive/20 bg-destructive/5 rounded-xl">
                {error ||
                    "Erro crítico ao carregar as informações do dashboard."}
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header com o título geral */}
            <DashboardHeader
                title="Infraestrutura Geral"
                description="Painel de controle técnico, controle de sub-redes e organização de escopos corporativos."
            />

            {/* 🌟 Grid Principal: Divide a tela milimetricamente em 50% / 50% */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* 👉 LADO ESQUERDO (Ocupa 6 colunas)
                  Colocamos os cards pequenos e os atalhos agrupados aqui.
                  O space-y-6 garante o espaçamento vertical entre eles.
                */}
                <div className="lg:col-span-6 space-y-6">
                    {/* Agora renderizado aqui, ele fica compacto e restrito à metade da tela */}
                    <StatsCards summary={data.summary} />

                    {/* Atalhos com as cores logo abaixo */}
                    <ModuleShortcuts />
                </div>

                {/* 👉 LADO DIREITO (Ocupa 6 colunas)
                  Ao isolar este bloco na sua própria coluna desde a raiz do grid, 
                  ele automaticamente sobe e se alinha com o topo da tela.
                */}
                <div className="lg:col-span-6 h-full">
                    <CapacityChart
                        inUse={data.summary.totalIpsInUse}
                        available={data.summary.totalIpsAvailable}
                        networksUsage={data.networksUsage}
                    />
                </div>
            </div>
        </div>
    );
}
