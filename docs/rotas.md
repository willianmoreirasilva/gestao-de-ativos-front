# Rotas do frontend (`src/app`)

## Como a autenticação funciona nas rotas

**Auth:**
- O `src/proxy.ts` exige o cookie `better-auth.session_token` em `/dashboard`, `/assets`, `/infra`, `/reports-audit`, `/settings` e `/users`, incluindo as subrotas.
- O `PainelShell` também redireciona no cliente quando não há sessão.
- O controle por role está em `RequirePermission` (`src/components/require-permission.tsx`), conforme a matriz de [permissoes.md](./permissoes.md). Quem não tem permissão vê "Acesso restrito". A autorização real é do backend.

**Papel:** o que a rota exige além do login. "API" indica que só o backend verifica o papel.

**Tipo:** **S** = Server Component, **C** = Client Component (`"use client"` na página).

## Públicas

| Caminho | Arquivo | Tipo | Observação |
|---|---|---|---|
| `/` | `src/app/page.tsx` | S | `redirect("/dashboard")` |
| `/login` | `src/app/login/page.tsx` | C | Login com `authClient.signIn.email`. Lê `?convite=aceito&email=` |
| `/accept-invite` | `src/app/accept-invite/page.tsx` | S | Valida `?token=` (`userService.getInvitation`) e mostra `AcceptInviteForm` (C) |

## Painel: route group `(painel)`

Layout: `src/app/(painel)/layout.tsx`. Busca `GET /api/users/me` e envolve as páginas no `PainelShell` (sidebar + `main`).

### Dashboard

| Caminho | Arquivo | Tipo | Papel | Dados |
|---|---|---|---|---|
| `/dashboard` | `(painel)/dashboard/page.tsx` | S | — | `dashboardService.getExecutiveDashboard`: `/api/infra-dashboard` + `/api/dashboard/stats` e, só para SUPERADM, `/api/reports/audit-dashboard`. `revalidate = 0` |
| `/dashboard/overview` | `(painel)/dashboard/overview/page.tsx` | S | — (reservas: sem USER) | `ipAddressService.getOverviewStats`. A área de reservas não aparece para o USER; para o CAM_OPERATOR, só as redes `CAMERA_VLAN` |

### Infraestrutura

| Caminho | Arquivo | Tipo | Papel | Dados |
|---|---|---|---|---|
| `/infra` | `(painel)/infra/page.tsx` | S | — | Atalhos dos módulos |
| `/infra/networks` | `infra/networks/page.tsx` | S | — | `networkService.getNetworks` |
| `/infra/networks/add` | `infra/networks/add/page.tsx` (+ `layout.tsx`) | S | SUPERADM, ADMIN | `NetworkForm` |
| `/infra/networks/edit/[id]` | `infra/networks/edit/[id]/page.tsx` (+ `edit/layout.tsx`) | S | SUPERADM, ADMIN | `networkService.getNetworkById` |
| `/infra/departments` | `infra/departments/page.tsx` | S | — | `departmentService.getDepartments` |
| `/infra/departments/add` | `infra/departments/add/page.tsx` | S | — | `DepartmentForm` |
| `/infra/departments/[id]` | `infra/departments/[id]/page.tsx` | S | — | `departmentService.getDepartmentById` (edição) |
| `/infra/locations` | `infra/locations/page.tsx` | S | — | `locationService.getLocations` |
| `/infra/locations/add` | `infra/locations/add/page.tsx` | S | — | `LocationForm` |
| `/infra/locations/edit/[id]` | `infra/locations/edit/[id]/page.tsx` | S | — | `locationService.getLocationById` |

As rotas de edição não seguem um padrão único: departamentos usa `[id]`, e localidades e redes usam `edit/[id]`.

### Ativos

O padrão se repete para cada tipo `<tipo>`: `computers`, `printers`, `phones`, `cameras`, `switches` e `access-points`.

| Caminho | Arquivo | Tipo | Dados |
|---|---|---|---|
| `/assets` | `(painel)/assets/page.tsx` | S | Visão geral dos ativos: `getAssetDashboardData` (`actions/asset-dashboard.action.ts` → `GET /api/dashboard/stats`) |
| `/assets/<tipo>` | `assets/<tipo>/page.tsx` | S | Listagem paginada: `getAssets({ type })`, ou `switchService` / `accessPointService` |
| `/assets/<tipo>/add` | `assets/<tipo>/add/page.tsx` | **C** | Formulário de criação: `create*Action` e `getAssetOptionsAction` (departamentos, localidades, switches) |
| `/assets/<tipo>/[id]` | `assets/<tipo>/[id]/page.tsx` | S | Detalhe e edição em cartões (técnico, alocação, conectividade). Busca o ativo e as opções de departamento, localidade e switch |

**Câmeras:** `assets/cameras/layout.tsx` bloqueia o USER e `assets/cameras/add/layout.tsx` bloqueia quem não cria câmeras (ADMIN). Na listagem, os botões de criar e excluir só aparecem para quem pode, e no detalhe o ADMIN vê os cartões sem edição.

### Relatórios e auditoria

| Caminho | Arquivo | Tipo | Papel | Dados |
|---|---|---|---|---|
| `/reports-audit` | `(painel)/reports-audit/page.tsx` | S | SUPERADM | `getReportsAuditDashboardAction` → `/api/reports/audit-dashboard` |
| `/reports-audit/reports` | `reports-audit/reports/page.tsx` | S | SUPERADM, ADMIN, CAM_OPERATOR (só câmeras) | Construtor de relatórios: `getAssetReportAction` (`POST /api/reports/assets`) e opções de filtro |
| `/reports-audit/audit-logs` | `reports-audit/audit-logs/page.tsx` | S | SUPERADM | `fetchAuditLogs` → `/api/audit-logs`, com filtros pela URL (`page`, `limit`, `action`, `entity`, `startDate`, `endDate`, `search`) |

### Usuários e perfil

| Caminho | Arquivo | Tipo | Papel | Dados |
|---|---|---|---|---|
| `/users` | `(painel)/users/page.tsx` (+ `loading.tsx`) | S | SUPERADM (página e API) | `userService.getMyProfile` + `listUsers`. Convite, troca de função, desativação, reativação e exclusão em `_components/` |
| `/settings/profile` | `(painel)/settings/profile/page.tsx` (+ `loading.tsx`) | S | — | "Minha Conta": dados, avatar (`ProfileAvatarCard`) e troca de senha |

## Arquivos especiais

| Arquivo | Onde existe |
|---|---|
| `layout.tsx` | `src/app/layout.tsx` (raiz: fonte Inter, `ThemeProvider`, `Toaster`, `metadata.title = "NetManager"`) e `src/app/(painel)/layout.tsx` |
| `loading.tsx` | só `users/` e `settings/profile/` |
| `error.tsx` / `not-found.tsx` | **nenhum** (B5) |
| `proxy.ts` | `src/proxy.ts`. No Next 16 substitui o `middleware.ts` |
