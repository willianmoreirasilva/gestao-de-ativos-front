"use server";

import { getServerApi } from "@/lib/server-api";

interface OptionItem {
    id: string;
    name: string;
}

interface OptionsResponse {
    data: OptionItem[];
}

interface SingleOptionResponse {
    data: OptionItem;
}

// --- PROCESSADORES ---
export async function getProcessorsAction(): Promise<OptionsResponse> {
    const api = await getServerApi();
    const response = await api.get("/api/options/processors");
    return response.data;
}

export async function createProcessorAction(
    name: string,
): Promise<SingleOptionResponse> {
    const api = await getServerApi();
    const response = await api.post("/api/options/processors", { name });
    return response.data;
}

// --- SISTEMAS OPERACIONAIS ---
export async function getOperatingSystemsAction(): Promise<OptionsResponse> {
    const api = await getServerApi();
    const response = await api.get("/api/options/operating-systems");
    return response.data;
}

export async function createOperatingSystemAction(
    name: string,
): Promise<SingleOptionResponse> {
    const api = await getServerApi();
    const response = await api.post("/api/options/operating-systems", { name });
    return response.data;
}

// --- DISCOS ---
export async function getDisksAction(): Promise<OptionsResponse> {
    const api = await getServerApi();
    const response = await api.get("/api/options/disks");
    return response.data;
}

export async function createDiskAction(
    name: string,
): Promise<SingleOptionResponse> {
    const api = await getServerApi();
    const response = await api.post("/api/options/disks", { name });
    return response.data;
}
