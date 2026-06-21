export type IpAddress = {
    id: string;
    address: string;
    addressInt: string;
    status: "AVAILABLE" | "IN_USE" | "RESERVED";
    networkId: string;
    asset: {
        id: string;
        type: string;
        patrimony: string | null;
        computer?: { hostname: string | null; username: string };
        printer?: { model: string; hostname: string | null };
        camera?: { model: string; mac: string | null };
        phone?: { model: string | null; phoneNumber: string };
        networkDevice?: { model: string | null; mac: string | null };
    } | null;
}