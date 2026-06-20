"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isPending, setIsPending] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setIsPending(true);

        // Usando o cliente nativo do Better-Auth para fazer o login pelo navegador
        await authClient.signIn.email(
            {
                email,
                password,
                dontRememberMe: false, // Mantém o usuário conectado
            },
            {
                onRequest: () => {
                    setIsPending(true);
                },
                onSuccess: () => {
                    setIsPending(false);
                    // Redireciona e força o Next.js a revalidar o layout do painel
                    router.push("/dashboard");
                    router.refresh();
                },
                onError: (ctx) => {
                    setIsPending(false);
                    setError(
                        ctx.error.message || "E-mail ou senha incorretos.",
                    );
                },
            },
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
            <div className="w-full max-w-md space-y-6 rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex flex-col items-center space-y-2 text-center">
                    <div className="relative h-20 w-20 mb-2 flex items-center justify-center rounded-xl">
                        <Image
                            src="/logodi.svg"
                            alt="DI"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
                        NetManager
                    </h1>
                </div>

               

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <Label htmlFor="email">E-mail</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="user@unigran.br"
                            required
                            disabled={isPending}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="password">Senha</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            required
                            disabled={isPending}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && (
                    <div className="rounded-lg bg-red-50 p-3 text-xs font-medium text-red-600 dark:bg-red-950/30 dark:text-red-400 text-center">
                        {error}
                    </div>
                )}
                    <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 text-white"
                        disabled={isPending}
                    >
                        {isPending
                            ? "Validando credenciais..."
                            : "Entrar no Sistema"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
