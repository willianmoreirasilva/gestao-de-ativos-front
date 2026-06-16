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
    adminOnly?: boolean;
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
        url: "/networks",
        icon: Layers,
        items: [
            {
                title: "Subredes (CIDR)",
                url: "/networks/cidr",
                icon: Network,
                adminOnly: true,
            },
            {
                title: "Departamentos",
                url: "/networks/departments",
                icon: Pentagon,
            },
            {
                title: "Localizações / Prédios",
                url: "/networks/locations",
                icon: MapPin,
            },
        ],
    },
    {
        title: "Ativos de TI",
        url: "/assets",
        icon: Cpu,
        items: [
            { title: "Computadores", url: "/assets/computers", icon: Computer },
            { title: "Impressoras", url: "/assets/printers", icon: Printer },
            { title: "Telefonia VoIP", url: "/assets/phones", icon: Phone },
            { title: "Câmeras CFTV", url: "/assets/cameras", icon: Cctv },
            {
                title: "Switches & APs",
                url: "/assets/network-devices",
                icon: Radio,
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
            },
            {
                title: "Buscar por MAC Address",
                url: "/search/mac",
                icon: Workflow,
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
            },
            {
                title: "IPs por Setor",
                url: "/reports/departments",
                icon: BookMinus,
            },
            {
                title: "Exportar Dados",
                url: "/reports/export",
                icon: FileDown,
                adminOnly: true,
            },
        ],
    },
];
