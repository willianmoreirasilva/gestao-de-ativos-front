import { type NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "better-auth.session_token";

// Verificação otimista: só checa a presença do cookie de sessão.
// A validação real continua no backend; isso evita renderizar páginas
// do painel (e chamar a API) para quem não está logado.
export function proxy(request: NextRequest) {
    if (request.cookies.has(SESSION_COOKIE)) {
        return NextResponse.next();
    }

    const loginUrl = new URL("/login", request.nextUrl);
    return NextResponse.redirect(loginUrl);
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/assets/:path*",
        "/infra/:path*",
        "/reports-audit/:path*",
        "/settings/:path*",
        "/users/:path*",
    ],
};
