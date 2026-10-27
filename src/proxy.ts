import { type NextRequest, NextResponse } from "next/server";

import { type Action, can, type Resource, type Role } from "@/lib/permissions";

const SESSION_COOKIE = "better-auth.session_token";

/**
 * Rotas que exigem uma permissão além do login. O proxy barra antes de
 * renderizar (inclusive URL digitada direto); a página repete a checagem
 * no servidor (RequirePermission) e a API é quem autoriza de fato.
 */
const RESTRICTED_ROUTES: {
    pattern: RegExp;
    resource: Resource;
    action: Action;
    // Para onde redirecionar quem não pode (a listagem do tipo)
    fallback: (match: RegExpExecArray) => string;
}[] = [
    {
        // Switches e APs: detalhe e criação só para SUPERADM e ADMIN
        pattern: /^\/assets\/(switches|access-points)\/add\/?$/,
        resource: "networkDevices",
        action: "create",
        fallback: (match) => `/assets/${match[1]}`,
    },
    {
        pattern: /^\/assets\/(switches|access-points)\/[^/]+\/?$/,
        resource: "networkDevices",
        action: "viewDetails",
        fallback: (match) => `/assets/${match[1]}`,
    },
];

async function fetchRole(request: NextRequest): Promise<Role | null> {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
            {
                headers: { cookie: request.headers.get("cookie") ?? "" },
                cache: "no-store",
            },
        );
        if (!response.ok) return null;
        const profile = (await response.json()) as { role?: Role };
        return profile.role ?? null;
    } catch {
        return null;
    }
}

// Verificação otimista: checa a presença do cookie de sessão e, nas rotas
// restritas, a role. A validação real continua no backend; isso evita
// renderizar páginas do painel (e chamar a API) para quem não pode vê-las.
export async function proxy(request: NextRequest) {
    if (!request.cookies.has(SESSION_COOKIE)) {
        return NextResponse.redirect(new URL("/login", request.nextUrl));
    }

    const { pathname } = request.nextUrl;
    for (const rule of RESTRICTED_ROUTES) {
        const match = rule.pattern.exec(pathname);
        if (!match) continue;

        const role = await fetchRole(request);
        // Sem a role (API fora do ar, sessão expirada), a página decide
        if (role && !can(role, rule.resource, rule.action)) {
            const url = new URL(rule.fallback(match), request.nextUrl);
            url.searchParams.set("acesso", "negado");
            return NextResponse.redirect(url);
        }
        break;
    }

    return NextResponse.next();
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
