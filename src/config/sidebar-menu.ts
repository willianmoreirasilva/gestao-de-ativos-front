import {
    Home,
    PanelsTopLeft,
    Network,
    Pentagon,
    MapPin,
    Computer,
    Printer,
    Phone,
    Cctv,
    Radio,
    Search,
    UserSearch,
    Workflow,
    BookHeadphones,
    BookMinus,
    FileDown,
    LayoutDashboard,
    Layers,
    Cpu,
    Zap,
    FileText,
} from "lucide-react";

export type MenuItem = {
    title: string;
    url: string;
    icon: React.ElementType;
    allowedRoles?: ("ADMIN" | "USER" | "SECURITY_OPERATOR")[];
};

export type GroupMenu = {
    title: string;
    url: string;
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
                title: "Redes, Subredes (CIDR)",
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
                allowedRoles: ["ADMIN", "USER", "SECURITY_OPERATOR"],
            },
            {
                title: "Switches & APs",
                url: "/assets/network-devices",
                icon: Radio,
                allowedRoles: ["ADMIN", "USER"],
            },
        ],
    },
    {
        title: "Consulta Rápida",
        url: "/search",
        icon: Zap,
        items: [
            { title: "Buscar por IP", url: "/search/ip", icon: Search },
            {
                title: "Buscar por Hostname",
                url: "/search/hostname",
                icon: UserSearch,
                allowedRoles: ["ADMIN", "USER"],
            },
            {
                title: "Buscar por MAC Address",
                url: "/search/mac",
                icon: Workflow,
                allowedRoles: ["ADMIN", "USER"],
            },
        ],
    },
    {
        title: "Relatórios & Auditoria",
        url: "/reports",
        icon: FileText,
        items: [
            {
                title: "IPs por Ativo",
                url: "/reports/assets",
                icon: BookHeadphones,
                allowedRoles: ["ADMIN", "USER"],
            },
            {
                title: "IPs por Setor",
                url: "/reports/departments",
                icon: BookMinus,
                allowedRoles: ["ADMIN", "USER"],
            },
            {
                title: "Exportar Dados",
                url: "/reports/export",
                icon: FileDown,
                allowedRoles: ["ADMIN", "USER"],
            },
        ],
    },
];
