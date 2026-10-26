// Regras de avatar compartilhadas entre "Minha Conta" e o convite de usuários.
// A validação definitiva (conteúdo real, dimensões e reprocessamento) é do backend.

export const AVATAR_ACCEPTED_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
] as const;

export const AVATAR_ACCEPT_ATTR = AVATAR_ACCEPTED_TYPES.join(",");

export const AVATAR_MAX_BYTES = 5 * 1024 * 1024;

// Recorte quadrado em pixels da imagem original
export type AvatarCrop = {
    x: number;
    y: number;
    size: number;
};

function isAcceptedType(type: string): boolean {
    return AVATAR_ACCEPTED_TYPES.some((accepted) => accepted === type);
}

export function validateAvatarFile(file: File): string | null {
    if (!isAcceptedType(file.type)) {
        return "Formato não suportado. Envie uma imagem JPG, PNG ou WebP.";
    }
    if (file.size > AVATAR_MAX_BYTES) {
        return "A imagem deve ter no máximo 5 MB.";
    }
    return null;
}

// User.image guarda um caminho relativo da API; URLs absolutas passam direto
export function resolveAvatarUrl(image: string | null | undefined) {
    if (!image) return undefined;
    if (/^https?:\/\//i.test(image)) return image;
    return `${process.env.NEXT_PUBLIC_API_URL ?? ""}${image}`;
}

// Os campos do recorte vão antes do arquivo: o backend só lê os campos anteriores a ele
export function buildAvatarFormData(file: File, crop: AvatarCrop): FormData {
    const formData = new FormData();
    formData.append("cropX", String(crop.x));
    formData.append("cropY", String(crop.y));
    formData.append("cropSize", String(crop.size));
    formData.append("file", file, file.name);
    return formData;
}
