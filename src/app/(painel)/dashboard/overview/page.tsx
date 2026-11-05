import type { Metadata } from "next";

import { RequirePermission } from "@/components/require-permission";
import { can } from "@/lib/permissions";
import { ipAddressService } from "@/services/ip-address";
import { networkService } from "@/services/network";
import { userService } from "@/services/user";
import type { NetworkOption } from "@/types/ip-address";

import { IpOverviewContainer } from "./_components/ip-overview-container";

export const metadata: Metadata = { title: "Visão Geral de IPs" };

export const revalidate = 0;

async function IpOverview() {
    const [{ data: profile }, networksRes] = await Promise.all([
        userService.getMyProfile(),
        // Redes em que a role procura IPs livres (a API tira a VLAN de
        // câmeras do USER)
        networkService.getNetworks({ limit: 100 }),
    ]);

    // Estatísticas de uso só para quem tem ipUsage (a API já devolve no
    // escopo da role: CAM_OPERATOR, só a VLAN de câmeras; USER, 403)
    const statsRes = can(profile?.role, "ipUsage", "view")
        ? await ipAddressService.getOverviewStats("ALL")
        : null;

    // Só os campos da seleção chegam ao cliente
    const networks: NetworkOption[] = networksRes.data.map((net) => ({
        id: net.id,
        networkAddress: net.networkAddress,
        cidr: net.cidr,
        vlanTag: net.vlanTag ?? null,
        type: net.type,
    }));

    return (
        <IpOverviewContainer
            initialStats={statsRes?.data || null}
            networks={networks}
        />
    );
}

export default function IpOverviewPage() {
    return (
        <RequirePermission resource="ipFree" action="view">
            <IpOverview />
        </RequirePermission>
    );
}
