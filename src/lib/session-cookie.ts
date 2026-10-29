// O Better Auth grava o cookie como `__Secure-better-auth.session_token` quando
// o BETTER_AUTH_URL é https:// e sem o prefixo quando é http://.
const SESSION_COOKIE_NAMES = [
    "__Secure-better-auth.session_token",
    "better-auth.session_token",
] as const;

interface CookieReader {
    get(name: string): { value: string } | undefined;
}

/** Devolve o cookie de sessão com o nome em que ele chegou, ou null. */
export function findSessionCookie(
    cookies: CookieReader,
): { name: string; value: string } | null {
    for (const name of SESSION_COOKIE_NAMES) {
        const cookie = cookies.get(name);
        if (cookie?.value) return { name, value: cookie.value };
    }
    return null;
}
