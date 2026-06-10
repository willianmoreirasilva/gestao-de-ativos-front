"use server";

import { cookies } from "next/headers";
import axios from "axios";
import * as z from "zod";

const loginSchema = z.object({
    email: z.string().email("Insira um e-mail válido"),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export async function loginAction(prevState: any, formData: FormData) {
    const email = formData.get("email");
    const password = formData.get("password");

    const validatedFields = loginSchema.safeParse({ email, password });
    if (!validatedFields.success) {
        const errors = validatedFields.error.flatten().fieldErrors;
        const firstError = Object.values(errors)[0]?.[0];
        return { error: firstError || "Validação falhou" };
    }

    try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/sign-in/email`,
            {
                email,
                password,
            },
        );

        const token = response.data?.token || response.data?.session?.token;

        if (!token) {
            return { error: "Token de sessão não retornado pelo backend." };
        }

        const cookieStore = await cookies();

        // Salvamos o cookie padrão que ambos os lados vão entender
        cookieStore.set("better-auth.session_token", token, {
            httpOnly: false, // Permitir que o client-side leia o estado da sessão
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
            sameSite: "lax",
        });

        return { error: null, success: true };
    } catch (err: any) {
        return {
            error:
                err.response?.data?.message ||
                err.message ||
                "Falha ao autenticar",
        };
    }
}
