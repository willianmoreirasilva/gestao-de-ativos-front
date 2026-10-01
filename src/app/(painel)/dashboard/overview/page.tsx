import { ipAddressService } from "@/services/ip-address";

import { IpOverviewContainer } from "./_components/ip-overview-container";

export const revalidate = 0;

export default async function IpOverviewPage() {
    const statsRes = await ipAddressService.getOverviewStats("ALL");

    return <IpOverviewContainer initialStats={statsRes.data || null} />;
}
