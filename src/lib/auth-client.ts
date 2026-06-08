import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
 
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

// Exportamos os métodos utilitários para facilitar o uso nos componentes
export const { signIn, signUp, signOut, useSession } = authClient