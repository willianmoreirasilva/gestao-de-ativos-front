import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZodError } from "zod";

import { VlanType } from "@/types/assets";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getFieldErrors(error: ZodError): Record<string, string[]> {
    const fieldErrors: Record<string, string[]> = {};
    error.issues.forEach((issue) => {
        const key = issue.path[0] as string;
        if (!fieldErrors[key]) fieldErrors[key] = [];
        fieldErrors[key].push(issue.message);
    });
    return fieldErrors;
}

/**
 * 🧼 Higienizador inteligente de Payload
 * Transforma strings vazias em null, preserva nulls explícitos para o Prisma zerar campos,
 * e ignora undefined para evitar sobrescrever dados não enviados.
 */
export function sanitizePayloadForBackend(obj: any): any {
    // 1. undefined é ignorado (não altera o banco)
    if (obj === undefined) return undefined;

    // 2. null é preservado (instrução para o Prisma zerar/desvincular o campo)
    if (obj === null) return null;

    // 3. Strings vazias viram null, strings preenchidas sofrem trim
    if (typeof obj === "string") return obj.trim() === "" ? null : obj.trim();

    // 4. Tratamento recursivo de Arrays
    if (Array.isArray(obj)) return obj.map(sanitizePayloadForBackend);

    // 5. Tratamento recursivo de Objetos
    if (typeof obj === "object") {
        const cleaned: any = {};
        for (const key of Object.keys(obj)) {
            const val = obj[key];
            if (val === undefined) continue;

            const sanitizedVal = sanitizePayloadForBackend(val);
            // Só adiciona a chave se o valor retornado não for undefined
            if (sanitizedVal !== undefined) {
                cleaned[key] = sanitizedVal;
            }
        }
        return cleaned;
    }

    return obj;
}

/**
 * Helper para converter strings vazias ou com apenas espaços em NULL
 */

export function sanitizeNullable(value?: string | null): string | null {
    if (!value || typeof value !== "string") return null;
    const trimmed = value.trim();
    return trimmed === "" ? null : trimmed;
}

/**
 * Define o vlanType correto para um Access Point com base no Fabricante (Vendor)
 */
export function getApVlanType(
    vendor?: string | null,
    explicitVlanType?: string | null,
): VlanType {
    // 1. Se já veio um vlanType explicitamente válido da rede/banco, ele tem prioridade
    const normalizedExplicit = explicitVlanType?.toUpperCase();
    if (
        normalizedExplicit === "WIFI_MGMT" ||
        normalizedExplicit === "GENERAL_DATA"
    ) {
        return normalizedExplicit as VlanType;
    }

    // 2. Regra de Negócio por Fabricante:
    const normalizedVendor = (vendor || "").trim().toUpperCase();

    // Se o Fabricante for Ruckus (ou variações como Ruckus Wireless / CommScope)
    if (normalizedVendor.includes("RUCKUS")) {
        return "WIFI_MGMT";
    }

    // Para todas as outras marcas de AP (Ubiquiti, Aruba, TP-Link, etc.)
    return "GENERAL_DATA";
}
