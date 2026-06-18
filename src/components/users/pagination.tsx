"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

type Props = {
    disablePrev: boolean;
    disableNext: boolean;
};

export const Pagination = ({ disablePrev, disableNext }: Props) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const page = parseInt(searchParams.get("page") || "1");

    // Se o botão anterior E o próximo estiverem desabilitados,
    // significa que todos os dados já estão na tela, então o componente não renderiza nada (null)
    if (disablePrev && disableNext) {
        return null;
    }

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", newPage.toString());
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="flex justify-end gap-2 mt-4">
            <Button
                variant="outline"
                disabled={disablePrev}
                onClick={() => handlePageChange(page - 1)}
            >
                Anterior
            </Button>
            <Button
                variant="outline"
                disabled={disableNext}
                onClick={() => handlePageChange(page + 1)}
            >
                Próximo
            </Button>
        </div>
    );
};
