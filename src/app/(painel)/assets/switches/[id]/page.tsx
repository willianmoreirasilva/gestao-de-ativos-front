import { ShieldAlert } from "lucide-react";

import { AssetTechnicalCard } from "@/components/assets/shared/asset-technical-card";
import { BackButton } from "@/components/users/back-button";
import { PageTitle } from "@/components/users/page-title";
import { departmentService } from "@/services/department";
import { locationService } from "@/services/location";
import { switchService } from "@/services/switches";
import type { AssetItem } from "@/types/assets";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function SwitchDetailsPage({ params }: Props) {
    const { id } = await params;

    const [switchResult, departmentsRes, locationsRes, switchesRes] =
        await Promise.all([
            switchService.getSwitchById(id),
            departmentService.getDepartments(),
            locationService.getLocations(),
            switchService.getSwitches({ page: 1, limit: 100 }),
        ]);

    const switchData = switchResult?.data;
    const error = switchResult?.error;

    if (error || !switchData) {
        return (
            <div className="space-y-6">
                <PageTitle title="Ficha Técnica" leftSide={<BackButton />} />
                <div className="p-6 text-center text-destructive font-medium border border-destructive/20 bg-destructive/5 rounded-xl flex items-center justify-center gap-2">
                    <ShieldAlert size={18} />{" "}
                    {error || "Switch não encontrado."}
                </div>
            </div>
        );
    }

    // Cast seguro para ler propriedades dinâmicas do backend sem erro do TS
    const rawAsset = switchData.asset as any;

    // Normaliza a resposta do backend montando o objeto compatível com AssetTechnicalCard
    const assetFormatted: AssetItem = {
        id: rawAsset.id,
        patrimony: rawAsset.patrimony,
        type: "SWITCH",
        createdAt: String(rawAsset.createdAt),
        updatedAt: String(rawAsset.updatedAt),
        departmentId: rawAsset.departmentId,
        locationId: rawAsset.locationId,
        ipId: rawAsset.ipId,

        // Propriedades de porta e switch pai tratadas com fallback
        connectedToSwitchId: rawAsset.connectedToSwitchId || null,
        switchPort: rawAsset.switchPort ? Number(rawAsset.switchPort) : null,

        // Como é uma página exclusiva de SWITCH, a VLAN é SWITCH_MGMT
        vlanType:
            rawAsset.vlanType || rawAsset.ip?.network?.type || "SWITCH_MGMT",
        vlanTag: rawAsset.vlanTag ?? rawAsset.ip?.network?.vlanTag ?? null,

        department: rawAsset.department || null,
        location: rawAsset.location || null,
        ip: rawAsset.ip || null,
        switch: {
            id: switchData.id,
            hostname: switchData.hostname,
            model: switchData.model,
            vendor: switchData.vendor,
            totalPorts: switchData.totalPorts,
            mac: switchData.mac,
            notes: switchData.notes,
        },
    };

    const options = {
        departments: departmentsRes?.data || [],
        locations: locationsRes?.data || [],
        switches: (switchesRes.data || []).map((sw) => ({
            id: sw.id,
            name: `${sw.hostname || sw.model} (${sw.vendor || "Genérico"})`.trim(),
        })),
    };

    const switchName =
        switchData.hostname || rawAsset.patrimony || "Switch Sem Nome";

    return (
        <div className="space-y-6 max-w-6xl mx-auto p-4 pb-12">
            <PageTitle
                title={`Ficha: ${switchName}`}
                leftSide={<BackButton />}
            />

            <AssetTechnicalCard
                mode="view"
                asset={assetFormatted}
                options={options}
            />
        </div>
    );
}
