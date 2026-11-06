# Permissões por role

Este documento traz a matriz oficial, o diagnóstico feito antes da implementação (seções 2 a 4) e a situação atual (seção 7). O controle de acesso foi implementado em 26/10/2026, na branch `find-errors`. Em 27/10/2026, a matriz ganhou duas alterações, também implementadas (seção 8):
1. switches e APs com recurso próprio;
2. a Visão Geral de IPs com escopo por VLAN.

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

### Ativos comuns (exceto câmeras, switches e APs)
| Ação       | SUPERADMIN | ADMIN | CAM_OPERATOR | USER |
|------------|:-:|:-:|:-:|:-:|
| Visualizar | ✅ | ✅ | ✅ | ✅ |
| Criar      | ✅ | ✅ | ✅ | ✅ |
| Editar     | ✅ | ✅ | ✅ | ✅ |
| Excluir    | ✅ | ✅ | ✅ | ✅ |

O USER é o principal usuário do sistema e tem CRUD total em ativos, inclusive nos criados por outras pessoas. As exceções são as câmeras, os switches e os APs. O CAM_OPERATOR tem CRUD em ativos comuns e em câmeras, e só visualiza switches e APs na listagem.

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

### Ativos do tipo SWITCH e AP (Access Point)
| Ação                                            | SUPERADMIN | ADMIN | CAM_OPERATOR | USER |
|-------------------------------------------------|:-:|:-:|:-:|:-:|
| Ver na listagem (campos básicos)                | ✅ | ✅ | ✅ | ✅ |
| Acessar página de detalhes                      | ✅ | ✅ | ❌ | ❌ |
| Ver dados sensíveis (senhas, credenciais, etc.) | ✅ | ✅ | ❌ | ❌ |
| Criar                                           | ✅ | ✅ | ❌ | ❌ |
| Editar                                          | ✅ | ✅ | ❌ | ❌ |
| Excluir                                         | ✅ | ✅ | ❌ | ❌ |

Requisitos:
- **Detalhe bloqueado no servidor:** USER e CAM_OPERATOR recebem 403 ou redirecionamento, inclusive digitando a URL. Na listagem, o item aparece sem link e sem editar ou excluir.
- **Dados sensíveis fora do payload:** não basta esconder na tela. Vale para:
  - listagens, API, busca e autocomplete;
  - props de server component para client component;
  - exportações e relatórios;
  - respostas de create e update, mensagens de erro e relações.
- **Troca de tipo:** USER e CAM_OPERATOR não convertem um ativo comum ou uma câmera em switch/AP, nem o contrário.
- **Sensíveis** (decisão 7): `adminUsername`, `adminPassword`, `wifiPassword`, `firmwareVersion`, `notes`, o MAC e o IP de gerência.

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

### Visão geral de IPs (blocos livres, disponibilidade, reservas)
| Funcionalidade                                       | SUPERADMIN | ADMIN | CAM_OPERATOR | USER |
|------------------------------------------------------|:-:|:-:|:-:|:-:|
| Encontrar IPs / blocos livres                        | ✅ todas as VLANs | ✅ todas as VLANs | ✅ todas as VLANs | ✅ exceto VLAN de câmeras |
| Ver IPs ocupados e a quem pertencem (ativo, hostname, MAC) | ✅ todas | ✅ todas | ✅ só VLAN de câmeras | ❌ |
| Consulta de disponibilidade detalhada                | ✅ todas | ✅ todas | ✅ só VLAN de câmeras | ❌ |
| Ver reservas                                         | ✅ todas | ✅ todas | ✅ só VLAN de câmeras | ❌ |
| Criar / editar / cancelar reservas                   | ✅ todas | ✅ todas | ✅ só VLAN de câmeras | ❌ |
| Estatísticas de uso das sub-redes                    | ✅ todas | ✅ todas | ✅ só VLAN de câmeras | ❌ |

Requisitos:
- **VLAN validada no servidor:** é lida do cadastro de redes no banco (`Network.type = CAMERA_VLAN`), nunca de um valor enviado pelo cliente.
- **Editar reserva:** valida a VLAN da reserva original **e** a do IP novo.
- **Fora do escopo:** qualquer tentativa responde 403.
- **USER:** recebe só IPs livres, sem a VLAN de câmeras e sem nenhum dado de IP ocupado ou reservado.
- **IP de gerência de switch e AP:** nunca vai com detalhes para USER e CAM_OPERATOR.

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
  - `requireAdmin` (ADMIN ou SUPERADM) e `requireSuperAdmin` buscam a role no banco a cada requisição (`back:src/middlewares/auth.middlewares.ts:34-98`).
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
| 3 | Revogação imediata e bloqueio de inativos | 🟡 Parcial | Inativar apaga as sessões (`user.service.ts:337`). A role é lida do banco em toda requisição, então a mudança vale na hora para as rotas com `requireAdmin`/`requireSuperAdmin` | **O inativo consegue fazer login de novo**: não há checagem de `isActive` no login (hooks de `back:src/lib/auth.ts:30-145`) nem no `requireAuth` (`auth.middlewares.ts:20`). A mudança de role não revoga a sessão |
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
| 2 | **Helpers no servidor.** `loadActor(req)` lê `role` e `isActive` do banco uma vez (reaproveitando a lógica de `requireAdmin`) e responde 401 se o usuário estiver inativo. Sobre ele, `requireRole(...roles)` e `requirePermission(resource, action)`. Aplicar em **todas** as rotas | `back:src/middlewares/auth.middlewares.ts`, `back:src/routes/*.ts` | M |
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
| 6 | IP de câmera para o USER | O USER não acessa reservas. No cadastro de ativo, a regra de VLAN por tipo, que já existia, impede usar um IP da rede de câmeras. *(Atualizado em 27/10: o USER não acessa mais a lista de IPs; ver a decisão 9)* |
| 7 | Campos sensíveis de switch/AP (27/10) | Fora do payload de USER e CAM_OPERATOR: `adminUsername`, `adminPassword`, `wifiPassword`, `firmwareVersion` e `notes` e, na listagem, também o **IP de gerência e o MAC**. Para essas roles, a busca não casa por IP, MAC nem `notes`. As senhas nunca saem nas leituras, nem para ADMIN: só pela ação "Revelar", que é auditada |
| 8 | IP no cadastro de ativo pelo USER (27/10) | Continua como está: o USER escolhe um IP livre da VLAN do tipo, o backend valida a VLAN e trava o IP (`AVAILABLE → IN_USE`). Isso **não** é uma reserva |
| 9 | Consulta de um IP pelo USER (27/10) | Pode consultar (`/ip-addresses/verify`), mas a resposta é só "livre" ou "indisponível", sem status nem dono. IP da VLAN de câmeras responde "indisponível" |
| 10 | VLAN de câmeras na tela de Redes (27/10) | Premissa: como o USER não tem nenhum acesso a câmeras, a VLAN de câmeras também some de `/networks` (404 no detalhe). A contagem de IPs em uso por rede só vai para quem vê o uso daquela rede |

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
- **Rota:** `preHandler: [requireAuth, requirePermission("recurso", "ação")]` (`src/middlewares/auth.middlewares.ts`). `requireRole(...roles)` existe para casos que não estão na matriz.
- **Ativo por id:** no controller, `await assertAssetAccess(id, req.user.role, ação, { expectedType? })` (`src/lib/asset-access.ts`). Para criação, `assertAssetTypeAccess(role, body.type, "create")`.
- **Query de ativos:** inclua `assetVisibilityWhere(role)` no `where`. Em relações que trazem o ativo (por exemplo, de um IP), passe o registro por `hideInvisibleAsset(role, registro)`.
- **Switch/AP:**
  - nas queries, use `switchSelect(role)` e `accessPointSelect(role)` (`src/lib/asset-select.ts`);
  - passe toda resposta de ativo por `sanitizeAsset(asset, role)`, e o que vai para a auditoria por `auditSnapshot()`;
  - nunca devolva `wifiPassword` nem `adminPassword`: a senha só sai por `POST /access-points/:id/secrets`.
- **IPs:**
  - `requireNetworkScope(role, "ipFree" | "ipUsage" | "ipReservations", ação)` e `ipScopeWhere(scope)` no `where` (`src/lib/network-scope.ts`);
  - em uma rede pedida explicitamente, `assertNetworkInScope(networkId, scope)`;
  - para checar uma VLAN, `canManageVlan(role, tipo, ação)`.
- **Reserva de IP:** `reservationNetworkTypes(role)` continua existindo como atalho (`null` = todos).

**Frontend:**
- **Página:** envolva o conteúdo com `<RequirePermission resource action>` (`src/components/require-permission.tsx`). Nas páginas de servidor, coloque a busca de dados num componente filho, para que ela nem aconteça sem permissão. Nas páginas client, use um `layout.tsx` com o guard.
- **Botões e atalhos:** `<Can resource action>` ou `useCan()` (`src/components/permission-provider.tsx`; a role vem do `PainelShell`).
- **Menu:** campo `permission` em `src/config/sidebar-menu.ts`.

### Testes

| Projeto | Arquivo | O que cobre |
|---|---|---|
| ambos | `lib/permissions.test.ts` (idêntico) | Matriz inteira contra a transcrição desta página (hoje 4 roles × 14 recursos × 6 ações; ver a seção 8) |
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

---

## 8. Alteração de 27/10/2026: switches/APs e Visão Geral de IPs

### Diagnóstico (antes)

| Item | Status | Evidência |
|---|---|---|
| a) Campos sensíveis | — | `Switch`: não tem credenciais (`hostname`, `model`, `vendor`, `totalPorts`, `mac`, `notes`). `AccessPoint`: `wifiPassword`, `adminUsername`, `adminPassword`, além de `firmwareVersion`, `notes` e `mac`. Não há SNMP nem chaves |
| b) Armazenamento das senhas | 🔴 | Texto puro (`String?`). Iam também em texto puro para a auditoria: o `createdData` de `POST /assets` era o ativo inteiro (`back:src/services/assets.service.ts`) |
| c) Senhas enviadas ao cliente | ❌ | Para **todas** as roles, em: `/access-points` (schema de resposta com as senhas), `/assets` e a busca (`accessPoint: true`), `POST /reports/assets` (`z.any()`), e as props RSC da lista e do detalhe de AP |
| d) Auditoria de senha | ❌ | O "olho" era só um toggle no cliente, com a senha já no payload |
| 1.1 Detalhe bloqueado | ❌ | `/switches/:id`, `/access-points/:id` e `/assets/:id` só exigiam `assets.view`; o front não tinha guarda |
| 1.3 Troca de tipo | 🟡 | Converter já era impossível (`type` imutável + `expectedType`). Faltava a autorização por tipo para switch/AP |
| 1.4 Recurso no `can()` | ❌ | `assetResource` só distinguia `cameras` e `assets` |
| f) CAM_OPERATOR só na VLAN de câmeras | 🟡 | Criar e cancelar reserva já estavam no servidor, lendo `Network.type` do banco (mantido). Editar reserva não existia. As leituras de uso e de reservas não tinham escopo de VLAN, e "Encontrar" estava acoplado à reserva |
| g) IP ocupado e VLAN de câmeras para o USER | ❌ | Chegavam via `overview-stats`, `GET /ip-addresses` (hostname, usuário, motivo), `/available`, `/verify`, `/recent`, `/stats`, `/networks` e `/networks/available-ips?type=CAMERA_VLAN` |

### Implementação

**Matriz** (`lib/permissions.ts`, nos dois repositórios):
- **Ações:** `viewDetails` e `viewSecrets`.
- **Recursos de ativo:** o novo `networkDevices` (switch/AP); `assetResource()` agora devolve `cameras`, `networkDevices` ou `assets`.
- **IP:** `ipReservations` foi dividido em `ipFree`, `ipUsage` e `ipReservations` (este com `update`).
- **Escopo:**
  - `ipNetworkScope(role, recurso)` devolve `null` (sem acesso), `{}` (todas), `{ only }` ou `{ exclude }`;
  - `canManageVlan(role, tipo)`, `canSeeNetworkType(role, tipo)` e `inNetworkScope(scope, tipo)` trabalham sobre ele;
  - `reservationNetworkTypes` virou atalho, com o mesmo resultado de antes.

**Backend:**
- **`lib/asset-select.ts`:**
  - `switchSelect(role)` e `accessPointSelect(role)` usam select explícito: sem `viewSecrets`, os campos sensíveis nem saem do banco;
  - `sanitizeAsset(asset, role)` tira o IP e o MAC de switch/AP e troca as senhas por `hasWifiPassword` e `hasAdminPassword`;
  - `auditSnapshot()` faz o mesmo para a auditoria.
- **Onde é aplicado:**
  - `/assets` (lista, busca, detalhe e as respostas de mutação, no controller);
  - `/switches` e `/access-points`;
  - relatórios.
- **Schemas de resposta:** não têm campos de senha, então elas nunca são serializadas. O relatório deixou de ser `z.any()`.
- **Permissões das rotas:** `/switches/*` e `/access-points/*` usam `networkDevices`: `view` na listagem, `viewDetails` no `:id` e `create`/`update`/`delete` na escrita. Em `GET /assets/:id` vale `assertAssetAccess(..., "viewDetails")`. `POST /assets`, `/specs/switch` e o restante passam a usar `networkDevices` via `assetResource`.
- **Senhas cifradas com AES-256-GCM** (`lib/secret-crypto.ts`, chave em `CREDENTIALS_ENCRYPTION_KEY`):
  - a API não sobe sem a chave;
  - a rota `POST /access-points/:id/secrets` (`viewSecrets`) devolve o valor decifrado e grava `VIEW_SECRET` na auditoria;
  - a edição de AP registra só **quais** credenciais mudaram (`credentialsChanged`).
- **`lib/network-scope.ts`:** `requireNetworkScope`, `networkScopeWhere`, `ipScopeWhere` e `assertNetworkInScope`. Uma rede pedida fora do escopo responde 403.
- **Rotas de IP:**

  | Rotas | Permissão |
  |---|---|
  | `find-available`, `verify` | `ipFree` |
  | `GET /ip-addresses`, `stats`, `overview-stats`, `available`, `recent` | `ipUsage`, com escopo na query |
  | `PATCH /ip-addresses/reserve/:id` (nova: motivo e/ou mover) | `ipReservations.update`, valida a VLAN de origem e a de destino |

- **Redes e painel:**
  - `/networks` não mostra a VLAN de câmeras ao USER, e o `_count` de uso só vai a quem vê o uso da rede;
  - `/networks/available-ips?type=CAMERA_VLAN` responde 403 ao USER;
  - o `infra-dashboard` traz `totalIpsInUse: null` e `networksUsage: []` para o USER, e só a VLAN de câmeras para o CAM_OPERATOR.

**Frontend:**
- **`proxy.ts`:** nas rotas `/assets/(switches|access-points)/(add|:id)`, busca a role em `/api/users/me` e redireciona para a listagem (`?acesso=negado`).
- **Guardas de página:** `layout.tsx` com `RequirePermission` em `[id]` (`viewDetails`) e `add` (`create`).
- **Listagens de switch e AP:**
  - sem link, observações e excluir para quem não pode;
  - IP de gerência como "Restrito";
  - botão "Novo" só com `create`.
- **Consulta Rápida:** sem acesso ao detalhe, leva à listagem filtrada.
- **Card do AP:** senhas mascaradas; o "olho" chama a rota de revelar (auditada); campo vazio na edição mantém a senha atual.
- **Visão Geral de IPs:**
  - o servidor só busca estatísticas com `ipUsage`;
  - o USER vê só "Encontrar IPs livres", sem abas, KPIs nem uso por rede;
  - o CAM_OPERATOR encontra IPs em todas as redes, mas KPIs, uso, Disponíveis, Reservados e reservar ficam só nas câmeras;
  - a aba Reservados ganhou "Editar" (motivo e mover).
- **Outras telas:**
  - os painéis escondem o uso de IPs quando `totalIpsInUse` é `null`;
  - a lista de redes mostra "—" sem `_count`;
  - a auditoria mostra "Revelou senha".

### Testes

| Projeto | Arquivo | O que cobre |
|---|---|---|
| ambos | `lib/permissions.test.ts` | Matriz inteira (4 roles × 14 recursos × 6 ações), escopo de IP, `canManageVlan` e `canSeeNetworkType` |
| back | `src/lib/asset-access.test.ts` | Switch/AP: USER e CAM_OPERATOR só na listagem (403 no detalhe e no CRUD), `POST /assets` com `SWITCH` pelo USER (403), specs de outro tipo |
| back | `src/lib/asset-select.test.ts` | Select sem campos sensíveis, senhas nunca na leitura, auditoria sem senha, IP e MAC removidos |
| back | `src/lib/secret-crypto.test.ts` | Ida e volta, IV aleatório, adulteração detectada, chave ausente ou inválida |
| back | `src/services/ipaddress.service.test.ts` | Ver abaixo |

Casos de `ipaddress.service.test.ts`:
- CAM_OPERATOR reservando na VLAN de câmeras: permitido;
- CAM_OPERATOR reservando em outra VLAN: 403;
- CAM_OPERATOR movendo uma reserva para outra VLAN: 403;
- CAM_OPERATOR editando uma reserva de outra VLAN: 403;
- USER reservando ou editando: 403;
- USER buscando IPs livres na VLAN de câmeras: 404;
- USER em `overview-stats`: 403;
- escopo aplicado na query;
- verify sem status para o USER.

**Bateria pela API:** 120 verificações com um usuário temporário de cada role. Todas passaram, inclusive:
- nenhuma senha, MAC ou IP de gerência no payload de USER e CAM_OPERATOR;
- a busca pelo IP do switch não revela o switch;
- revelar gera `VIEW_SECRET`;
- reservar, mover e cancelar com escopo de VLAN.

As páginas do front também foram conferidas por role:
- redirecionamento do proxy;
- nenhuma senha nem IP de AP no HTML/RSC da lista do USER;
- Visão Geral sem abas nem estatísticas para o USER.

### Mudanças no banco e no ambiente
- **Enum:** `AuditAction` ganhou `VIEW_SECRET` (`ALTER TYPE ... ADD VALUE`, gerado por `prisma migrate diff`).
- **Variável nova:** `CREDENTIALS_ENCRYPTION_KEY` (32 bytes em base64). Sem ela, a API não sobe. Está em `.env.example`.
- **Migração `pnpm encrypt:ap-secrets [--dry-run]`:**
  - cifra as senhas que estiverem em texto puro e tira as senhas dos `details` antigos da auditoria;
  - é idempotente;
  - **precisa rodar uma vez em cada ambiente**, com a chave daquele ambiente.
- **Banco local:** a migração cifrou 35 de 36 APs. **Perder a chave significa perder as senhas cifradas.**
