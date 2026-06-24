//Bloco com os links e atalhos rápidos

import { ArrowRight, Layers, MapPin, Network } from "lucide-react";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";

export function ModuleShortcuts() {
    const modules = [
        {
            title: "Gerenciar Sub-redes",
            desc: "Topologia CIDR, escopos de IPs e mapeamento de VLANs.",
            href: "/infra/networks",
            icon: <Network size={20} />,
            borderColor:
                "border-l-4 border-l-blue-500 border-zinc-200/80 dark:border-zinc-800",
            iconBg: "bg-blue-50/80 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
        },
        {
            title: "Gerenciar Departamentos",
            desc: "Organização hierárquica e setores internos corporativos.",
            href: "/infra/departments",
            icon: <Layers size={20} />,
            borderColor:
                "border-l-4 border-l-purple-500 border-zinc-200/80 dark:border-zinc-800",
            iconBg: "bg-purple-50/80 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400",
        },
        {
            title: "Gerenciar Locais Físicos",
            desc: "Cadastro de sedes, filiais, galpões e salas técnicas.",
            href: "/infra/locations",
            icon: <MapPin size={20} />,
            borderColor:
                "border-l-4 border-l-emerald-500 border-zinc-200/80 dark:border-zinc-800",
            iconBg: "bg-emerald-50/80 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
        },
    ];

    return (
        <div className="space-y-4">
            <h3 className="font-medium text-xs text-muted-foreground uppercase tracking-wider pl-1">
                Acesso aos Módulos
            </h3>
            <div className="space-y-3">
                {modules.map((mod, idx) => (
                    <Link href={mod.href} key={idx} className="group block">
                        <Card
                            className={`transition-all hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-950 ${mod.borderColor}`}
                        >
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`p-3 rounded-xl transition-colors ${mod.iconBg}`}
                                    >
                                        {mod.icon}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm text-zinc-900 dark:text-zinc-50 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors">
                                            {mod.title}
                                        </p>
                                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                                            {mod.desc}
                                        </p>
                                    </div>
                                </div>
                                <ArrowRight
                                    size={16}
                                    className="text-muted-foreground group-hover:translate-x-1 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-all"
                                />
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
