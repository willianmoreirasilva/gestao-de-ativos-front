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

## Como trabalhar nas correções

Vale para os itens de `docs/problemas-encontrados.md` (nos dois repositórios).

**Ciclo de cada item**, nesta ordem:
1. **Confirmar:** conferir no código que o problema ainda existe e entender o efeito colateral antes de mexer.
2. **Testar:** escrever ou rodar o teste que mostra o problema (ou que trava o comportamento que precisa continuar igual).
3. **Corrigir:** a menor mudança que resolve.
4. **Verificar:** `pnpm typecheck`, `pnpm test`, `pnpm lint` (sem erros novos) e, quando mexe em tela ou em rota, `pnpm build` mais um teste real: back compilado e front em produção, com usuário temporário **no banco de testes** (nunca no de desenvolvimento).
5. **Registrar:** atualizar o item em `docs/problemas-encontrados.md` (o que foi feito, como foi verificado, o que ficou de fora) e, se couber, `CLAUDE.md` ou `docs/variaveis-de-ambiente.md`.
6. **Commit:** em pt-BR, só com autorização do usuário, um commit por item (ou por módulo, quando o item é dividido).

**Regras**
- Um item por vez. **Parar ao fim de cada item** (ou de cada módulo) e mostrar o resumo antes de seguir.
- Nas decisões marcadas com ❓ (ex.: política de papéis, escolhas de produto), **perguntar** ao usuário em vez de assumir.
- Se a verificação mostrar que a correção planejada não é segura, parar, explicar o motivo e propor a alternativa (foi o caso do M7: o hook não podia ser removido).
- Dizer com clareza o que **não** foi testado.

**Ordem dos itens que faltam**
Já concluídos e commitados: M14, M12, M4, M13 (módulos 1 a 6), M21, M22 e M24.
1. **M23** (filtro em cascata nos relatórios). M24 e M22 estão feitos. Detalhes em `docs/problemas-encontrados.md`.
2. **Itens 🟢** (B1 a B6) e `eslint --fix` para a ordem dos imports (30 erros no lint do front, 27 corrigíveis; os outros: `react/no-unescaped-entities` em `infra/departments/[id]/page.tsx` e o `any` acima).
3. Por fim, o lint do CI deixa de ser aviso e passa a bloquear (remover o `continue-on-error` dos dois `ci.yml`).

**Pendências fora dessa ordem**
- A7: o CI ainda não rodou no GitHub (falta o primeiro `push`).
- M16: os hooks de auditoria de login e logout do back leem o `x-forwarded-for` direto; trocar por `req.ip`.
- Produção: banco novo recebe só `prisma migrate deploy`; `TRUST_PROXY=true`, `HOST=127.0.0.1` e `CORS_ORIGINS` com o endereço HTTPS do proxy.
