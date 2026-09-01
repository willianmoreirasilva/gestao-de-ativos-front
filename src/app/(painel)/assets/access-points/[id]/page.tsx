import { ShieldAlert } from "lucide-react";

import { AssetTechnicalCard } from "@/components/assets/shared/asset-technical-card";
import { BackButton } from "@/components/users/back-button";
import { PageTitle } from "@/components/users/page-title";
import { getApVlanType } from "@/lib/utils";
import { accessPointService } from "@/services/access-points";
import { departmentService } from "@/services/department";
import { locationService } from "@/services/location";
import { switchService } from "@/services/switches";
import type { AssetItem } from "@/types/assets";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function AccessPointDetailsPage({ params }: Props) {
    const { id } = await params;

    const [apResult, departmentsRes, locationsRes, switchesRes] =
        await Promise.all([
            accessPointService.getAccessPointById(id),
            departmentService.getDepartments(),
            locationService.getLocations(),
            switchService.getSwitches({ page: 1, limit: 100 }),
        ]);

    const apData = apResult?.data;
    const error = apResult?.error;

    if (error || !apData) {
        return (
            <div className="space-y-6">
                <PageTitle title="Ficha Técnica" leftSide={<BackButton />} />
                <div className="p-6 text-center text-destructive font-medium border border-destructive/20 bg-destructive/5 rounded-xl flex items-center justify-center gap-2">
                    <ShieldAlert size={18} />{" "}
                    {error || "Access Point não encontrado."}
                </div>
            </div>
        );
    }

    const rawAsset = apData.asset;

    // 💡 APLICAÇÃO DA REGRA DE NEGÓCIO DA VLAN:
    // Ruckus -> WIFI_MGMT | Outras marcas -> GENERAL_DATA
    const targetVlanType = getApVlanType(
        apData.vendor,
        rawAsset.vlanType || rawAsset.ip?.network?.type,
    );

    const assetFormatted: AssetItem = {
        id: rawAsset.id,
        patrimony: rawAsset.patrimony,
        type: "ACCESS_POINT",
        createdAt: "",
        updatedAt: "",
        departmentId: rawAsset.department?.id || null,
        locationId: rawAsset.location?.id || null,
        ipId: rawAsset.ip?.id || null,

        connectedToSwitchId: null,
        switchPort: null,

        vlanType: targetVlanType, // 👈 Agora o valor de 'targetVlanType' está sendo lido aqui!
        vlanTag: rawAsset.ip?.network?.vlanTag ?? null,

        department: rawAsset.department || null,
        location: rawAsset.location || null,
        ip: rawAsset.ip || null,
        accessPoint: {
            id: apData.id,
            name: apData.name ?? null,
            model: apData.model,
            vendor: apData.vendor ?? null,
            mac: apData.mac ?? null,
            ssid: apData.ssid ?? null,
            wifiPassword: apData.wifiPassword ?? null,
            securityType: apData.securityType ?? null,
            frequencyBand: apData.frequencyBand ?? null,
            adminUsername: apData.adminUsername ?? null,
            adminPassword: apData.adminPassword ?? null,
            firmwareVersion: apData.firmwareVersion ?? null,
            notes: apData.notes ?? null,
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

    const apName = apData.name || rawAsset.patrimony || "Access Point Sem Nome";

    return (
        <div className="space-y-6 max-w-6xl mx-auto p-4 pb-12">
            <PageTitle title={`Ficha: ${apName}`} leftSide={<BackButton />} />

            <AssetTechnicalCard
                mode="view"
                asset={assetFormatted}
                options={options}
            />
        </div>
    );
}
