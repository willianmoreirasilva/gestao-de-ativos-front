// src/config/sidebar-menu.ts
import {
    BookHeadphones,
    BookMinus,
    Cctv,
    Computer,
    Cpu,
    FileDown,
    FileText,
    History,
    Home,
    Layers,
    LayoutDashboard,
    LayoutGrid,
    MapPin,
    Network,
    PanelsTopLeft,
    Pentagon,
    Phone,
    Printer,
    Radio,
    ShieldAlert,
    Wifi,
    Zap,
} from "lucide-react";

export type MenuItem = {
    title: string;
    url?: string;
    icon: React.ElementType;
    allowedRoles?: ("ADMIN" | "USER" | "CAM_OPERATOR")[];
    isQuickSearch?: boolean; // Dispara a Command Palette (modal)
    shortcut?: string;
};

export type GroupMenu = {
    title: string;
    url?: string;
    icon: React.ElementType;
    items: MenuItem[];
};

export const sidebarMenuConfig: GroupMenu[] = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
        items: [
            { title: "Página Inicial", url: "/dashboard", icon: Home },
            {
                title: "Visão Geral de IPs",
                url: "/dashboard/overview",
                icon: PanelsTopLeft,
            },
        ],
    },
    {
        title: "Infraestrutura & Redes",
        url: "/infra",
        icon: Layers,
        items: [
            {
                title: "Redes e Subredes",
                url: "/infra/networks",
                icon: Network,
                allowedRoles: ["ADMIN", "USER"],
            },
            {
                title: "Departamentos",
                url: "/infra/departments",
                icon: Pentagon,
                allowedRoles: ["ADMIN", "USER"],
            },
            {
                title: "Localizações / Prédios",
                url: "/infra/locations",
                icon: MapPin,
                allowedRoles: ["ADMIN", "USER"],
            },
        ],
    },
    {
        title: "Ativos de TI",
        url: "/assets",
        icon: Cpu,
        items: [
            {
                title: "Computadores",
                url: "/assets/computers",
                icon: Computer,
                allowedRoles: ["ADMIN", "USER"],
            },
            {
                title: "Impressoras",
                url: "/assets/printers",
                icon: Printer,
                allowedRoles: ["ADMIN", "USER"],
            },
            {
                title: "Telefonia VoIP",
                url: "/assets/phones",
                icon: Phone,
                allowedRoles: ["ADMIN", "USER"],
            },
            {
                title: "Câmeras CFTV",
                url: "/assets/cameras",
                icon: Cctv,
                allowedRoles: ["ADMIN", "USER", "CAM_OPERATOR"],
            },
            {
                title: "Switches",
                url: "/assets/switches",
                icon: Radio,
                allowedRoles: ["ADMIN", "USER"],
            },
            {
                title: "Access Points",
                url: "/assets/access-points",
                icon: Wifi,
                allowedRoles: ["ADMIN", "USER"],
            },
        ],
    },
    {
        title: "Ferramentas",

        icon: Zap,
        items: [
            {
                title: "Consulta Rápida",
                icon: Zap,
                isQuickSearch: true,
                shortcut: "⌘K",
            },
        ],
    },
    {
        title: "Relatórios & Auditoria",

        icon: FileText,
        items: [
            {
                title: "Construtor de Relatórios",
                url: "/reports",
                icon: LayoutGrid, // ou SlidersHorizontal
                allowedRoles: ["ADMIN", "USER"],
            },

            {
                title: "Logs de Operações",
                url: "/audit-logs",
                icon: History,
                allowedRoles: ["ADMIN", "USER"],
            },
        ],
    },
];
