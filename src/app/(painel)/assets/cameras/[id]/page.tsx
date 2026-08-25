import { ShieldAlert } from "lucide-react";

import { AssetTechnicalCard } from "@/components/assets/shared/asset-technical-card";
import { BackButton } from "@/components/users/back-button";
import { PageTitle } from "@/components/users/page-title";
import { getAssetById } from "@/services/assets";
import { departmentService } from "@/services/department";
import { locationService } from "@/services/location";
import { switchService } from "@/services/switches";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function CameraDetailsPage({ params }: Props) {
    const { id } = await params;

    const [assetResult, departmentsRes, locationsRes, switchesRes] =
        await Promise.all([
            getAssetById(id),
            departmentService.getDepartments(),
            locationService.getLocations(),
            switchService.getSwitches({ page: 1, limit: 100 }),
        ]);

    const asset = assetResult?.data;
    const error = assetResult?.error;

    if (error || !asset) {
        return (
            <div className="space-y-6">
                <PageTitle title="Ficha Técnica" leftSide={<BackButton />} />
                <div className="p-6 text-center text-destructive font-medium border border-destructive/20 bg-destructive/5 rounded-xl flex items-center justify-center gap-2">
                    <ShieldAlert size={18} />{" "}
                    {error || "Câmera não encontrada."}
                </div>
            </div>
        );
    }

    const options = {
        departments: departmentsRes?.data || [],
        locations: locationsRes?.data || [],
        switches: (switchesRes.data || []).map((sw) => ({
            id: sw.id,
            name: `${sw.hostname || sw.model} (${sw.vendor || "Genérico"})`.trim(),
        })),
    };

    const cameraName =
        asset.camera?.hostname || asset.patrimony || "Câmera Sem Nome";

    return (
        <div className="space-y-6 max-w-6xl mx-auto p-4 pb-12">
            <PageTitle
                title={`Ficha: ${cameraName}`}
                leftSide={<BackButton />}
            />

            <AssetTechnicalCard mode="view" asset={asset} options={options} />
        </div>
    );
}
