import { ShieldAlert } from "lucide-react";

import { ComputerActions } from "@/components/assets/computers/computer-actions";
import { ComputerHardwareCard } from "@/components/assets/computers/computer-hardware-card";
import { AssetAllocationCard } from "@/components/assets/shared/asset-allocation-card";
import { AssetConnectivityCard } from "@/components/assets/shared/asset-connectivity-card";
import { BackButton } from "@/components/users/back-button";
import { PageTitle } from "@/components/users/page-title";
import { getAssetById } from "@/services/assets";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function ComputerDetailsPage({ params }: Props) {
    const { id } = await params;
    const { data: asset, error } = await getAssetById(id);

    // Guard Clause para tratamento de erros
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

    const computerName = asset.computer?.hostname || "Sem Hostname";

    return (
        <div className="space-y-6 max-w-5xl mx-auto p-2">
            <PageTitle
                title={`Ficha: ${computerName}`}
                leftSide={<BackButton />}
                rightSide={
                    <ComputerActions
                        assetId={asset.id}
                        identifier={asset.computer?.hostname || asset.patrimony || "Este computador"}
                    />
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Componente 1: Hardware específico */}
                <ComputerHardwareCard computer={asset.computer} />

                {/* Componente 2: Rede estruturada */}
                <AssetConnectivityCard 
                    assetId={asset.id} 
                    patrimony={asset.patrimony} 
                    ip={asset.ip} 
                    vlanType="GENERAL_DATA" 
                />

                {/* Componente 3: Alocação física e lógica */}
                <AssetAllocationCard 
                    username={asset.computer?.username} 
                    department={asset.department} 
                    location={asset.location} 
                />
            </div>
        </div>
    );
}