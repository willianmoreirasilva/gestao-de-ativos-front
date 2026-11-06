export type ConnectivityErrorField = "connectedToSwitchId" | "switchPort";

/**
 * Em qual campo do formulário de ligação ao switch a mensagem de erro da API
 * deve aparecer. O ciclo na cascata é checado antes: o nome do switch vem na
 * mensagem e pode conter "porta" (ex.: "SW-Portaria").
 */
export function connectivityErrorField(
    message: string | undefined,
): ConnectivityErrorField | null {
    const text = message?.toLowerCase() ?? "";
    if (
        text.includes("ele mesmo") ||
        text.includes("direta ou indiretamente")
    ) {
        return "connectedToSwitchId";
    }
    if (text.includes("ocupada") || text.includes("porta")) {
        return "switchPort";
    }
    return null;
}
