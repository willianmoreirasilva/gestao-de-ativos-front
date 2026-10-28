# Backend (`../sysip-backend-2.0`)

## Stack

| Item | Versão / detalhe |
|---|---|
| Runtime | Node 24 (`engines`), ESM (`"type": "module"`), imports com extensão `.js` |
| Gerenciador | pnpm 10 (`packageManager`) |
| Servidor | Fastify 5.7.4 + `fastify-type-provider-zod` 6 (validação e serialização com zod 4) |
| Banco | PostgreSQL via Prisma 7.4, com `@prisma/adapter-pg` e cliente gerado em `src/generated/prisma` (ignorado no Git) |
| Auth | Better Auth 1.4.18, adapter Prisma, plugin `openAPI` |
| Upload | `@fastify/multipart` 10, `sharp` 0.35, `file-type` 22 |
| E-mail | nodemailer 10 (convites) |
| Docs da API | `@fastify/swagger` + swagger-ui (`/docs`), Scalar (`/reference`). Só registrados com `ENABLE_API_DOCS=true` (`src/config/env.ts`) |
| Dev | `tsx --watch src/index.ts` (`pnpm dev`). **Não recarrega o `.env`**: reinicie o processo ao mudar variáveis |

Scripts do `package.json`: `dev`, `typecheck` (`tsc --noEmit`), `lint` (`eslint src`), `test` (Vitest), `backfill:ip-address-int` e `encrypt:ap-secrets`. Não existem `build` nem `start` (ver A7).

**Testes** (`vitest.config.ts`, dois projetos, ambos no `pnpm test`):
- **unit:** `src/**/*.test.ts`, com o `prisma` mockado (`vi.mock("../lib/db.js")`).
- **integration:** `src/**/*.int.test.ts`, com o app completo via `buildApp({ logger: false })` + `app.inject()` e um banco real e isolado (`TEST_DATABASE_URL`).
  - O `src/test/global-setup.ts` apaga o schema `public` desse banco e o recria com `prisma migrate diff --from-empty` + `db execute`.
  - Os helpers ficam em `src/test/helpers.ts`: `resetDb`, `createTestUser(role)` e `login(app, email)`, que devolve o cookie assinado.
  - Segredos de teste (`BETTER_AUTH_SECRET`, `CREDENTIALS_ENCRYPTION_KEY`) são gerados a cada execução.
  - Sem `TEST_DATABASE_URL`, o projeto é pulado com aviso. Um nome que não termine em `_test`, ou igual ao `DATABASE_URL`, aborta antes de conectar.

## Estrutura

```
src/
├── index.ts          # bootstrap: buildApp + startServer
├── app.ts            # createApp (Fastify + zod, swagger, cors, scalar, multipart, errorHandler, hook BigInt) e buildApp (+ rotas, sem listen)
├── server.ts         # listen em 0.0.0.0:PORT (padrão 3005)
├── config/env.ts     # schema zod de env (PORT, HOST, CORS_ORIGINS) — sem uso
├── plugins/          # cors.ts, swagger.ts, apiReference.ts, errorHandler.ts
├── middlewares/auth.middleares.ts   # requireAuth, requireAdmin, requireSuperAdmin
├── routes/           # um arquivo por domínio; index.ts registra tudo sob /api
├── controllers/      # leem req, chamam services e formatam a resposta
├── services/         # regras de negócio e Prisma
├── validators/       # schemas zod (entrada e resposta) + tipos inferidos
├── lib/              # auth.ts, db.ts, audit.ts, avatar-storage.ts, ip-utils.ts, reports/
├── utils/            # AppError, generateIpsFromCidr, ipToInt, sanitize, serealizeBigInt
├── types/            # fastify.d.ts (req.user), report.ts, computer-specs.ts
└── scripts/backfillIpAddressInt.ts
prisma/
├── schema.prisma
├── seed.ts, computer-options.seed.ts
prisma.config.ts      # aponta para prisma/migrations (pasta inexistente, M10)
uploads/avatars/      # fotos de perfil (ignorado no Git) — não apagar
```

Camadas: **route** (schema + preHandler) → **controller** → **service** → Prisma. Algumas rotas (`switch`, `access-point`) usam `app.withTypeProvider<ZodTypeProvider>()` com `typeApp.get(...)`, e as demais usam `app.route({...})`.

## Banco de dados (`prisma/schema.prisma`)

### Rede

| Model | Campos principais | Relações |
|---|---|---|
| `Network` | `networkAddress` (único), `addressInt` BigInt, `cidr`, `vlanTag` (único), `type` (`NetworkType`) | `ips[]` |
| `IpAddress` | `address` / `addressInt` (únicos), `status` (`AVAILABLE`, `IN_USE`, `RESERVED`), `reservationReason` e `reservedAt` (preenchidos só na reserva) | `network` (cascade), `asset?` |

### Ativos

| Model | Campos principais | Relações |
|---|---|---|
| `Asset` | `type` (`AssetType`), `patrimony` (único), `ipId` (único), `switchPort` | `department?`, `location?` (SetNull), `ip?`, `connectedToSwitch?`, especialização 1:1 |
| `Computer` | `username`, `hostname`, `anydesk`, `mac`, `memory` | `processor?`, `disk?`, `operatingSystem?` |
| `Switch` | `id` = `asset.id`, `hostname`, `model`, `vendor`, `totalPorts`, `mac` | `connectedAssets[]` |
| `AccessPoint` | `name`, `model`, `ssid`, `wifiPassword` e `adminPassword` (cifradas, `enc:v1:...`, `lib/secret-crypto.ts`), `adminUsername`, `firmwareVersion` | `asset` |
| `Printer` / `Camera` / `Phone` | `model`, `serial`, `mac`, `channel`, `phoneNumber`... | `asset` (cascade) |
| `Processor` / `OperatingSystem` / `Disk` | `name` (único) | catálogo para `Computer` |

### Organização

| Model | Campos principais | Relações |
|---|---|---|
| `Department` | `name` (único) | `assets[]` |
| `Location` | `name` (único), `building`, `floor`, `room` | `assets[]` |

### Auditoria e usuários

| Model | Campos principais | Relações |
|---|---|---|
| `AuditLog` (`audit_log`) | `action` (`AuditAction`), `entity` (texto: `ASSET`, `NETWORK`, `IpAddress`, `USER`...), `entityId`, `details` Json | `user` (**cascade**, M11) |
| `User` (`user`) | `email` (único), `image`, `role` (`UserRole`), `isActive`, `deletedAt` (exclusão por anonimização) | `accounts`, `sessions`, `auditLogs` |
| `UserInvitation` (`user_invitation`) | `email`, `role`, `tokenHash` (único), `expiresAt`, `status`, `invitedBy` | — |
| `Session` / `Account` / `Verification` | tabelas do Better Auth; `Account.password` guarda o hash | |

### Enums

| Enum | Valores |
|---|---|
| `NetworkType` | `GENERAL_DATA`, `CAMERA_VLAN`, `SWITCH_MGMT`, `WIFI_MGMT` |
| `AssetType` | `COMPUTER`, `PRINTER`, `PHONE`, `SWITCH`, `ACCESS_POINT`, `CAMERA`, `OTHER` |
| `UserRole` | `SUPERADM`, `ADMIN`, `USER`, `CAM_OPERATOR` |
| `AuditAction` | `CREATE`, `UPDATE`, `DELETE`, `LOGIN`, `LOGOUT`, `VIEW_SECRET` (revelou senha de AP) |
| `InvitationStatus` | `PENDING`, `ACCEPTED`, `EXPIRED`, `REVOKED` |

As tabelas de domínio usam o nome padrão do Prisma (`"Network"`, `"IpAddress"`...); as de auth e auditoria são mapeadas em minúsculas.

### Migrations

Não existem. O banco é sincronizado com `prisma db push` (M10). Para gerar o cliente: `npx prisma generate`. O seed fica em `prisma/seed.ts`, configurado em `prisma.config.ts`.

### Regras de negócio relevantes

- **Rede:** `POST /networks` gera todos os IPs da faixa (`utils/generateIpsFromCidr.ts`). O CIDR mínimo é /20, ou seja, no máximo 4096 IPs.
- **Alocação de IP:** `assets.service.ts` valida se a VLAN da rede é compatível com o tipo do ativo:
  - `CAMERA` → `CAMERA_VLAN`;
  - `SWITCH` → `SWITCH_MGMT`;
  - `ACCESS_POINT` → `WIFI_MGMT`;
  - os demais → `GENERAL_DATA`.

  O IP é travado com `updateMany({ status: "AVAILABLE" })` → `IN_USE` dentro da transação.
- **Auditoria:** `lib/audit.ts#createAuditLog({ ..., tx? })`. Há uma segunda implementação em `lib/ip-utils.ts`, que não aceita `tx` e engole os erros (A4/A5).
- **Formato de `details`:** `{ type, createdData }` na criação, `{ before, after }` na edição, `{ email, ipAddress, userAgent }` no login e no logout. O filtro por "entidade" no front resolve os subtipos de ativo por `details.type` (`back:src/services/audit.service.ts:26-40`).

## Autenticação e autorização

- **`lib/auth.ts`** (Better Auth):
  - `baseURL = BETTER_AUTH_URL`;
  - `trustedOrigins` fixo (`localhost:3000` e `127.0.0.1:3000`);
  - `emailAndPassword` com `disableSignUp: true` (contas só pelo convite);
  - `cookiePrefix: "better-auth"`;
  - `crossSubDomainCookies.enabled`;
  - hooks que gravam `LOGIN` e `LOGOUT` na auditoria.
- **`routes/auth.ts`:** repassa `/api/auth/*` (GET e POST) para `auth.handler`, montando um `Request` web a partir da requisição do Fastify.
- **Middlewares:**
  - `requireAuth` usa `auth.api.getSession`, lê `role` e `isActive` do banco a cada requisição e preenche `req.user` (com `role`) e `req.session`. Usuário inativo recebe 401, e as sessões que sobraram são apagadas.
  - `requirePermission(recurso, ação)` aplica a matriz de `lib/permissions.ts`; `requireRole(...roles)` fica para casos fora dela. `requireAdmin` e `requireSuperAdmin` são atalhos de `requireRole`.
  - Ativos: `lib/asset-access.ts` (`assertAssetAccess`, `assetVisibilityWhere`, `hideInvisibleAsset`). Ver [permissoes.md](./permissoes.md#7-situação-atual-implementado).
  - Switch e AP: `lib/asset-select.ts`, com select explícito por role, `sanitizeAsset` e `auditSnapshot`.
  - IPs: `lib/network-scope.ts` (`requireNetworkScope`, `ipScopeWhere`, `assertNetworkInScope`). Ver [permissoes.md](./permissoes.md#8-alteração-de-27102026-switchesaps-e-visão-geral-de-ips).
  - Senhas de AP: `lib/secret-crypto.ts` (AES-256-GCM, `CREDENTIALS_ENCRYPTION_KEY`). A migração dos dados antigos é `pnpm encrypt:ap-secrets [--dry-run]`.
- **Login:** o hook `before` de `/sign-in` recusa usuários inativos (403).
- **Chamadas manuais à API:**
  - Mande o valor **assinado** do cookie, tal como vem no `Set-Cookie`. O token cru retorna 401.
  - Inclua `Origin: http://localhost:3000` no login.
- **Encapsulamento de hooks:** `computer-options` usa `addHook("preHandler", requireAuth)` dentro de `app.register(...)`, para o hook não vazar para outras rotas (`routes/index.ts:28`).

## Upload de avatar

- **`lib/avatar-storage.ts`:**
  - `UPLOADS_DIR` (padrão `uploads`) + `/avatars`.
  - O nome do arquivo é `<uuid>.webp`, gerado pelo servidor e validado por regex.
  - A gravação é atômica: `.tmp` com a flag `wx`, depois `rename`.
  - `deleteAvatar` só apaga caminhos gerenciados por esse módulo.
- **`services/avatar.service.ts#processAvatar`:**
  - `file-type` (JPG/PNG/WebP) → 415.
  - `sharp` com `limitInputPixels` 40M e `failOn: "error"` → 422.
  - Dimensões de 64 a 8000 px.
  - Recorte dentro dos limites → 400.
  - Saída: `rotate().extract().resize(256,256).webp({quality:82})`, sem EXIF e GPS.
- **Ordem segura:**
  1. processa;
  2. grava o arquivo novo;
  3. atualiza o banco (se falhar, apaga o arquivo novo);
  4. só então apaga o antigo.

  No aceite de convite, se a criação da conta falhar, o arquivo novo é removido.
- **Limites do multipart** (`app.ts`): `fileSize` 5 MB, 1 arquivo, 8 campos de até 1024 bytes, 9 partes.

## Integrações

| Integração | Onde | Observação |
|---|---|---|
| SMTP (nodemailer) | `services/email.service.ts` | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM`. Se o envio do convite falhar, o convite é revogado e a API responde 503 |
| Link do convite | `services/user.service.ts:185` | `FRONTEND_URL/accept-invite?token=<token cru>`. O banco guarda só o hash, e o convite vale 48 h |

Não há outras integrações externas, como fila, cache ou storage em nuvem.

## Tratamento de erros

- **`plugins/errorHandler.ts`:** trata `AppError`, a validação do zod, os erros conhecidos do Prisma, os de validação, inicialização e erros desconhecidos, e um fallback 500.
- **Exceção ao padrão:** o módulo de usuários lança objetos `{ statusCode, message }`, tratados por `handleError` em `controllers/users.controller.ts`.
- **Body vazio:** `FST_ERR_CTP_EMPTY_JSON_BODY` (DELETE com `Content-Type` JSON e sem corpo) responde **200**. Por isso o front envia `Content-Type: undefined` nos DELETE.
