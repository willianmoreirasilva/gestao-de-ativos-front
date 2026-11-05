import { notFound } from "next/navigation";

type LoadResult<T> = {
    data: T | null;
    error: string | null;
    status: number | null;
};

/**
 * Resultado de um service de leitura por ID, para páginas de edição.
 * - 404 ou 400 (ID inexistente ou inválido): página "não encontrado", sem log.
 * - Qualquer outro erro (500, back fora do ar): registra e lança, para cair
 *   no error.tsx do painel em vez de fingir que o registro não existe.
 */
export function loadOrNotFound<T>(res: LoadResult<T>, what: string): T {
    if (res.data) return res.data;
    if (res.status === 404 || res.status === 400) notFound();

    console.error(`Erro ao buscar ${what}:`, res.error);
    throw new Error(res.error ?? `Não foi possível carregar ${what}.`);
}
