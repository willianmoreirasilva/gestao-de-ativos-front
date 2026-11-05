import axios from "axios";
import { cookies } from "next/headers";

import { findSessionCookie } from "@/lib/session-cookie";

export async function getServerApi() {
    const cookieStore = await cookies();

    // Pegamos o cookie gerado pelo Better-Auth
    const sessionCookie = findSessionCookie(cookieStore);

    const api = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        headers: {
            "Content-Type": "application/json",
        },
    });

    // Se o cookie existir, nós injetamos ele exatamente como o Fastify espera receber do navegador
    if (sessionCookie) {
        api.defaults.headers.common["Cookie"] =
            `${sessionCookie.name}=${sessionCookie.value}`;
    }

    return api;
}
