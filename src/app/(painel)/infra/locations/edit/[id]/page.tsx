import type { Metadata } from "next";

import { LocationForm } from "@/components/infra/locations/location-form";
import { BackButton } from "@/components/users/back-button";
import { PageTitle } from "@/components/users/page-title";
import { loadOrNotFound } from "@/lib/load-or-not-found";
import { locationService } from "@/services/location";

export const metadata: Metadata = { title: "Editar localização" };

type Props = {
    params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
    const { id } = await params;

    // 1. Busca o local específico no backend através do service
    const locationRes = await locationService.getLocationById(id);

    // 2. 404/400: página "não encontrado". Outro erro: cai no error.tsx do painel
    const location = loadOrNotFound(locationRes, "o local");

    return (
        /* 🌟 CONTAINER DE RESGATE: Mantém o formulário perfeitamente centralizado
           e proporcional no meio da tela em monitores maiores */
        <div className="w-full max-w-2xl mx-auto px-4 py-6 space-y-6">
            <PageTitle
                title="Editar Local"
                leftSide={<BackButton fallbackUrl="/infra/locations" />}
            />

            {/* Injeta os dados do local para pré-preencher o grid do formulário */}
            <LocationForm location={location} />
        </div>
    );
}
