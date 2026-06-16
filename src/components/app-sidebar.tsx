"use client";

import {
    ChevronDown,
    ChevronRight,
    LogOut,
    User,
    Moon,
    Sun,
    Monitor,
} from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { UserSession } from "@/services/auth";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

import { SidebarLogoFull, SidebarLogoIcon } from "./sidebar-logo";
import { sidebarMenuConfig } from "@/config/sidebar-menu";

interface AppSidebarProps {
    user: UserSession;
}

export function AppSidebar({ user }: AppSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { state } = useSidebar();
    const { setTheme } = useTheme();
    const isCollapsed = state === "collapsed";

    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const updated: Record<string, boolean> = {};
        for (const group of sidebarMenuConfig) {
            updated[group.title] = group.items.some(
                (item) => item.url === pathname,
            );
        }
        setOpenGroups(updated);
    }, [pathname]);

    return (
        <Sidebar variant="sidebar" collapsible="icon">
            {/* HEADER DINÂMICO CENTRALIZADO */}
            <SidebarHeader className="border-b border-zinc-200 dark:border-zinc-800 p-4 min-h-[69px] flex items-center justify-center transition-all duration-200">
                {isCollapsed ? (
                    <SidebarLogoIcon width={24} height={24} />
                ) : (
                    <SidebarLogoFull width={28} height={28} />
                )}
            </SidebarHeader>

            {/* CONTEÚDO COM EFEITOS E BALÕES DE TEXTO (TOOLTIPS) */}
            <SidebarContent className="p-2 gap-2 overflow-x-hidden">
                {sidebarMenuConfig.map((group) => {
                    const allowedItems = group.items.filter(
                        (item) => !item.adminOnly || user.role === "ADMIN",
                    );

                    if (allowedItems.length === 0) return null;

                    // 🌟 CORREÇÃO: O grupo pai fica ativo se a rota atual for a rota dele
                    // OU se o usuário estiver dentro de qualquer um dos seus subitens (filhos).
                    const isGroupActive =
                        pathname === group.url ||
                        group.items.some(
                            (item) =>
                                pathname === item.url ||
                                pathname.startsWith(item.url + "/"),
                        );
                    const isOpen = openGroups[group.title] ?? false;

                    // Conteúdo do botão/link do cabeçalho
                    const headerLinkContent = (
                        <Link
                            href={group.url || "#"}
                            className={`flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider outline-none transition-colors ${
                                isCollapsed
                                    ? "justify-center p-2 cursor-pointer w-full text-zinc-500 hover:text-zinc-900"
                                    : `px-3 py-2 cursor-pointer flex-1 ${
                                          isGroupActive
                                              ? "text-zinc-900 dark:text-zinc-50 font-extrabold"
                                              : "text-zinc-400 hover:text-zinc-800 dark:text-zinc-500 dark:hover:text-zinc-200"
                                      }`
                            }`}
                        >
                            <group.icon
                                size={15}
                                className={`shrink-0 transition-transform duration-200 hover:scale-110 ${
                                    isGroupActive
                                        ? "text-blue-600 dark:text-blue-500"
                                        : "text-zinc-400"
                                }`}
                            />
                            {!isCollapsed && (
                                <span className="font-sans antialiased">
                                    {group.title}
                                </span>
                            )}
                        </Link>
                    );

                    return (
                        <Collapsible
                            key={group.title}
                            open={isCollapsed ? false : isOpen}
                            onOpenChange={(open) => {
                                if (!isCollapsed) {
                                    setOpenGroups((prev) => ({
                                        ...prev,
                                        [group.title]: open,
                                    }));
                                }
                            }}
                            className="w-full space-y-1"
                        >
                            <div
                                className={`w-full flex items-center rounded-md transition-colors ${
                                    isCollapsed
                                        ? "justify-center py-1"
                                        : `justify-between ${
                                              isGroupActive
                                                  ? "bg-zinc-100/70 dark:bg-zinc-800/40"
                                                  : "hover:bg-zinc-100/50 dark:hover:bg-zinc-800/30"
                                          }`
                                }`}
                            >
                                {/* SE ESTIVER RETRAÍDO: Adiciona o Tooltip */}
                                {isCollapsed ? (
                                    <Tooltip delayDuration={0}>
                                        <TooltipTrigger asChild>
                                            {headerLinkContent}
                                        </TooltipTrigger>
                                        <TooltipContent
                                            side="right"
                                            className="font-semibold text-xs uppercase font-sans"
                                        >
                                            {group.title}
                                        </TooltipContent>
                                    </Tooltip>
                                ) : (
                                    headerLinkContent
                                )}

                                {/* SETA DE CONTROLE */}
                                {!isCollapsed && (
                                    <CollapsibleTrigger asChild>
                                        <button className="p-2 mr-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-md hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50 transition-colors cursor-pointer outline-none">
                                            {isOpen ? (
                                                <ChevronDown size={14} />
                                            ) : (
                                                <ChevronRight size={14} />
                                            )}
                                        </button>
                                    </CollapsibleTrigger>
                                )}
                            </div>

                            {!isCollapsed && (
                                <CollapsibleContent className="space-y-1 pl-2">
                                    <SidebarGroup className="p-0">
                                        <SidebarGroupContent>
                                            <SidebarMenu>
                                                {allowedItems.map((item) => {
                                                    // 🌟 CORREÇÃO DEFINITIVA: Verificação exata evita menus duplicados acesos
                                                    const isActive =
                                                        pathname === item.url;
                                                    return (
                                                        <SidebarMenuItem
                                                            key={item.title}
                                                        >
                                                            <SidebarMenuButton
                                                                asChild
                                                                tooltip={
                                                                    item.title
                                                                }
                                                            >
                                                                <Link
                                                                    href={
                                                                        item.url
                                                                    }
                                                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 font-sans antialiased ${
                                                                        isActive
                                                                            ? "bg-blue-600 text-white shadow-md shadow-blue-600/10 hover:bg-blue-700 font-semibold"
                                                                            : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                                                                    }`}
                                                                >
                                                                    <item.icon
                                                                        size={
                                                                            18
                                                                        }
                                                                        className={`shrink-0 transition-transform duration-200 hover:scale-110 ${isActive ? "text-white" : "text-zinc-400"}`}
                                                                    />
                                                                    <span>
                                                                        {
                                                                            item.title
                                                                        }
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
                            )}
                        </Collapsible>
                    );
                })}
            </SidebarContent>

            {/* FOOTER DO USUÁRIO */}
            <SidebarFooter className="border-t border-zinc-200 dark:border-zinc-800 p-4 flex items-center justify-center transition-all duration-200">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            className={`flex w-full items-center rounded-lg transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 outline-none ${
                                isCollapsed
                                    ? "justify-center p-0 h-9 w-9"
                                    : "p-1.5 gap-3 text-left"
                            }`}
                        >
                            <Avatar className="h-8 w-8 shrink-0 border border-primary/20 transition-transform duration-200 hover:scale-105">
                                {user.image && (
                                    <AvatarImage
                                        src={user.image}
                                        alt={user.name || "Avatar"}
                                        className="object-cover"
                                    />
                                )}
                                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs uppercase font-sans">
                                    {user.name ? (
                                        user.name.substring(0, 2)
                                    ) : (
                                        <User size={14} />
                                    )}
                                </AvatarFallback>
                            </Avatar>

                            {!isCollapsed && (
                                <>
                                    <div className="flex flex-col flex-1 overflow-hidden whitespace-nowrap font-sans">
                                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                                            {user.name || "Operador"}
                                        </span>
                                        <span className="text-xs text-muted-foreground truncate">
                                            {user.email}
                                        </span>
                                    </div>
                                    <ChevronDown
                                        size={16}
                                        className="text-zinc-400 shrink-0"
                                    />
                                </>
                            )}
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        align={isCollapsed ? "left" : "end"}
                        className="w-56 mb-2 font-sans"
                    >
                        <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-xs font-mono text-zinc-400">
                            Nível:{" "}
                            <span className="font-bold text-blue-600 dark:text-blue-500 ml-1">
                                {user.role}
                            </span>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        {/* 🌟 SELETOR DE TEMA NO DROPDOWN */}
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger className="cursor-pointer flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-zinc-500" />
                                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-zinc-400" />
                                <span>Alternar Tema</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent className="w-36 font-sans">
                                <DropdownMenuItem
                                    onClick={() => setTheme("light")}
                                    className="cursor-pointer flex items-center gap-2 text-zinc-600 dark:text-zinc-400"
                                >
                                    <Sun size={14} /> <span>Claro</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setTheme("dark")}
                                    className="cursor-pointer flex items-center gap-2 text-zinc-600 dark:text-zinc-400"
                                >
                                    <Moon size={14} /> <span>Escuro</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setTheme("system")}
                                    className="cursor-pointer flex items-center gap-2 text-zinc-600 dark:text-zinc-400"
                                >
                                    <Monitor size={14} /> <span>Sistema</span>
                                </DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuSub>

                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={async () => {
                                await authClient.signOut({
                                    fetchOptions: {
                                        onSuccess: () => {
                                            router.push("/login");
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
