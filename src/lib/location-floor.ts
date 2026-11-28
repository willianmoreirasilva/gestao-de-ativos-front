/**
 * Exibição do campo "andar" das localidades.
 *
 * O andar é gravado como texto livre, então o mesmo andar pode vir escrito de
 * jeitos diferentes ("2", "2º andar", "terreo", "Térreo"). A comparação ignora
 * maiúsculas, acentos e espaços extras.
 */

/** Minúsculas, sem acentos e com os espaços normalizados */
function normalize(value: string) {
    return value
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();
}

const NAMED_FLOORS: Record<string, string> = {
    terreo: "Térreo",
    subsolo: "Subsolo",
    ultimo: "Último andar",
    "ultimo andar": "Último andar",
};

// "2", "2º", "2°", "2o", "2ª", "2 andar", "2º andar"
const NUMBERED_FLOOR = /^(\d+)\s*[º°oª]?\s*(andar)?$/;

/**
 * Texto do andar para a tela, ou `null` quando não há andar
 * (vazio ou "N/A"). Um valor fora das regras aparece como foi gravado.
 */
export function formatFloor(floor?: string | null): string | null {
    const raw = floor?.trim();
    if (!raw) return null;

    const key = normalize(raw);
    if (key === "n/a") return null;

    const named = NAMED_FLOORS[key];
    if (named) return named;

    const numbered = NUMBERED_FLOOR.exec(key);
    if (numbered) return `${Number(numbered[1])}º Andar`;

    return raw;
}
