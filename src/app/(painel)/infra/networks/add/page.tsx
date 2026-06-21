import { NetworkForm } from "@/components/networks/network-form";
import { BackButton } from "@/components/users/back-button";
import { PageTitle } from "@/components/users/page-title";

export default function AddNetworkPage() {
    return (
        // max-w-2xl centraliza e mantém a simetria com as telas de adição de locais e departamentos
        <div className="w-full max-w-2xl mx-auto px-4 py-6 space-y-6">
            <PageTitle
                title="Cadastrar Nova Rede"
                leftSide={<BackButton fallbackUrl="/infra/networks" />}
            />

            {/* Renderiza o formulário limpo (sem a prop 'network'), ativando o modo de criação */}
            <NetworkForm />
        </div>
    );
}