"use client";

import Link from "next/link";
import Image from "next/image";

interface LogoProps {
    width?: number;
    height?: number;
}

// 🌟 Versão estendida (Logo + Nome do Sistema)
export function SidebarLogoFull({ width = 28, height = 28 }: LogoProps) {
    return (
        <Link
            href="/dashboard"
            className="flex items-center gap-3 overflow-hidden whitespace-nowrap outline-none group w-full"
        >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-105">
                <Image
                    src="/logodi.svg"
                    alt="DI"
                    width={width}
                    height={height}
                    priority
                />
            </div>
            <div className="flex flex-col">
                <span className="font-bold text-sm leading-none text-zinc-900 dark:text-zinc-100 group-hover:text-primary transition-colors">
                    NetManager
                </span>
                <span className="text-xs text-muted-foreground mt-1">
                    Gestão de Ativos
                </span>
            </div>
        </Link>
    );
}

// 🌟 Versão compacta: Garante a centralização perfeita e efeito hover
export function SidebarLogoIcon({ width = 24, height = 24 }: LogoProps) {
    return (
        <div className="flex w-full items-center justify-center">
            <Link
                href="/dashboard"
                className="flex h-9 w-9 items-center justify-center rounded-lg outline-none transition-transform duration-200 hover:scale-110"
            >
                <Image
                    src="/logodi.svg"
                    alt="DI"
                    width={width}
                    height={height}
                    priority
                />
            </Link>
        </div>
    );
}
