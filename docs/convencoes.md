# Convenções observadas

## Gerais
- **Idioma:**
  - A interface, os comentários e as mensagens de erro são em português.
  - Os identificadores de código são em inglês (`createAssetAction`, `requireAuth`).
  - As mensagens de commit são em pt-BR, no formato `feat: ...` / `fix: ...`.
- **Gerenciador de pacotes:** **pnpm** nos dois projetos. `npm install` falha com ERESOLVE no front.
- **Formatação:**
  - Prettier 3.8, sem arquivo de config, rodado com `--tab-width 4`: 4 espaços, aspas duplas, vírgula final.
  - Alguns arquivos fogem do padrão: `back:src/routes/computer-options.ts`, `back:src/index.ts` e `back:src/config/env.ts` usam 2 espaços.
- **Imports:**
  - `eslint-plugin-simple-import-sort` como erro.
  - Alias `@/` → `src/` no front.
  - Caminhos relativos com extensão `.js` no back (ESM).

## Frontend

### Pastas

- `src/app/`: rotas.
  - Componentes privados da rota em `_components/` (`users/_components`, `settings/profile/_components`) ou `_schemas/`.
  - O grupo `(painel)` contém tudo o que exige login.
- `src/components/<domínio>/`: componentes por domínio. `components/ui/` é só shadcn.
- `src/services/<domínio>.ts`: **leitura** no servidor. São objetos (`userService.listUsers`) ou funções (`getAssets`) que retornam `{ data, error }` e nunca lançam exceção para a página.
- `src/actions/<domínio>.ts`: **mutações** (`"use server"`).
  - Fluxo: valida com zod → `getServerApi()` → `revalidatePath`.
  - Retornam `{ success, error?, message?, fieldErrors? }`.
- `src/schemas/`: zod dos formulários.
- `src/types/`: tipos das respostas da API, escritos à mão.

### Nomes

- **Arquivos:** kebab-case (`audit-log-table.tsx`). Exceções: `quick-search-Trigger.tsx` e `use-availableIps.ts`.
- **Componentes:** PascalCase, com exportação nomeada (`export function X`). Só as páginas usam `export default`.
- **Actions:** sufixo `Action` (`upsertDepartmentAction`). Os arquivos às vezes têm o sufixo `.action.ts` / `.actions.ts`.

### Padrões

- **Páginas:**
  - São Server Components que recebem `searchParams: Promise<...>` (Next 16) e fazem `await`.
  - Os filtros e a paginação ficam na URL (`page`, `limit`, `search`, etc.).
- **Formulários:**
  - react-hook-form + `zodResolver`.
  - Os erros de campo aparecem com `FieldError`.
  - O envio usa `useTransition` com a action.
  - Para observar campos, use `useWatch`, não `form.watch` (aviso do React Compiler).
- **Avisos ao usuário:** toasts com `sonner` (`toast.success` / `toast.error`), com a mensagem que vem da API.
- **Autorização na UI:**
  - Os helpers de `lib/user-roles.ts` só espelham a regra do backend.
  - A API é a autoridade final.
- **DELETE sem corpo:** envie `headers: { "Content-Type": undefined }` (ver o tratamento de body vazio no backend).

## Backend

- **Um arquivo por domínio** em `routes/`, `controllers/`, `services/` e `validators/`. Os nomes variam: `switch.ts` / `switch.controllers.ts` / `switch.service.ts` / `switch.validator.ts`.
- **Schemas zod:** `XxxSchema` + `type XxxInput = z.infer<...>`. Toda rota declara `schema.response`, e as rotas multipart não declaram `body`.
- **Erros:** `throw new AppError(msg, status)`. O módulo de usuários usa `{ statusCode, message }`.
- **Auditoria:** use `createAuditLog({ userId, action, entity, entityId, details, tx })` de `lib/audit.ts`, passando `tx` quando estiver dentro de `$transaction`.
- **Nomes de entidade na auditoria:** `ASSET`, `NETWORK`, `DEPARTMENT`, `LOCATION`, `USER` e `IpAddress` (inconsistente).
- **Hooks em grupos de rotas:** encapsule com `app.register(...)` para o hook não vazar para o resto da API.

## Cuidados

- Não apague arquivos de `back:uploads/`: são fotos reais dos usuários.
- O cliente Prisma é gerado e fica fora do Git. Depois de mexer no schema, rode `npx prisma generate`.
- Antes de usar uma API do Next, consulte `node_modules/next/dist/docs/`, porque a versão 16 muda convenções (`proxy.ts`, `searchParams` como Promise).
