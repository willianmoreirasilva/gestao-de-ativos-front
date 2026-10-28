## Idioma

Sempre responda em português do Brasil, inclusive em perguntas de múltipla escolha,
planos, resumos do que vai fazer e mensagens de commit.

@AGENTS.md

## Projeto

O NetManager gerencia redes, IPs e ativos de TI: computadores, impressoras, telefones, câmeras, switches e APs. Tem também relatórios, auditoria e usuários por convite.

Este repositório é o **frontend**. O backend fica em `../sysip-backend-2.0`, em outro repositório.

A documentação completa está em `docs/` (índice: `docs/README.md`). Problemas conhecidos e o plano de correção estão em `docs/problemas-encontrados.md`. A matriz oficial de permissões por role está em `docs/permissoes.md`: siga-a ao criar ou alterar qualquer rota, action ou tela.

## Stack

- **Base:** Next.js 16.4 (App Router, Turbopack), React 19.2 e TypeScript strict.
- **UI:** Tailwind v4 (configurado em CSS, `src/app/globals.css`) e shadcn/ui (`src/components/ui`).
- **Formulários:** react-hook-form + zod 4.
- **Dados e auth:** axios e better-auth (cliente), sonner, next-themes.
- **API:** o backend Fastify em `NEXT_PUBLIC_API_URL` (dev: `http://localhost:3005`).

## Comandos

- Use **pnpm**; o `npm install` falha com ERESOLVE.
  - `pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm test` (Vitest)
  - `pnpm typecheck` (`tsc --noEmit`)
- Formatação: `npx prettier --tab-width 4 --write <arquivos>` (não há config do Prettier).
- Testes: `src/lib/permissions.test.ts`, que verifica a matriz inteira.

## Onde fica cada coisa

| O quê | Onde |
|---|---|
| Rotas do painel (exigem login) | `src/app/(painel)/` |
| Rotas públicas | `src/app/login` e `src/app/accept-invite` |
| Redirecionamento sem cookie | `src/proxy.ts` (substitui o `middleware.ts` no Next 16) |
| Layout autenticado | `(painel)/layout.tsx` (busca `/api/users/me`) e `components/painel-shell.tsx` |
| Leitura no servidor | `src/services/*`, via `getServerApi()` (`src/lib/server-api.ts`, repassa o cookie) |
| Mutações | `src/actions/*` (`"use server"`): zod → API → `revalidatePath` |
| Schemas e tipos | `src/schemas/*` (zod dos formulários) e `src/types/*` (respostas da API, à mão) |
| Menu e papéis na UI | `src/config/sidebar-menu.ts` e `src/lib/user-roles.ts` |
| Avatar | `src/components/avatar/*` e `src/lib/avatar.ts` |

## Convenções

- **Permissões:** siga a matriz de `docs/permissoes.md`, codificada em `src/lib/permissions.ts`. Esse arquivo é uma **cópia idêntica** do backend: altere os dois juntos, com os testes. Na interface:
  - páginas: `<RequirePermission>`;
  - botões e atalhos: `<Can>` / `useCan()`;
  - menu: campo `permission`;
  - rotas de detalhe e criação de switch/AP: também há uma checagem de role no `proxy.ts`.

  Isso é só UX: quem autoriza é a API.

  Dados sensíveis (senhas de AP, IP e MAC de switch/AP para USER e CAM_OPERATOR) nem chegam ao front. Não os passe em props: o card do AP revela as senhas por uma action própria, que é auditada.
- Interface e comentários em pt-BR; identificadores em inglês.
- Arquivos em kebab-case; exportações nomeadas, exceto nas páginas.
- Componentes privados de rota em `_components/`.
- Páginas são Server Components. `searchParams` é uma **Promise** e precisa de `await`.
- Filtros e paginação ficam na URL.
- Services retornam `{ data, error }`. Actions retornam `{ success, error?, message? }`.
- Use os tokens do tema (`bg-card`, `text-muted-foreground`, ...) e `cn()`.
- Para observar campos, `useWatch` em vez de `form.watch`. Evite `setState` síncrono em `useEffect` (React Compiler).

## Cuidados

- **Upload multipart via axios:** passe `"Content-Type": "multipart/form-data"`, porque a instância usa JSON por padrão.
- **DELETE sem corpo:** use `"Content-Type": undefined`.
- **Autorização:** a autoridade é o backend; os helpers da UI só espelham a regra.
- **Antes de mexer em APIs do Next:** leia `node_modules/next/dist/docs/`.
- **Backend:**
  - Ao testar a API manualmente, use o cookie **assinado** do `Set-Cookie` e envie o header `Origin: http://localhost:3000` no login.
  - Não apague `../sysip-backend-2.0/uploads/`: são fotos reais.
  - O `tsx --watch` do back não recarrega o `.env`.
- **Commits:** em pt-BR. Não faça commit sem pedido do usuário.
