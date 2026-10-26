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
    ShieldCheck,
    Users,
    Wifi,
    Zap,
} from "lucide-react";

import type { Action, Resource } from "@/lib/permissions";

export type MenuItem = {
    title: string;
    url?: string;
    icon: React.ElementType;
    // Permissão da matriz (lib/permissions.ts) exigida para exibir o item
    permission?: { resource: Resource; action: Action };
    isQuickSearch?: boolean; // Dispara a Command Palette (modal)
    shortcut?: string;
};

export type GroupMenu = {
    title: string;
    url?: string;
    // Sem esta permissão, o cabeçalho do grupo aponta para o primeiro item permitido
    urlPermission?: { resource: Resource; action: Action };
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
                permission: { resource: "networks", action: "view" },
            },
            {
                title: "Departamentos",
                url: "/infra/departments",
                icon: Pentagon,
                permission: { resource: "departments", action: "view" },
            },
            {
                title: "Localizações / Prédios",
                url: "/infra/locations",
                icon: MapPin,
                permission: { resource: "locations", action: "view" },
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
                permission: { resource: "assets", action: "view" },
            },
            {
                title: "Impressoras",
                url: "/assets/printers",
                icon: Printer,
                permission: { resource: "assets", action: "view" },
            },
            {
                title: "Telefonia VoIP",
                url: "/assets/phones",
                icon: Phone,
                permission: { resource: "assets", action: "view" },
            },
            {
                title: "Câmeras CFTV",
                url: "/assets/cameras",
                icon: Cctv,
                permission: { resource: "cameras", action: "view" },
            },
            {
                title: "Switches",
                url: "/assets/switches",
                icon: Radio,
                permission: { resource: "assets", action: "view" },
            },
            {
                title: "Access Points",
                url: "/assets/access-points",
                icon: Wifi,
                permission: { resource: "assets", action: "view" },
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
        url: "/reports-audit",
        urlPermission: { resource: "auditLogs", action: "view" },
        icon: FileText,
        items: [
            {
                title: "Construtor de Relatórios",
                url: "/reports-audit/reports",
                icon: LayoutGrid, // ou SlidersHorizontal
                permission: { resource: "cameraReports", action: "view" },
            },

            {
                title: "Logs de Operações",
                url: "/reports-audit/audit-logs",
                icon: History,
                permission: { resource: "auditLogs", action: "view" },
            },
        ],
    },
    {
        title: "Administração",
        url: "/users",
        urlPermission: { resource: "users", action: "view" },
        icon: ShieldCheck,
        items: [
            {
                title: "Usuários do Sistema",
                url: "/users",
                icon: Users,
                permission: { resource: "users", action: "view" },
            },
        ],
    },
];
