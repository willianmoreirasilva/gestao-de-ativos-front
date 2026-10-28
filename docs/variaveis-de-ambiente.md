# Variáveis de ambiente

Só os nomes e para que servem. **Nunca** coloque valores reais em documentação nem em commits.

## Frontend (`.env.local`, ignorado pelo Git com `.env*`)

| Variável | Uso | Onde |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | URL base do backend (em dev, `http://localhost:3005`). É pública, porque o navegador usa para o login e para a URL das fotos | `src/lib/server-api.ts`, `src/lib/auth-client.ts`, `src/lib/avatar.ts` |
| `NODE_ENV` | Definida pelo Next; usada só no `loginAction` sem uso | `src/actions/auth.ts` |

Não existe `.env.example` no front. Só existe esta variável, e ela não é segredo. Não há outras `NEXT_PUBLIC_*`, então não há segredos expostos ao cliente.

## Backend (`.env`, ignorado; modelo em `.env.example`)

| Variável | Obrigatória | Uso | Onde |
|---|---|---|---|
| `PORT` | não (padrão 3005) | Porta HTTP | `src/server.ts` |
| `DATABASE_URL` | **sim** | Conexão PostgreSQL | `src/lib/db.ts`, `prisma.config.ts` |
| `BETTER_AUTH_SECRET` | **sim** | Assina cookies e tokens do Better Auth; o pacote lê sozinho | `src/lib/auth.ts` |
| `BETTER_AUTH_URL` | não (padrão `http://localhost:3005`) | `baseURL` do Better Auth | `src/lib/auth.ts:11` |
| `FRONTEND_URL` | não (padrão `http://localhost:3000`) | Monta o link do convite | `src/services/user.service.ts:185` |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | para enviar convites | Servidor de e-mail (padrão `smtp.mailtrap.io:2525`) | `src/services/email.service.ts` |
| `EMAIL_FROM` | não | Remetente dos convites | `src/services/email.service.ts` |
| `CREDENTIALS_ENCRYPTION_KEY` | **sim** (a API não sobe sem ela) | Chave AES-256-GCM (32 bytes em base64) das senhas de AP. Gerar: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`. **Se for perdida, as senhas cifradas não podem ser recuperadas**; não reaproveite a mesma chave entre ambientes | `src/lib/secret-crypto.ts` |
| `TEST_DATABASE_URL` | só para os testes de integração | Banco **isolado** dos testes com `app.inject()` (ex.: `.../assets_test`). O nome precisa terminar em `_test` e ser diferente do `DATABASE_URL`; o schema é **apagado e recriado** a cada `pnpm test`. Sem ela, os testes de integração são pulados | `vitest.config.ts`, `src/test/` |
| `UPLOADS_DIR` | não (padrão `uploads`) | Pasta das fotos de perfil (`<UPLOADS_DIR>/avatars`) | `src/lib/avatar-storage.ts` |
| `NODE_ENV` | não | Fora de produção, reaproveita o `PrismaClient` global | `src/lib/db.ts` |
| `ENABLE_API_DOCS` | não (padrão `false`) | Liga a documentação da API: `/docs`, `/reference`, `/swagger.json` e o OpenAPI do Better Auth (`/api/auth/reference`). Só aceita `true` ou `false`; outro valor impede a API de subir. Use `true` só em desenvolvimento | `src/config/env.ts`, `src/app.ts`, `src/lib/auth.ts` |
| `HOST`, `CORS_ORIGINS` | — | Declaradas e validadas em `src/config/env.ts`, mas **ainda não são usadas** (M6) | — |

O `.env.example` só lista `PORT`, `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` e `ENABLE_API_DOCS` (`false`), `CREDENTIALS_ENCRYPTION_KEY` e `TEST_DATABASE_URL` (vazias). Faltam `FRONTEND_URL`, `SMTP_*`, `EMAIL_FROM` e `UPLOADS_DIR` (B6).

O `tsx --watch` **não recarrega** o `.env`. Depois de alterá-lo, reinicie o `pnpm dev`.
