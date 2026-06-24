import { Layers, MapPin, Network } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
    summary: {
        totalNetworks: number;
        totalDepartments: number;
        totalLocations: number;
    };
};

export function StatsCards({ summary }: Props) {
    const cards = [
        {
            title: "Redes Mapeadas",
            value: summary.totalNetworks,
            description: "Escopos IPv4 ativos",
            icon: <Network size={18} />,
            // Estilização temática em Azul
            borderColor:
                "border-l-4 border-l-blue-500 border-zinc-200/80 dark:border-zinc-800",
            iconBg: "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400",
        },
        {
            title: "Departamentos",
            value: summary.totalDepartments,
            description: "Setores organizados",
            icon: <Layers size={18} />,
            // Estilização temática em Roxo
            borderColor:
                "border-l-4 border-l-purple-500 border-zinc-200/80 dark:border-zinc-800",
            iconBg: "bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400",
        },
        {
            title: "Locais Físicos",
            value: summary.totalLocations,
            description: "Prédios e filiais",
            icon: <MapPin size={18} />,
            // Estilização temática em Verde Esmeralda
            borderColor:
                "border-l-4 border-l-emerald-500 border-zinc-200/80 dark:border-zinc-800",
            iconBg: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400",
        },
    ];

    return (
        // Mudamos de sm:grid-cols-3 para grid-cols-3 direto para manter o alinhamento horizontal,
        // e reduzimos o gap e padding para se comportar bem no espaço menor.
        <div className="grid grid-cols-3 gap-3">
            {cards.map((card, idx) => (
                <Card
                    key={idx}
                    className={`shadow-sm transition-all hover:shadow-md ${card.borderColor}`}
                >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-1">
                        <CardTitle className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground truncate">
                            {card.title}
                        </CardTitle>
                        {/* Ícones ligeiramente menores (p-1.5) para encaixar na nova proporção */}
                        <div
                            className={`p-1.5 rounded-lg transition-colors shrink-0 ${card.iconBg}`}
                        >
                            {card.icon}
                        </div>
                    </CardHeader>
                    <CardContent className="p-3 pt-1">
                        <div className="text-xl sm:text-2xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">
                            {card.value}
                        </div>
                        <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                            {card.description}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
