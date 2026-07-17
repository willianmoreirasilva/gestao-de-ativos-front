import { ShieldAlert } from "lucide-react";

import {
    getDisksAction,
    getOperatingSystemsAction,
    getProcessorsAction,
} from "@/actions/options";
import { ComputerHardwareCard } from "@/components/assets/computers/computer-hardware-card";
import { AssetAllocationCard } from "@/components/assets/shared/asset-allocation-card";
import { AssetConnectivityCard } from "@/components/assets/shared/asset-connectivity-card";
import { BackButton } from "@/components/users/back-button";
import { PageTitle } from "@/components/users/page-title";
import { getAssetById } from "@/services/assets";
import { departmentService } from "@/services/department";
import { locationService } from "@/services/location";
import { switchService } from "@/services/switches"; // Importando o novo serviço de switches

interface Props {
    params: Promise<{ id: string }>;
}

export default async function ComputerDetailsPage({ params }: Props) {
    const { id } = await params;

    // Buscando em paralelo as informações necessárias
    const [
        assetResult,
        departmentsRes,
        locationsRes,
        processorsRes,
        osRes,
        disksRes,
        switchesRes,
    ] = await Promise.all([
        getAssetById(id),
        departmentService.getDepartments(),
        locationService.getLocations(),
        getProcessorsAction(),
        getOperatingSystemsAction(),
        getDisksAction(),
        switchService.getSwitches({ page: 1, limit: 100 }),
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

    const options = {
        departments: departmentsRes?.data || [],
        locations: locationsRes?.data || [],
        processors: processorsRes?.data || [],
        operatingSystems: osRes?.data || [],
        disks: disksRes?.data || [],
        // Mapeia os switches adicionando o hostname de forma clara no Select
        switches: (switchesRes.data || []).map((sw) => ({
            id: sw.id,
            name: `${sw.hostname || sw.model} (${sw.vendor || "Genérico"})`.trim(),
        })),
    };

    const computerName = asset.computer?.hostname || "Sem Hostname";

    return (
        <div className="space-y-6 max-w-6xl mx-auto p-4 pb-12">
            <PageTitle
                title={`Ficha: ${computerName}`}
                leftSide={<BackButton />}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* 1. Hardware */}
                <ComputerHardwareCard
                    assetId={asset.id}
                    computer={asset.computer}
                    options={options}
                />

                {/* 2. Conectividade IP, Switch de Conexão e Porta Física com Hostname e VLAN Tag */}
                <AssetConnectivityCard
                    assetId={asset.id}
                    ip={asset.ip}
                    vlanType={asset.vlanType}
                    vlanTag={asset.vlanTag} // 🌟 Passando a VLAN Tag recebida do back
                    connectedToSwitch={asset.connectedToSwitch} // 🌟 Passando o objeto switch completo
                    switchPort={asset.switchPort?.toString()}
                    switches={options.switches}
                />

                {/* 3. Alocação */}
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
