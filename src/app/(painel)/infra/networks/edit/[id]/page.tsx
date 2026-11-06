import type { Metadata } from "next";

import { NetworkForm } from "@/components/infra/networks/network-form";
import { BackButton } from "@/components/users/back-button";
import { PageTitle } from "@/components/users/page-title";
import { loadOrNotFound } from "@/lib/load-or-not-found";
import { networkService } from "@/services/network";

export const metadata: Metadata = { title: "Editar rede" };

type Props = {
    params: Promise<{ id: string }>;
};

export default async function EditNetworkPage({ params }: Props) {
    const { id } = await params;

    // Busca os dados da rede no servidor backend
    const networkRes = await networkService.getNetworkById(id);

    // 404/400: página "não encontrado". Outro erro: cai no error.tsx do painel
    const network = loadOrNotFound(networkRes, "a rede");

    return (
        <div className="w-full max-w-2xl mx-auto px-4 py-6 space-y-6">
            <PageTitle
                title="Editar Configurações de Rede"
                leftSide={<BackButton fallbackUrl="/infra/networks" />}
            />

            {/* Injeta os dados recuperados imutáveis parciais no formulário */}
            <NetworkForm network={network} />
        </div>
    );
}
