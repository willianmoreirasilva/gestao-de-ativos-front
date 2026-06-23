"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";

type Props = {
    disablePrev: boolean;
    disableNext: boolean;
};

export const Pagination = ({ disablePrev, disableNext }: Props) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentPage = parseInt(searchParams.get("page") || "1");

    if (disablePrev && disableNext && currentPage === 1) {
        return null;
    }

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", newPage.toString());
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="flex items-center justify-end gap-4 mt-4 bg-transparent py-2">
            {/* Indicador de página elegante */}
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Página {currentPage}
            </span>

            <div className="flex items-center gap-1.5">
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1 pl-2"
                    disabled={disablePrev}
                    onClick={() => handlePageChange(currentPage - 1)}
                >
                    <ChevronLeft size={16} />
                    Anterior
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1 pr-2"
                    disabled={disableNext}
                    onClick={() => handlePageChange(currentPage + 1)}
                >
                    Próximo
                    <ChevronRight size={16} />
                </Button>
            </div>
        </div>
    );
};
