"use client";

import {
    Home,
    PanelsTopLeft,
    UserPlus,
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
    ChevronDown,
    ChevronRight,
    LogOut,
    User,
} from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { logoutAction } from "../actions/auth";
import { UserSession } from "@/services/auth";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Image from "next/image";

type MenuItem = {
    title: string;
    url: string;
    icon: React.ElementType;
    adminOnly?: boolean;
};

type GroupMenu = {
    title: string;
    items: MenuItem[];
};

// Menu inteligente mapeando todo o seu ecossistema Prisma
const menu: GroupMenu[] = [
    {
        title: "Dashboard",
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
        items: [
            {
                title: "Subredes (CIDR)",
                url: "/networks",
                icon: Network,
                adminOnly: true,
            },
            { title: "Departamentos", url: "/departments", icon: Pentagon },
            {
                title: "Localizações / Prédios",
                url: "/locations",
                icon: MapPin,
            },
        ],
    },
    {
        title: "Ativos de TI",
        items: [
            { title: "Computadores", url: "/computers", icon: Computer },
            { title: "Impressoras", url: "/printers", icon: Printer },
            { title: "Telefonia VoIP", url: "/phones", icon: Phone },
            { title: "Câmeras CFTV", url: "/cameras", icon: Cctv },
            { title: "Switches & APs", url: "/network-devices", icon: Radio },
        ],
    },
    {
        title: "Consulta Rápida",
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

interface AppSidebarProps {
    user: UserSession;
}

export function AppSidebar({ user }: AppSidebarProps) {
    const pathname = usePathname();
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

    const router = useRouter();

    // Abre automaticamente o grupo que contém a rota ativa ao carregar a página
    useEffect(() => {
        const updated: Record<string, boolean> = {};
        for (const group of menu) {
            updated[group.title] = group.items.some(
                (item) => item.url === pathname,
            );
        }
        setOpenGroups(updated);
    }, [pathname]);

    return (
        <Sidebar variant="sidebar" collapsible="icon">
            {/* HEADER: Sua identidade visual baseada na logo de image_4a9406.png */}
            <SidebarHeader className="border-b border-zinc-200 dark:border-zinc-800 p-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg  shadow-sm">
                        <Image
                            src="logodi.svg"
                            alt="DI"
                            width={28}
                            height={28}
                        />
                    </div>
                    <div className="flex flex-col data-[sidebar=collapsed]:hidden">
                        <span className="font-bold text-sm leading-none text-zinc-900 dark:text-zinc-100">
                            NetManager
                        </span>
                        <span className="text-xs text-muted-foreground mt-1">
                            Gestão de Ativos
                        </span>
                    </div>
                </div>
            </SidebarHeader>

            {/* CONTEÚDO: Menus expansíveis com verificação de Role */}
            <SidebarContent className="p-2 gap-2">
                {menu.map((group) => {
                    // Filtra os itens baseado na role do usuário (ADMIN / USER)
                    const allowedItems = group.items.filter(
                        (item) => !item.adminOnly || user.role === "ADMIN",
                    );

                    if (allowedItems.length === 0) return null;

                    const isOpen = openGroups[group.title] ?? false;

                    return (
                        <Collapsible
                            key={group.title}
                            open={isOpen}
                            onOpenChange={(open) =>
                                setOpenGroups((prev) => ({
                                    ...prev,
                                    [group.title]: open,
                                }))
                            }
                            className="w-full space-y-1"
                        >
                            <CollapsibleTrigger asChild>
                                <button className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 uppercase tracking-wider transition-colors">
                                    <span>{group.title}</span>
                                    {isOpen ? (
                                        <ChevronDown size={14} />
                                    ) : (
                                        <ChevronRight size={14} />
                                    )}
                                </button>
                            </CollapsibleTrigger>

                            <CollapsibleContent className="space-y-1 pl-2">
                                <SidebarGroup className="p-0">
                                    <SidebarGroupContent>
                                        <SidebarMenu>
                                            {allowedItems.map((item) => {
                                                const isActive =
                                                    pathname === item.url;

                                                return (
                                                    <SidebarMenuItem
                                                        key={item.title}
                                                    >
                                                        <SidebarMenuButton
                                                            asChild
                                                            tooltip={item.title}
                                                        >
                                                            <Link
                                                                href={item.url}
                                                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                                                    isActive
                                                                        ? "bg-primary text-white shadow-sm" // Aplica o azul escuro da logo no item ativo!
                                                                        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                                                                }`}
                                                            >
                                                                <item.icon
                                                                    size={18}
                                                                    className={
                                                                        isActive
                                                                            ? "text-white"
                                                                            : "text-zinc-400 group-hover:text-zinc-600"
                                                                    }
                                                                />
                                                                <span>
                                                                    {item.title}
                                                                </span>
                                                            </Link>
                                                        </SidebarMenuButton>
                                                    </SidebarMenuItem>
                                                );
                                            })}
                                        </SidebarMenu>
                                    </SidebarGroupContent>
                                </SidebarGroup>
                            </CollapsibleContent>
                        </Collapsible>
                    );
                })}
            </SidebarContent>

            {/* FOOTER: Perfil do usuário e Gatilho para Logout */}
            <SidebarFooter className="border-t border-zinc-200 dark:border-zinc-800 p-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex w-full items-center gap-3 rounded-lg p-1.5 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                            <Avatar className="h-8 w-8 border border-primary/20">
                                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs uppercase">
                                    {user.name ? (
                                        user.name.substring(0, 2)
                                    ) : (
                                        <User size={14} />
                                    )}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col flex-1 overflow-hidden">
                                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                                    {user.name || "Operador"}
                                </span>
                                <span className="text-xs text-muted-foreground truncate">
                                    {user.email}
                                </span>
                            </div>
                            <ChevronDown size={16} className="text-zinc-400" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 mb-2">
                        <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-xs font-mono text-zinc-400">
                            Nível:{" "}
                            <span className="font-bold text-primary ml-1">
                                {user.role}
                            </span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {/* O logout dispara de forma limpa a Server Action que remove o cookie */}
                        <DropdownMenuItem
                            onClick={async () => {
                                await authClient.signOut({
                                    fetchOptions: {
                                        onSuccess: () => {
                                            router.push("/login"); // Manda pro login após deslogar com sucesso
                                        },
                                    },
                                });
                            }}
                            className="text-red-600 dark:text-red-400 cursor-pointer flex items-center gap-2 font-medium"
                        >
                            <LogOut size={16} />
                            Sair do Sistema
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
