import { locationService } from "@/app/services/location";
import { LocationForm } from "@/components/locations/location-form";
import { BackButton } from "@/components/users/back-button";
import { PageTitle } from "@/components/users/page-title";
import { Location } from "@/types/location";
import { redirect } from "next/navigation";

type Props = {
    params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
    const { id } = await params;

    // 1. Busca o local específico no backend através do service
    const locationRes = await locationService.getLocationById(id);

    // 2. Trava de segurança caso o ID seja inválido ou o registro não exista
    if (locationRes.error || !locationRes.data) {
        console.error(
            "Erro na busca do local para edição:",
            locationRes.error,
        );
        redirect("/infra/locations");
    }

    const location = locationRes.data as Location;

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