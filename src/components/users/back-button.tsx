"use client";

import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";

type Props = {
    fallbackUrl?: string;
};

export const BackButton = ({ fallbackUrl }: Props) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Lê a página atual da URL corporativa
    const currentPage = Number(searchParams.get("page") || "1");

    const getTargetUrl = () => {
        // Caso 1: Se o usuário estiver na página 2, 3, etc., o botão limpa a paginação e volta para a página 1
        if (currentPage > 1) {
            const params = new URLSearchParams(searchParams.toString());
            params.delete("page"); // Remove o ?page=X para resetar para a 1

            const queryString = params.toString();
            return `${pathname}${queryString ? `?${queryString}` : ""}`;
        }

        // Caso 2: Se já estiver na página 1, ele usa o fallbackUrl passado ou sobe para a pasta pai (/assets)
        if (fallbackUrl) return fallbackUrl;

        const segments = pathname.split("/").filter(Boolean);
        if (segments.length <= 1) return "/";

        return "/" + segments.slice(0, -1).join("/");
    };

    return (
        <Link href={getTargetUrl()}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeftIcon className="h-4 w-4" />
            </Button>
        </Link>
    );
};
