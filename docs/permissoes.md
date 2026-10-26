# Permissões por role

Este documento traz a matriz oficial, o diagnóstico feito antes da implementação (seções 2 a 4) e a situação atual (seção 7). O controle de acesso foi implementado em 26/10/2026, na branch `find-errors`.

**Para quem vai mexer no código:** toda rota, action ou tela nova precisa seguir a matriz da seção 1, que está codificada em `back:src/lib/permissions.ts` e na cópia idêntica `src/lib/permissions.ts`. Veja a seção 7 para os helpers.

Convenções:
- `back:` indica um caminho no repositório `../sysip-backend-2.0`; os outros caminhos são deste repositório (front).
- O código chama a role `SUPERADMIN` da matriz de `SUPERADM` (enum `UserRole`).

## 1. Matriz de permissões oficial

Roles: SUPERADMIN, ADMIN, CAM_OPERATOR, USER
Legenda: ✅ permitido · ❌ negado

### Usuários do sistema
| Ação                                  | SUPERADMIN | ADMIN | CAM_OPERATOR | USER |
|---------------------------------------|:-:|:-:|:-:|:-:|
| Listar / visualizar usuários          | ✅ | ❌ | ❌ | ❌ |
| Convidar usuário                      | ✅ | ❌ | ❌ | ❌ |
| Alterar role                          | ✅ | ❌ | ❌ | ❌ |
| Inativar / reativar                   | ✅ | ❌ | ❌ | ❌ |
| Excluir usuário                       | ✅ | ❌ | ❌ | ❌ |
| Editar o próprio perfil               | ✅ | ✅ | ✅ | ✅ |

### Redes
| Ação       | SUPERADMIN | ADMIN | CAM_OPERATOR | USER |
|------------|:-:|:-:|:-:|:-:|
| Visualizar | ✅ | ✅ | ✅ | ✅ |
| Criar      | ✅ | ✅ | ❌ | ❌ |
| Editar     | ✅ | ✅ | ❌ | ❌ |
| Excluir    | ✅ | ✅ | ❌ | ❌ |

### Ativos (exceto câmeras)
| Ação       | SUPERADMIN | ADMIN | CAM_OPERATOR | USER |
|------------|:-:|:-:|:-:|:-:|
| Visualizar | ✅ | ✅ | ✅ | ✅ |
| Criar      | ✅ | ✅ | ✅ | ✅ |
| Editar     | ✅ | ✅ | ✅ | ✅ |
| Excluir    | ✅ | ✅ | ✅ | ✅ |

O USER é o principal usuário do sistema e tem CRUD total em ativos, inclusive nos criados por outras pessoas. A exceção são as câmeras.

### Ativos do tipo CÂMERA
| Ação       | SUPERADMIN | ADMIN | CAM_OPERATOR | USER |
|------------|:-:|:-:|:-:|:-:|
| Visualizar | ✅ | ✅ | ✅ | ❌ |
| Criar      | ✅ | ❌ | ✅ | ❌ |
| Editar     | ✅ | ❌ | ✅ | ❌ |
| Excluir    | ✅ | ❌ | ✅ | ❌ |

**IMPORTANTE:** o USER não tem NENHUM acesso a câmeras.
- Elas não podem aparecer para ele em nenhum destes lugares:
  - listagens, buscas, filtros e autocomplete;
  - contadores e totais do dashboard, gráficos e exportações;
  - relações (por exemplo, os ativos de um local);
  - acesso direto via URL ou API.
- Nesses casos, a resposta deve ser 404 ou 403.
- O filtro tem que ser aplicado no backend, na query.

### Departamentos e Locais
| Ação       | SUPERADMIN | ADMIN | CAM_OPERATOR | USER |
|------------|:-:|:-:|:-:|:-:|
| Visualizar | ✅ | ✅ | ✅ | ✅ |
| Criar      | ✅ | ✅ | ✅ | ✅ |
| Editar     | ✅ | ✅ | ✅ | ✅ |
| Excluir    | ✅ | ✅ | ❌ | ❌ |

### Relatórios
| Ação                            | SUPERADMIN | ADMIN | CAM_OPERATOR | USER |
|---------------------------------|:-:|:-:|:-:|:-:|
| Relatórios gerais (ativos etc.) | ✅ | ✅ | ❌ | ❌ |
| Relatórios de câmeras           | ✅ | ✅ | ✅ | ❌ |

### Logs de auditoria
| Ação       | SUPERADMIN | ADMIN | CAM_OPERATOR | USER |
|------------|:-:|:-:|:-:|:-:|
| Visualizar | ✅ | ❌ | ❌ | ❌ |

---

## 2. Como funcionava antes (diagnóstico)

### Autenticação e role
- **Provider:** Better Auth 1.4 no backend (`back:src/lib/auth.ts`). O login é por e-mail e senha, e a sessão fica no cookie `better-auth.session_token`.
- **Onde a role fica:** `User.role`, enum `UserRole` (`SUPERADM`, `ADMIN`, `USER`, `CAM_OPERATOR`), em `back:prisma/schema.prisma`, junto com `User.isActive`.
- **A role não vai para a sessão:** o Better Auth não declara `role` em `additionalFields`.
  - `requireAdmin` (ADMIN ou SUPERADM) e `requireSuperAdmin` buscam a role no banco a cada requisição (`back:src/middlewares/auth.middleares.ts:34-98`).
  - O `requireAuth` só valida a sessão (`:10-32`).
- **Front:**
  - `src/proxy.ts` (equivalente ao `middleware.ts` no Next 16) só verifica se o cookie existe.
  - O layout `src/app/(painel)/layout.tsx` busca `GET /api/users/me` para obter a role.
- **Helpers que já existem:**
  - `src/lib/user-roles.ts`: `canManageUsers`, `canChangeRole` e `canDeactivate`; espelham `requireSuperAdmin`.
  - `src/config/sidebar-menu.ts`: `allowedRoles` por item de menu.
  - Não há um mapa central de permissões.

### Pontos de entrada
- **O front não acessa o banco diretamente.** Server Components, Server Actions e services só chamam a API com `getServerApi()` (`src/lib/server-api.ts`). Por isso, **toda a autorização efetiva está, ou precisa estar, nas rotas do backend**.
- **Checagem de role no servidor do front:** só em `/users` (`src/app/(painel)/users/page.tsx:54`). As outras páginas confiam no backend.

| Recurso | Rotas do backend | Guarda atual | Exigido pela matriz |
|---|---|---|---|
| Usuários | `GET /users`, `POST /users/invitations`, `PATCH /users/:id/role`, `DELETE /users/:id` (inativa) | `requireAuth` + `requireSuperAdmin` | ✅ igual. **Faltam reativar e excluir** |
| Próprio perfil | `GET/PATCH /users/me`, `PUT/DELETE /users/me/avatar` | `requireAuth` | ✅ igual |
| Redes, leitura | `GET /networks`, `/networks/:id`, `/networks/available-ips` | `requireAuth` | ✅ igual |
| Redes, escrita | `POST/PATCH/DELETE /networks` | `requireAuth` + `requireAdmin` | ✅ igual |
| IPs | `GET /ip-addresses/*`, `POST find-available`, `POST/DELETE reserve` | `requireAuth` | Leitura ok, mas **sem ocultar a câmera** ligada a um IP. A matriz não define quem reserva IP (ver decisões) |
| Ativos | `POST/GET /assets`, `GET/DELETE /assets/:id`, `PATCH .../connectivity` e `.../allocation`, `PUT .../specs/*` | `requireAuth` | Precisa distinguir câmera: USER sem acesso, ADMIN só leitura |
| Switches / APs | `/switches/*`, `/access-points/*` | `requireAuth` | ✅ CRUD para todos. **Falta ocultar câmeras em `connectedAssets`** |
| Catálogos | `/options/*` | `requireAuth` (hook) | ✅ (apoio aos ativos) |
| Departamentos / Locais | `POST/GET/PUT/DELETE /departments`, `/locations` | `requireAuth` | **DELETE só para SUPERADM e ADMIN** |
| Relatório de ativos | `POST /reports/assets` | `requireAuth` | Geral: SUPERADM e ADMIN. Só câmeras: + CAM_OPERATOR. USER ❌ |
| Dashboards | `GET /dashboard/stats`, `GET /infra-dashboard` | `requireAuth` | ✅, mas **os totais não podem contar câmeras para USER** |
| Painel de auditoria | `GET /reports/audit-dashboard` | `requireAuth` + `requireAdmin` | **Só SUPERADM** |
| Logs de auditoria | `GET /audit-logs` | `requireAuth` + `requireAdmin` | **Só SUPERADM** |

**Páginas do front**

| Página | Checagem no servidor do front | Exigido |
|---|---|---|
| `/users` | ✅ `canManageUsers` | SUPERADM |
| `/reports-audit` (painel) | ❌ (o back responde 403 para quem não é ADMIN) | SUPERADM |
| `/reports-audit/audit-logs` | ❌ (o 403 vira lista vazia, M2) | SUPERADM |
| `/reports-audit/reports` | ❌ | SUPERADM, ADMIN e CAM_OPERATOR (este só para câmeras) |
| `/assets/cameras/*` | ❌ (só o menu filtra) | USER ❌; ADMIN somente leitura |
| `/dashboard` | — | Todos. **Bug atual:** `src/services/dashboard-service.ts:12` chama `/reports/audit-dashboard` num `Promise.all`. Como essa rota exige ADMIN, o dashboard **inteiro** dá erro para USER e CAM_OPERATOR |

---

## 3. Checklist de precauções de segurança (antes da implementação)

| # | Item | Status | Evidência | O que falta |
|---|---|---|---|---|
| 1 | Proteção do último SUPERADMIN | 🟡 Parcial | Rebaixar: `back:src/services/user.service.ts:251-262`. Inativar: `:316-328` | A contagem (`count`) e o update **não estão na mesma transação**: duas operações simultâneas podem deixar o sistema sem SUPERADM. A exclusão de usuário não existe |
| 2 | Autoproteção | ✅ Implementado | Própria role: `user.service.ts:232`. Própria inativação: `:298` | Repetir a regra na futura exclusão |
| 3 | Revogação imediata e bloqueio de inativos | 🟡 Parcial | Inativar apaga as sessões (`user.service.ts:337`). A role é lida do banco em toda requisição, então a mudança vale na hora para as rotas com `requireAdmin`/`requireSuperAdmin` | **O inativo consegue fazer login de novo**: não há checagem de `isActive` no login (hooks de `back:src/lib/auth.ts:30-145`) nem no `requireAuth` (`auth.middleares.ts:20`). A mudança de role não revoga a sessão |
| 4 | Validação no backend em todo ponto | ❌ Não implementado | Ver a tabela de rotas na seção 2 | Pontos desprotegidos: escrita e leitura de câmeras para USER e escrita para ADMIN (`/assets*`); DELETE de departamentos e locais para CAM_OPERATOR e USER; `POST /reports/assets` para USER e CAM_OPERATOR; auditoria e painel de auditoria para ADMIN; páginas `/reports-audit/*` e `/assets/cameras/*` protegidas só pelo menu |
| 5 | Troca de tipo de ativo | ✅ Implementado* | O `type` só é definido na criação (`assets.service.ts:342`); nenhum schema de edição aceita `type`. `PUT /assets/:id/specs/camera` em um ativo que não é câmera falha no update aninhado (`assets.service.ts:788-797`) | *A regra de câmera vai depender do tipo **atual**, lido do banco em todas as rotas `/:id`, e de manter `type` imutável. Não há checagem explícita de que `specs/<tipo>` corresponde ao `asset.type` |
| 6 | Isolamento de câmeras para USER | ❌ Não implementado | Nenhum filtro por role nas queries | Listagem e busca: `assets.service.ts:872` (`listAssets`, usado também pela busca rápida). Detalhe, exclusão, connectivity e allocation: `getAssetById` e `deleteAsset`. Totais: `dashboard.service.ts:12-16` e `reports-audit-dashboard.service.ts:31-33`. Relatório: `report.service.ts:21-54`. Relações: `ipaddress.service.ts:40`, `network.service.ts:151`, `connectedAssets` em `switch.service.ts`. Contagem nas mensagens de exclusão: `department.service.ts:84`, `location.service.ts:106` |
| 7 | Convites | ✅ Implementado | Só SUPERADM (`back:src/routes/user.ts:77`). O token fica em hash, vale 48 h e passa a `EXPIRED` (`user.service.ts:57-72`). O uso é único e atômico (`updateMany` com `status: "PENDING"` dentro da transação). A role vem do convite (`role: invitation.role`, `:499`); o aceite não recebe role | ⚠️ O cadastro público do Better Auth (`/api/auth/sign-up/email`) **contorna o convite** (C1 em `problemas-encontrados.md`) |
| 8 | Escalada de privilégio | 🟡 Parcial | `PATCH /users/me` só aceita `name` (`back:src/validators/user.validator.ts:65`). O `update-user` do Better Auth não aceita `role` nem `isActive`, porque não estão em `additionalFields` | O cadastro público está aberto (C1), e o `update-user` aceita `image` livre (A1). O cadastro cria USER, então não escala para ADMIN, mas dá acesso de USER sem convite |
| 9 | Exclusão com vínculos | ✅ Implementado | Departamento: `department.service.ts:84-93`. Local: `location.service.ts:106-115`. Rede: `network.service.ts:204-212`. Todos respondem 400 quando há ativos | A mensagem informa o número de ativos, câmeras incluídas: vazamento para USER |
| 10 | Auditoria | 🟡 Parcial | Role (`user.service.ts:279`), inativação (`:344`, com before/after), convite (`:209`), exclusões (`deletedRecord`), CRUD de câmeras (`entity: "ASSET"` + `details.type`, com before/after) | **O acesso está liberado para ADMIN** (`back:src/routes/audit.routes.ts:18`, `reports-audit-dashboard.routes.ts:18`). A auditoria de switch e AP fica fora da transação (A4). Login e logout são registrados |

---

## 4. Divergências encontradas (antes da implementação)

| Recurso | Divergência |
|---|---|
| Usuários | Não existem **reativar** nem **excluir** |
| Auditoria | ADMIN lê os logs e o painel de auditoria; a matriz diz que é só SUPERADM |
| Câmeras: USER | Vê, cria, edita e exclui câmeras; aparecem em totais, relatórios, relações e buscas |
| Câmeras: ADMIN | Cria, edita e exclui; a matriz permite só visualizar |
| Departamentos e Locais | CAM_OPERATOR e USER conseguem excluir |
| Relatórios | USER e CAM_OPERATOR geram relatórios gerais. O CAM_OPERATOR deveria ficar restrito a câmeras, e o USER não deveria ter acesso |
| Menu do CAM_OPERATOR | Só mostra Câmeras (`sidebar-menu.ts:113`), mas a matriz dá a ele CRUD em todos os ativos, departamentos e locais, e visualização de redes |
| Dashboard | Dá erro para USER e CAM_OPERATOR (depende do painel de auditoria, que exige ADMIN) |
| Login | O cadastro público ignora o convite, e o usuário inativo consegue logar |

---

## 5. Plano de implementação (executado)

Esforço: **P** (até ~2 h) · **M** (meio dia a 1 dia) · **G** (mais de 1 dia).

### 🔴 Crítico

| # | Tarefa | Arquivos | Esforço |
|---|---|---|---|
| 1 | **Matriz central.** Tipos `Role`, `Resource` (`users`, `profile`, `networks`, `assets`, `cameras`, `departments`, `locations`, `reports`, `cameraReports`, `auditLogs`) e `Action` (`view`, `create`, `update`, `delete`, `invite`, `changeRole`, `deactivate`); `PERMISSIONS` e `can(role, resource, action)`. Cópia idêntica no front, só para UX | `back:src/lib/permissions.ts` (novo), `src/lib/permissions.ts` (novo) | M |
| 2 | **Helpers no servidor.** `loadActor(req)` lê `role` e `isActive` do banco uma vez (reaproveitando a lógica de `requireAdmin`) e responde 401 se o usuário estiver inativo. Sobre ele, `requireRole(...roles)` e `requirePermission(resource, action)`. Aplicar em **todas** as rotas | `back:src/middlewares/auth.middleares.ts`, `back:src/routes/*.ts` | M |
| 3 | **Bloquear o login de inativos e o cadastro público.** Hook `before` em `/sign-in/*` que consulta `isActive` e responde 403; `emailAndPassword.disableSignUp: true` | `back:src/lib/auth.ts` | P |
| 4 | **Isolamento de câmeras na query.** `assetVisibilityWhere(role)` devolve `{ type: { not: "CAMERA" } }` para USER (e `{}` para os demais); passa a ser aplicado em todos os pontos do item 6 do checklist. Nas rotas `/:id`, `assertAssetAccess(actor, assetId, action)` lê o `type` atual e exige `cameras.<ação>` (câmera) ou `assets.<ação>` (demais); para USER, câmera responde **404**. O `POST /assets` com `type: "CAMERA"` exige `cameras.create` | `back:src/lib/permissions.ts`, `back:src/services/{assets,dashboard,reports-audit-dashboard,report,ipaddress,network,switch,department,location}.service.ts`, `back:src/controllers/asset.controller.ts` | G |
| 5 | **Auditoria só para SUPERADM.** `requireRole("SUPERADM")` em `/audit-logs` e `/reports/audit-dashboard`. No front, `dashboard-service.ts` só busca o painel de auditoria para SUPERADM e trata a falha sem derrubar o dashboard | `back:src/routes/audit.routes.ts`, `back:src/routes/reports-audit-dashboard.routes.ts`, `src/services/dashboard-service.ts`, `src/components/dashboard/*` | P |

### 🟠 Alto

| # | Tarefa | Arquivos | Esforço |
|---|---|---|---|
| 6 | **Relatórios.** `POST /reports/assets`: SUPERADM e ADMIN sem restrição. CAM_OPERATOR só com um filtro de tipos igual a `["CAMERA"]` (validado nos filtros normalizados), senão 403. USER: 403 | `back:src/routes/report.routes.ts`, `back:src/lib/reports/normalize-filters.ts` | M |
| 7 | **Departamentos e Locais.** DELETE com `requirePermission("departments" \| "locations", "delete")` | `back:src/routes/department.ts`, `back:src/routes/location.ts` | P |
| 8 | **Último SUPERADM sem corrida.** Contagem e update na mesma `$transaction` com `isolationLevel: "Serializable"` (ou um lock com `SELECT ... FOR UPDATE`) | `back:src/services/user.service.ts` | P |
| 9 | **Reativar e excluir usuário**, com autoproteção, proteção do último SUPERADM e auditoria. Rotas `PATCH /users/:id/reactivate` e `DELETE /users/:id/permanent`, conforme a decisão 1 | `back:src/routes/user.ts`, `back:src/services/user.service.ts`, `src/app/(painel)/users/_components/*`, `src/actions/users.ts` | M |
| 10 | **Guards de página no front.** `requireRole(...)` server-side (lê `userService.getMyProfile` e faz `redirect`/`notFound`) nas páginas `/users`, `/reports-audit` e `/reports-audit/audit-logs` (SUPERADM), `/reports-audit/reports` (SUPERADM, ADMIN, CAM_OPERATOR) e `/assets/cameras/*` (sem USER; o `add` sem ADMIN). O `proxy.ts` continua só checando o cookie: ele não conhece a role sem chamar a API | `src/lib/auth-guard.ts` (novo), páginas citadas | P |

### 🟡 Médio

| # | Tarefa | Arquivos | Esforço |
|---|---|---|---|
| 11 | **UI com `can()`.** Trocar `allowedRoles` por `can()` no menu, que passa a mostrar ao CAM_OPERATOR tudo o que a matriz permite. Esconder os botões de excluir departamento/local, criar e editar câmera para ADMIN, e o seletor de tipo "Câmera" nos relatórios e filtros para USER. Substituir `canManageUsers` & cia. por `can()` | `src/config/sidebar-menu.ts`, `src/components/app-sidebar.tsx`, `src/lib/user-roles.ts`, componentes de ativos, infra e relatórios | M |
| 12 | **Testes** com Vitest nos dois repositórios. `can()` com a matriz completa: 4 roles × todos os recursos e ações, em tabela, comparando com a matriz deste documento. Back: último SUPERADM, autoproteção, inativo bloqueado no login e na requisição, USER recebe 404 numa câmera e não a vê em lista e totais, ADMIN sem escrita de câmera, CAM_OPERATOR com relatório só de câmeras. Scripts `test` e `typecheck` | `vitest.config.ts`, `package.json` (os dois), `back:src/**/*.test.ts`, `src/lib/permissions.test.ts` | M |
| 13 | **Sessões na mudança de role.** Revogar as sessões do usuário afetado (opcional: a role já é relida a cada requisição) | `back:src/services/user.service.ts` | P |

### 🟢 Baixo

| # | Tarefa | Arquivos | Esforço |
|---|---|---|---|
| 14 | **Mensagens sem vazamento.** A mensagem de "N ativos vinculados" não conta câmeras para USER (ou omite o número) | `back:src/services/{department,location}.service.ts` | P |
| 15 | **Documentação.** Coluna de permissão em `rotas.md` e `dados-e-api.md`; atualizar `problemas-encontrados.md` (A2 resolvido) | `docs/*` | P |

**A cada etapa:**
- Rodar `npx tsc --noEmit`, lint, testes e `pnpm build` (front).
- Registrar a comparação com a saída anterior.
- O build do front já falha hoje por causa do C4 (`ip-overview-container.tsx`). Ele precisa ser corrigido antes da etapa 1, ou junto com ela, para que o build sirva de verificação.

---

## 6. Decisões tomadas

| # | Pergunta | Decisão |
|---|---|---|
| 1 | Excluir usuário | **Anonimizar**: nome e e-mail substituídos, foto, senha e sessões removidas, `isActive=false` e `deletedAt` preenchido. A auditoria é preservada |
| 2 | Nome da role | **Manter `SUPERADM`** no código; a interface mostra "Superadministrador" |
| 3 | Matriz nos dois repositórios | **Cópia idêntica** de `permissions.ts` e `permissions.test.ts` nos dois repositórios |
| 4 | Dashboard | **Só o SUPERADM** vê o bloco de auditoria (e o seletor de período, que só filtra esse bloco) |
| 5 | Reserva de IP | **SUPERADM e ADMIN** reservam e cancelam em qualquer rede; **CAM_OPERATOR** só nas redes `CAMERA_VLAN`, que são as únicas oferecidas a ele na tela de reservas; **USER** não reserva |
| 6 | IP de câmera para o USER | O USER não acessa reservas. Na listagem de IPs, o IP de uma câmera aparece **em uso, sem os dados do ativo**. No cadastro de ativo, a regra de VLAN por tipo, que já existia, impede usar um IP da rede de câmeras |

---

## 7. Situação atual (implementado)

### Checklist depois da implementação

| # | Item | Status | Onde |
|---|---|---|---|
| 1 | Proteção do último SUPERADM | ✅ | `assertNotLastSuperAdmin` em `back:src/services/user.service.ts`: trava as linhas dos SUPERADM ativos com `SELECT ... FOR UPDATE` dentro da transação. Vale para rebaixar, inativar e excluir |
| 2 | Autoproteção | ✅ | O SUPERADM não altera a própria role, não se inativa, não se reativa e não se exclui (400) |
| 3 | Revogação e bloqueio de inativos | ✅ | O hook `before` de `/sign-in` no Better Auth (`back:src/lib/auth.ts`) recusa inativos (403). O `requireAuth` lê `role` e `isActive` do banco a cada requisição, recusa inativos (401) e apaga sessões que tenham sobrado. A mudança de role vale na próxima requisição |
| 4 | Validação no backend | ✅ | Todas as rotas usam `requirePermission(recurso, ação)`; os ativos também passam por `assertAssetAccess` (tipo atual do banco). As páginas do front têm `RequirePermission` (UX) |
| 5 | Troca de tipo de ativo | ✅ | O `type` é imutável. Toda rota `/assets/:id` lê o tipo atual antes de autorizar, e `PUT /assets/:id/specs/<tipo>` exige que o ativo seja desse tipo (400) |
| 6 | Isolamento de câmeras para USER | ✅ | `assetVisibilityWhere` em listagens, buscas e totais do dashboard; 404 em acesso direto; IPs de câmera sem os dados do ativo (`hideInvisibleAsset`). O USER não acessa relatórios nem auditoria |
| 7 | Convites | ✅ | Como antes, e agora o cadastro público está desligado (`disableSignUp`) |
| 8 | Escalada de privilégio | ✅ | `PATCH /users/me` só aceita `name`, e o `sign-up` público está desligado. ⚠️ Continua pendente o A1 do relatório (`update-user` do Better Auth aceita `image` livre), que não envolve role |
| 9 | Exclusão com vínculos | ✅ | Como antes (400 com vínculos). Como só SUPERADM e ADMIN excluem, a contagem da mensagem não chega ao USER |
| 10 | Auditoria | ✅ | Acesso só para SUPERADM (`requirePermission("auditLogs", "view")`). Reativação e exclusão de usuário também são registradas, assim como a reserva e o cancelamento de IP, agora dentro da transação |

### Como aplicar a matriz em código novo

**Backend** (`../sysip-backend-2.0`):
- **Rota:** `preHandler: [requireAuth, requirePermission("recurso", "ação")]` (`src/middlewares/auth.middleares.ts`). `requireRole(...roles)` existe para casos que não estão na matriz.
- **Ativo por id:** no controller, `await assertAssetAccess(id, req.user.role, ação, { expectedType? })` (`src/lib/asset-access.ts`). Para criação, `assertAssetTypeAccess(role, body.type, "create")`.
- **Query de ativos:** inclua `assetVisibilityWhere(role)` no `where`. Em relações que trazem o ativo (por exemplo, de um IP), passe o registro por `hideInvisibleAsset(role, registro)`.
- **Reserva de IP:** `reservationNetworkTypes(role)` devolve os tipos de rede permitidos (`null` = todos).

**Frontend:**
- **Página:** envolva o conteúdo com `<RequirePermission resource action>` (`src/components/require-permission.tsx`). Nas páginas de servidor, coloque a busca de dados num componente filho, para que ela nem aconteça sem permissão. Nas páginas client, use um `layout.tsx` com o guard.
- **Botões e atalhos:** `<Can resource action>` ou `useCan()` (`src/components/permission-provider.tsx`; a role vem do `PainelShell`).
- **Menu:** campo `permission` em `src/config/sidebar-menu.ts`.

### Testes

| Projeto | Arquivo | O que cobre |
|---|---|---|
| ambos | `lib/permissions.test.ts` (idêntico) | Matriz inteira: 4 roles × 11 recursos × 4 ações, contra a transcrição desta página |
| back | `src/lib/asset-access.test.ts` | Câmera invisível para USER (404), ADMIN só leitura, tipo atual do banco, rota de especificação de outro tipo (400) |
| back | `src/services/user.service.test.ts` | Último SUPERADM (com `FOR UPDATE`), autoproteção, inativar, reativar, anonimizar, usuário excluído |
| back | `src/services/ipaddress.service.test.ts` | Reserva por tipo de rede (CAM_OPERATOR/USER), IP fora da faixa, IP de outra rede, IP em uso |

Comandos: `pnpm test` nos dois projetos (`pnpm typecheck` e `pnpm lint` também existem).

**Além dos testes unitários**, foi rodada uma bateria pela API, com um usuário temporário de cada role: 82 verificações (51 de permissões, 23 de gestão de usuários, 8 de relatórios). Todas passaram; a única falha registrada foi do próprio script de teste. As páginas do front também foram conferidas por role, em um build de produção.

### Mudanças no banco

Colunas novas, aplicadas com o SQL gerado por `prisma migrate diff`, que só faz `ADD COLUMN`:
- `IpAddress.reservationReason` e `IpAddress.reservedAt`: a reserva de IP já usava esses campos, mas eles não existiam (C5 do relatório).
- `user.deletedAt`: marca da exclusão por anonimização.

### Pendências relacionadas

- **A1 (`update-user` com `image` livre):** fora do escopo de roles; segue no relatório.
- **Corpo JSON malformado responde 500:** o `errorHandler` não trata `FST_ERR_CTP_INVALID_JSON_BODY`. Encontrado durante os testes e registrado em `problemas-encontrados.md`.
