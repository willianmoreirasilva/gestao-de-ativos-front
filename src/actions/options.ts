"use server";

import { getServerApi } from "@/lib/server-api";

interface OptionItem {
    id: string;
    name: string;
}

interface SingleOptionResponse {
    data: OptionItem;
}

// --- PROCESSADORES ---
export async function createProcessorAction(
    name: string,
): Promise<SingleOptionResponse> {
    const api = await getServerApi();
    const response = await api.post("/api/options/processors", { name });
    return response.data;
}

// --- SISTEMAS OPERACIONAIS ---
export async function createOperatingSystemAction(
    name: string,
): Promise<SingleOptionResponse> {
    const api = await getServerApi();
    const response = await api.post("/api/options/operating-systems", { name });
    return response.data;
}

// --- DISCOS ---
export async function createDiskAction(
    name: string,
): Promise<SingleOptionResponse> {
    const api = await getServerApi();
    const response = await api.post("/api/options/disks", { name });
    return response.data;
}
