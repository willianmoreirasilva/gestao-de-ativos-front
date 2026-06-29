import axios from "axios";
import { cookies } from "next/headers";

export async function getServerApi() {
    const cookieStore = await cookies();

    // Pegamos o cookie gerado pelo Better-Auth
    const sessionCookie = cookieStore.get("better-auth.session_token")?.value;

    const api = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        headers: {
            "Content-Type": "application/json",
        },
    });

    // Se o cookie existir, nós injetamos ele exatamente como o Fastify espera receber do navegador
    if (sessionCookie) {
        api.defaults.headers.common["Cookie"] =
            `better-auth.session_token=${sessionCookie}`;
        api.defaults.headers.common["Authorization"] =
            `Bearer ${sessionCookie}`;
    }

    return api;
}
