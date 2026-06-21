import { networkService } from "@/services/network";
import { NetworkForm } from "@/components/networks/network-form";
import { BackButton } from "@/components/users/back-button";
import { PageTitle } from "@/components/users/page-title";
import { redirect } from "next/navigation";

type Props = {
    params: Promise<{ id: string }>;
};

export default async function EditNetworkPage({ params }: Props) {
    const { id } = await params;

    // Busca os dados da rede no servidor backend
    const networkRes = await networkService.getNetworkById(id);

    // Se a rede não existir ou houver falha, redireciona para a listagem com segurança
    if (networkRes.error || !networkRes.data) {
        console.error("Erro ao buscar dados da rede para edição:", networkRes.error);
        redirect("/infra/networks");
    }

    const network = networkRes.data;

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