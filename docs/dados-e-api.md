# Dados e API

## Endpoints do backend

- **Base:** `NEXT_PUBLIC_API_URL`, em dev `http://localhost:3005`. Todas as rotas abaixo usam o prefixo `/api`, registrado em `back:src/index.ts:17`.
- **Formato de resposta:** `{ data, error }`; as listagens incluem `meta: { total, page, limit, totalPages }`.
- **Erros:** passam por `back:src/plugins/errorHandler.ts`.
  - `AppError` → status próprio.
  - Zod → 400.
  - Prisma P2002 → 400/409.
  - P2025 → 404.
  - P2003 → 400.
- **Validação:** todas as rotas, exceto as de multipart, declaram schemas zod (`body`, `querystring`, `params`, `response`) em `back:src/validators/*`.

**Auth:** **A** = `requireAuth` (sessão válida e usuário ativo) · **ADM** = só SUPERADM e ADMIN · **SUP** = só SUPERADM · **—** = pública.

Toda rota autenticada também passa por `requirePermission(recurso, ação)`, conforme a matriz de [permissoes.md](./permissoes.md). As colunas abaixo resumem o efeito; nas rotas de ativos, o tipo do ativo também conta (câmeras: USER sem acesso, ADMIN só leitura).

### Autenticação (Better Auth)

| Método | Rota | Auth | Observação |
|---|---|---|---|
| GET/POST | `/api/auth/*` | — | Repassa a requisição ao `auth.handler` (`back:src/routes/auth.ts`). O front usa `sign-in/email`, `get-session`, `sign-out` e `change-password`. O `sign-up/email` está desligado (`disableSignUp`), e o `sign-in` recusa usuários inativos (403) |

### Usuários (`back:src/routes/user.ts`)

| Método | Rota | Auth | Entrada | Saída |
|---|---|---|---|---|
| GET | `/users` | A+SUP | query `page`, `limit`, `search` | lista de usuários + `meta` |
| POST | `/users/invitations` | A+SUP | `{ email, role }` | convite criado (e-mail enviado, 503 se o SMTP falhar) |
| PATCH | `/users/:id/role` | A+SUP | `{ role }` | usuário. Bloqueia alterar a própria função e rebaixar o último SUPERADM |
| DELETE | `/users/:id` | A+SUP | — | desativação lógica + revogação das sessões |
| PATCH | `/users/:id/reactivate` | A+SUP | — | reativa um usuário inativo |
| DELETE | `/users/:id/permanent` | A+SUP | — | exclusão por anonimização (dados pessoais, senha e sessões removidos; auditoria preservada) |
| GET | `/users/me` | A | — | perfil (`id`, `name`, `email`, `image`, `role`, `isActive`, `createdAt`) |
| PATCH | `/users/me` | A | `{ name }` | perfil |
| GET | `/users/invitations/validate` | — | query `token` | `{ email, role, expiresAt }` |
| POST | `/users/invitations/accept` | — | JSON `{ token, name, password }`, ou multipart com `file` + `cropX`/`cropY`/`cropSize` opcionais | 201 usuário criado |
| PUT | `/users/me/avatar` | A | multipart: `cropX`, `cropY`, `cropSize`, `file` (JPG/PNG/WebP ≤ 5 MB) | `{ image }` |
| DELETE | `/users/me/avatar` | A | — | `{ image: null }` (idempotente) |
| GET | `/avatars/:file` | — | `<uuid>.webp` | imagem WebP (`nosniff`, cache imutável) |

### Infraestrutura

| Método | Rota | Auth | Entrada |
|---|---|---|---|
| POST | `/networks` | A+ADM | `{ networkAddress, cidr (20–32), vlanTag?, type }`. Gera todos os IPs da faixa |
| GET | `/networks` | A | query (paginação, busca, tipo). USER: sem a VLAN de câmeras. O `_count` de IPs em uso só vem para quem vê o uso da rede (`ipUsage`) |
| GET | `/networks/available-ips` | A | query `type`, `limit`: IPs livres para o cadastro de ativo. USER com `type=CAMERA_VLAN`: 403 |
| GET | `/networks/:id` | A | — |
| PATCH | `/networks/:id` | A+ADM | campos da rede |
| DELETE | `/networks/:id` | A+ADM | — (os IPs são apagados em cascata) |
| POST / GET | `/departments` | A | `{ name }` / query |
| GET / PUT / DELETE | `/departments/:id` | A (DELETE: ADM) | — / `{ name }` / — |
| POST / GET | `/locations` | A | `{ name, building?, floor?, room?, notes? }` / query |
| GET / PUT / DELETE | `/locations/:id` | A (DELETE: ADM) | idem |

### Endereços IP (`back:src/routes/ipaddress.ts`)

Escopo por VLAN (`ipNetworkScope`, ver [permissoes.md](./permissoes.md)): **todas** = SUPERADM e ADMIN; **câmeras** = CAM_OPERATOR, só `CAMERA_VLAN`. Rede pedida fora do escopo responde 403.

| Método | Rota | Permissão | Observação |
|---|---|---|---|
| GET | `/ip-addresses` | `ipUsage` (sem USER) | listagem filtrada (rede, status), com o ativo dono. CAM_OPERATOR: só câmeras |
| GET | `/ip-addresses/stats` | `ipUsage` | totais por status, no escopo |
| GET | `/ip-addresses/overview-stats` | `ipUsage` | uso por rede (Visão Geral), no escopo |
| GET | `/ip-addresses/available` | `ipUsage` | disponibilidade detalhada de uma rede, paginada |
| GET | `/ip-addresses/recent` | `ipUsage` | últimos IPs, no escopo |
| GET | `/ip-addresses/verify` | `ipFree` (todos) | query `address`, `expectedType`. Sem `ipUsage` na rede, responde só "livre" ou "indisponível"; IP da VLAN de câmeras é "indisponível" para o USER |
| POST | `/ip-addresses/find-available` | `ipFree` (todos) | `{ networkId, quantity (1–254) }`, só endereços. USER: VLAN de câmeras responde 404 |
| POST | `/ip-addresses/reserve` | `ipReservations.create` | `{ networkId, ipAddresses[] (até 254), reason? }`. Os IPs precisam estar na faixa da rede; IP em uso não é sobrescrito |
| PATCH | `/ip-addresses/reserve/:id` | `ipReservations.update` | `{ reason?, newAddress? }`: edita o motivo e/ou move para outro IP livre. Valida a VLAN de origem e a de destino |
| DELETE | `/ip-addresses/reserve/:id` | `ipReservations.delete` | cancela a reserva |

### Ativos

| Método | Rota | Auth | Observação |
|---|---|---|---|
| POST | `/assets` | A | cria um ativo de qualquer `type` com a especialização (computer, printer, phone, camera) e aloca o IP com trava atômica |
| GET | `/assets` | A | query `type`, `page`, `limit` (**sem máximo, M8**), `search`, filtros |
| GET / DELETE | `/assets/:id` | A | detalhe / exclusão (libera o IP) |
| PATCH | `/assets/:id/connectivity` | A | IP e porta do switch |
| PATCH | `/assets/:id/allocation` | A | departamento e localidade |
| PUT | `/assets/:id/specs/{computer,printer,phone,camera,switch}` | A | dados técnicos de cada tipo |
| POST / GET | `/switches` | `networkDevices` create / view | cria (asset + switch) / lista. Sem `viewSecrets`, a lista vem sem MAC, observações e IP de gerência, e a busca não casa por IP nem MAC |
| GET / PATCH / DELETE | `/switches/:id` | `networkDevices` viewDetails / update / delete | só SUPERADM e ADMIN |
| POST / GET | `/access-points` | `networkDevices` create / view | idem. **As senhas nunca saem**: só `hasWifiPassword` e `hasAdminPassword` (SUPERADM e ADMIN). Gravadas cifradas (AES-256-GCM) |
| GET / PATCH / DELETE | `/access-points/:id` | `networkDevices` viewDetails / update / delete | a edição registra na auditoria quais credenciais mudaram, sem o valor |
| POST | `/access-points/:id/secrets` | `networkDevices.viewSecrets` | devolve as senhas decifradas e grava `VIEW_SECRET` na auditoria (`Cache-Control: no-store`) |
| GET / POST | `/options/processors` | A (hook) | catálogo de processadores |
| GET / POST | `/options/operating-systems` | A (hook) | catálogo de sistemas operacionais |
| GET | `/options/disks` | A (hook) | catálogo de discos. Não existe `POST` (o front chama em código morto, M4) |

### Dashboards, relatórios e auditoria

| Método | Rota | Auth | Observação |
|---|---|---|---|
| GET | `/dashboard/stats` | A | totais de ativos (página `/assets`) |
| GET | `/infra-dashboard` | A | indicadores de infraestrutura. Uso de IPs no escopo de `ipUsage`: USER recebe `totalIpsInUse: null` e `networksUsage: []`; CAM_OPERATOR, só a VLAN de câmeras |
| GET | `/reports/audit-dashboard` | A+SUP | query `period` (`7d`...): resumo, logs recentes, top usuários |
| POST | `/reports/assets` | A+ADM; CAM_OPERATOR só com tipos = `["CAMERA"]` | relatório dinâmico de ativos (filtros por tipo, alocação, rede, hardware) |
| GET | `/audit-logs` | A+SUP | query `page`, `limit`, `userId`, `action`, `entity`, `startDate`, `endDate`, `search` |

### Fora do prefixo `/api`

| Rota | Observação |
|---|---|
| `/api/ping` | health check `{ pong: true }` |
| `/docs` | Swagger UI, só com `ENABLE_API_DOCS=true` (senão 404) |
| `/reference` | Scalar, só com `ENABLE_API_DOCS=true` |
| `/swagger.json` | OpenAPI, só com `ENABLE_API_DOCS=true` |
| `/api/auth/reference`, `/api/auth/open-api/generate-schema` | OpenAPI do Better Auth, só com `ENABLE_API_DOCS=true` |

## Como o front chama a API

- **`src/lib/server-api.ts`:** `getServerApi()` cria um axios com `baseURL: NEXT_PUBLIC_API_URL` e repassa o cookie `better-auth.session_token` da requisição atual. Só funciona no servidor, porque usa `cookies()` de `next/headers`.
- **`src/lib/auth-client.ts`:** `authClient` (better-auth/react) roda no navegador. Usado para login, sessão (`useSession`), logout e troca de senha.
- **Multipart:** como o axios tem `Content-Type: application/json` por padrão, o upload de avatar envia `"Content-Type": "multipart/form-data"` explicitamente (`src/actions/users.ts`).
- **Erros:** `extractApiError` (`src/services/user.ts:18`) converte erros do axios em mensagens. Outros services ainda tratam `error: any` cada um a seu modo.

### Services (leitura, usados por Server Components)

| Arquivo | Funções | Endpoints |
|---|---|---|
| `services/user.ts` | `listUsers`, `getMyProfile`, `getInvitation` | `/users`, `/users/me`, `/users/invitations/validate` |
| `services/assets.ts` (`"use server"`) | `getAssets`, `getAssetById`, `deleteAssetAction`, `getAssetOptionsAction` | `/assets`, `/assets/:id` |
| `services/switches.ts` | `getSwitches`, `getSwitchById` | `/switches` |
| `services/access-points.ts` | `getAccessPoints`, `getAccessPointById` | `/access-points` |
| `services/department.ts` | `getDepartments`, `getDepartmentById` | `/departments` |
| `services/location.ts` | `getLocations`, `getLocationById` | `/locations` |
| `services/network.ts` | `getNetworks`, `getNetworkById` | `/networks` |
| `services/ip-address.ts` | `getIpAddresses`, `getStats`, `verifyIp`, `getOverviewStats`, `getAvailableIps`, `getRecentIps`, `findAvailableIps` | `/ip-addresses/*` |
| `services/dashboard-service.ts` | `getExecutiveDashboard` | `/infra-dashboard` + `/reports/audit-dashboard` |
| `services/reports-audit.service.ts` | `fetchReportsAuditDashboardData` | `/reports/audit-dashboard` |
| `services/reports.service.ts` | `getAssetReportAction` | `POST /reports/assets` |
| `services/audit.service.ts` | `fetchAuditLogs` | `/audit-logs` |
| `services/auth.ts` | `getMe` (**sem uso**, M3) | `/auth/account-info` |

### Server Actions (`src/actions/*`, `"use server"`)

| Arquivo | Actions | `revalidatePath` |
|---|---|---|
| `users.ts` | `inviteUserAction`, `updateUserRoleAction`, `deactivateUserAction`, `updateMyProfileAction`, `acceptInvitationAction`, `updateMyAvatarAction`, `removeMyAvatarAction` | `/users`, `/settings/profile`, `/` (layout) |
| `networks.ts` | `upsertNetworkAction`, `deleteNetworkAction`, `getAvailableIpsAction` | `/infra/networks` |
| `departments.ts` / `locations.ts` | `upsert*Action`, `delete*Action` | `/infra/departments`, `/infra/locations` |
| `ip-addresses.ts` | `reserveIpsAction`, `cancelIpReservationAction`, `findAvailableIpsAction`, `getAvailableIpsAction`, `getReservedIpsAction`, `getIpStatsAction`, `verifyIpAction`, `getOverviewStatsAction`, `getRecentIpsAction` | `/dashboard/overview`, `/infra/networks` (e duas rotas inexistentes: `/dashboard/ip-addresses` e `/infra/ip-addresses`) |
| `switches.ts` / `access-points.ts` | `create*`, `update*`, `delete*` | `/assets/switches`, `/assets/access-points` |
| `assets/*.actions.ts` | `create{Computer,Printer,Phone,Camera}AssetAction`, `update*SpecsAction`, `updateAssetConnectivityAction`, `updateAssetAllocationAction`, `findIpByAddressAction`, `searchAssetsAction` | `revalidateAssetPaths` (`assets/helpers.ts`) |
| `options.ts` | `get/create` para processadores, sistemas e discos | — |
| `asset-dashboard.action.ts`, `infra-dashboard.ts`, `reports-audit-dashboard.action.ts` | leituras de dashboard | — |
| `auth.ts` | `loginAction` (**sem uso**, M3) | — |

`getAvailableIpsAction` existe duas vezes:
- em `actions/ip-addresses.ts`, usada pela aba "IPs disponíveis";
- em `actions/networks.ts`, usada por `hooks/use-availableIps.ts`.

## Cache e revalidação

- Não há `fetch` nativo, `"use cache"` nem `unstable_cache`. Todas as leituras usam axios e são dinâmicas, porque dependem de `cookies()`.
- `export const revalidate = 0` em `dashboard/page.tsx` e `dashboard/overview/page.tsx`.
- Depois das mutações, as actions usam `revalidatePath` e, nos casos de perfil e avatar, `router.refresh()` + `authClient.useSession().refetch()` no cliente.
- `next.config.ts`: `experimental.serverActions.bodySizeLimit = "6mb"` (upload de avatar) e `optimizePackageImports` (lucide, date-fns).
