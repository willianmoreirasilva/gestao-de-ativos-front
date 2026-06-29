"use client";

import { useEffect,useState } from "react";

import { getAvailableIpsAction } from "@/actions/networks";

interface AvailableIp {
    id: string;
    address: string;
}

interface NetworkGroup {
    networkId: string;
    networkAddress: string;
    vlanTag: number | null;
    availableIps: AvailableIp[];
}

export function useAvailableIps(type: string, limit: number = 5, enabled: boolean = false) {
    const [networks, setNetworks] = useState<NetworkGroup[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!enabled || !type) return;

        async function fetchIps() {
            setIsLoading(true);
            setError(null);
            
            const result = await getAvailableIpsAction(type, limit);
            
            if (result.error) {
                setError(result.error);
                setNetworks([]);
            } else {
                setNetworks(result.data || []);
            }
            setIsLoading(false);
        }

        fetchIps();
    }, [type, limit, enabled]);

    return { networks, isLoading, error };
}