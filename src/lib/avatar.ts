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

// User.image guarda um caminho relativo da API; URLs absolutas e
// pré-visualizações locais (blob:/data:) passam direto
export function resolveAvatarUrl(image: string | null | undefined) {
    if (!image) return undefined;
    if (/^(https?:|blob:|data:)/i.test(image)) return image;
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

/**
 * Gera no navegador uma pré-visualização do recorte (somente para exibição;
 * o arquivo enviado é sempre o original, recortado no servidor).
 * Devolve uma object URL que deve ser liberada com URL.revokeObjectURL.
 */
export async function createAvatarPreview(
    file: File,
    crop: AvatarCrop,
    outputSize = 256,
): Promise<string> {
    const sourceUrl = URL.createObjectURL(file);
    try {
        const image = new Image();
        image.src = sourceUrl;
        await image.decode();

        const canvas = document.createElement("canvas");
        canvas.width = outputSize;
        canvas.height = outputSize;
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Canvas indisponível");

        // O navegador já aplica a orientação EXIF, como o servidor
        context.drawImage(
            image,
            crop.x,
            crop.y,
            crop.size,
            crop.size,
            0,
            0,
            outputSize,
            outputSize,
        );

        const blob = await new Promise<Blob | null>((resolve) =>
            canvas.toBlob(resolve, "image/webp", 0.9),
        );
        if (!blob) throw new Error("Falha ao gerar a pré-visualização");
        return URL.createObjectURL(blob);
    } finally {
        URL.revokeObjectURL(sourceUrl);
    }
}
