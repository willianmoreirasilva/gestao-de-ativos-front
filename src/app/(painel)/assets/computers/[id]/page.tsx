import { ShieldAlert } from "lucide-react";

import {
    getDisksAction,
    getOperatingSystemsAction,
    getProcessorsAction,
} from "@/actions/options";
import { ComputerActions } from "@/components/assets/computers/computer-actions";
import { ComputerHardwareCard } from "@/components/assets/computers/computer-hardware-card"; // 🌟 Ganhando superpoderes de edição
import { AssetAllocationCard } from "@/components/assets/shared/asset-allocation-card"; // 🌟 Mantido e envelopado para edição
import { AssetConnectivityCard } from "@/components/assets/shared/asset-connectivity-card";
import { BackButton } from "@/components/users/back-button";
import { PageTitle } from "@/components/users/page-title";
import { getAssetById } from "@/services/assets";
import { departmentService } from "@/services/department";
import { locationService } from "@/services/location";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function ComputerDetailsPage({ params }: Props) {
    const { id } = await params;

    // 🚀 Busca paralela unificada no Servidor (Zero Delay)
    const [
        assetResult,
        departmentsRes,
        locationsRes,
        processorsRes,
        osRes,
        disksRes,
    ] = await Promise.all([
        getAssetById(id),
        departmentService.getDepartments(),
        locationService.getLocations(),
        getProcessorsAction(),
        getOperatingSystemsAction(),
        getDisksAction(),
    ]);

    const asset = assetResult?.data;
    const error = assetResult?.error;

    if (error || !asset) {
        return (
            <div className="space-y-6">
                <PageTitle title="Ficha Técnica" leftSide={<BackButton />} />
                <div className="p-6 text-center text-destructive font-medium border border-destructive/20 bg-destructive/5 rounded-xl flex items-center justify-center gap-2">
                    <ShieldAlert size={18} /> {error || "Ativo não encontrado."}
                </div>
            </div>
        );
    }

    // Extração limpa das opções para os comboboxes
    const options = {
        departments: departmentsRes?.data || [],
        locations: locationsRes?.data || [],
        processors: processorsRes?.data || [],
        operatingSystems: osRes?.data || [],
        disks: disksRes?.data || [],
    };

    const computerName = asset.computer?.hostname || "Sem Hostname";

    return (
        <div className="space-y-6 max-w-6xl mx-auto p-4 pb-12">
            <PageTitle
                title={`Ficha: ${computerName}`}
                leftSide={<BackButton />}
                rightSide={
                    <ComputerActions
                        assetId={asset.id}
                        identifier={
                            asset.computer?.hostname ||
                            asset.patrimony ||
                            "Este computador"
                        }
                    />
                }
            />

            {/* Grid 3 Colunas Padrão Dashboard SaaS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* 1. Hardware Especifico com Edição In-Place */}
                <ComputerHardwareCard
                    assetId={asset.id}
                    computer={asset.computer}
                    options={options}
                />

                {/* 2. Conectividade IP (Seu componente intocado) */}
                <AssetConnectivityCard
                    assetId={asset.id}
                    patrimony={asset.patrimony}
                    ip={asset.ip}
                    vlanType={asset.vlanType || "GENERAL_DATA"}
                />

                {/* 3. Alocação Física e Lógica Adaptada */}
                <AssetAllocationCard
                    assetId={asset.id}
                    patrimony={asset.patrimony}
                    username={asset.computer?.username}
                    department={asset.department}
                    location={asset.location}
                    options={options}
                />
            </div>
        </div>
    );
}
