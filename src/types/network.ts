// Interface base combinando com o retorno fornecido da API
export type Network = {
    id: string;
    networkAddress: string;
    cidr: number;
    vlanTag: number | null;
    type: "GENERAL_DATA" | "CAMERA_VLAN" | "SWITCH_MGMT" | "WIFI_MGMT";
    totalIps?: number;
    _count: {
        ips: number;
    };
    createdAt: string;
    updatedAt: string;
}