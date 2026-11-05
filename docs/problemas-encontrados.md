# Problemas encontrados

Revisão feita em 26/10/2026, na branch `find-errors` dos dois repositórios:
- **Front:** `gestao-de-ativos-front`
- **Back:** `sysip-backend-2.0`, citado como `back:` nos caminhos

Os caminhos e as linhas foram conferidos no código na data da revisão.

> **Atualização (26/10/2026, controle de acesso por role):** resolvidos **C1** (cadastro público), **C2** (login de inativo), **C4** (build), **C5** (colunas de reserva), **A2** (papéis no backend), **A3** (IPs recentes) e **A5** (reserva de IP sem trava e sem validar a rede). Também foi corrigido o schema de resposta 401/403 da rota de relatórios, que não aceitava o formato `{ error }` dos middlewares de autenticação (hoje responde 401 sem login). Detalhes em [permissoes.md](./permissoes.md#7-situação-atual-implementado). Os números de linha citados abaixo podem ter mudado nos arquivos alterados.

> **Atualização (27/10/2026, switches/APs e Visão Geral de IPs):** resolvido o **C3**:
> - as senhas de AP são cifradas com AES-256-GCM e não saem em nenhuma leitura;
> - revelar a senha é uma rota própria, auditada;
> - as senhas antigas foram tiradas da auditoria pela migração `pnpm encrypt:ap-secrets`.
>
> Também foi corrigido o **A4** nos serviços de switch e AP: a auditoria agora roda dentro da transação. Detalhes em [permissoes.md](./permissoes.md#8-alteração-de-27102026-switchesaps-e-visão-geral-de-ips).

**Selos de confirmação**
- **[confirmado]:** reproduzido com uma ferramenta ou com uma chamada à API.
- **[leitura]:** concluído lendo o código, sem reproduzir.

## Saída das ferramentas

| Verificação | Projeto | Resultado |
|---|---|---|
| `npx tsc --noEmit` | front | ❌ 7 erros, todos em `dashboard/overview/_components/ip-overview-container.tsx` |
| `pnpm lint` | front | ❌ 196 problemas (171 erros, 25 avisos) |
| `pnpm build` | front | ❌ **Falha** no type check (mesmo erro do tsc) |
| `npx tsc --noEmit` | back | ❌ 17 erros em 7 arquivos |
| `npx eslint src` | back | ❌ 27 erros (não existe script `lint`) |
| `pnpm build` | back | ⚠️ Não existe script de build |
| Testes | ambos | ⚠️ Não há nenhum teste nem script `test` |
| `pnpm audit` | front | 127 vulnerabilidades (6 críticas, 57 altas, 58 moderadas, 6 baixas) |
| `pnpm audit` | back | 132 vulnerabilidades (2 críticas, 61 altas, 60 moderadas, 9 baixas) |

**Lint do front, por regra**

| Ocorrências | Regra |
|---|---|
| 122 | `no-explicit-any` |
| 28 | `simple-import-sort` (corrigível com `--fix`) |
| 21 | `no-unused-vars` |
| 12 | `set-state-in-effect` |
| 7 | "refs durante o render", em `pagination.tsx` |
| 3 | `exhaustive-deps` |
| 2 | `no-unescaped-entities` |
| 1 | aviso de compatibilidade de biblioteca |

**Lint do back:** 23 `no-explicit-any`, 2 variáveis não usadas e 2 `no-useless-assignment`.

---

## 🔴 Crítico

### C1. Cadastro público aberto: qualquer pessoa cria uma conta sem convite ✅ resolvido
- **Arquivo:** `back:src/lib/auth.ts:15`
- **Problema:** `emailAndPassword: { enabled: true }` mantém ativo o endpoint `POST /api/auth/sign-up/email` do Better Auth. **[confirmado]** O endpoint responde e valida o corpo: um envio vazio retorna `VALIDATION_ERROR` com os campos `name`, `email` e `password`.
- **Por que importa:** o sistema foi pensado para entrada só por convite do SUPERADM. Com o endpoint aberto, qualquer pessoa que alcance a API cria uma conta com papel `USER`. Esse papel lê e altera ativos, departamentos, localidades e IPs (ver A2) e, se o AP for cadastrado, vê as senhas dos Access Points (ver C3).
- **Sugestão:** `emailAndPassword: { enabled: true, disableSignUp: true }`. O aceite de convite já cria o usuário direto pelo Prisma, então não depende desse endpoint.
- **Esforço:** P

### C2. Usuário desativado consegue entrar de novo ✅ resolvido
- **Arquivos:** `back:src/lib/auth.ts:30-145` (hooks) e `back:src/middlewares/auth.middleares.ts:20`
- **Problema:** a desativação marca `isActive=false` e apaga as sessões (`back:src/services/user.service.ts:330-339`). Porém nem o login do Better Auth nem o `requireAuth` verificam `isActive`. **[leitura]**
- **Por que importa:** a pessoa desativada faz login de novo com a mesma senha e recupera todo o acesso. Na prática, a desativação não bloqueia nada.
- **Sugestão:**
  - Bloquear o login de usuários inativos com um hook `before` em `sign-in`, que consulta `isActive` e retorna 403.
  - Também verificar `isActive` no `requireAuth`, lendo o usuário do banco ou declarando `isActive` em `user.additionalFields`.
- **Esforço:** P

### C3. Senhas de Access Points gravadas em texto puro e enviadas a qualquer usuário logado ✅ resolvido (27/10)
- **Arquivos:**
  - `back:prisma/schema.prisma` (model `AccessPoint`: `wifiPassword` e `adminPassword`)
  - `back:src/validators/access-point.validator.ts:55-59` (schema de resposta)
  - `back:src/routes/access-point.routes.ts:36-56` (listagem)
- **Problema:**
  - A senha do painel/SSH do AP (`adminPassword`) e a senha do Wi-Fi ficam sem criptografia no banco.
  - As duas voltam em `GET /api/access-points`, inclusive na **listagem**, para qualquer papel, até `USER` e `CAM_OPERATOR`. **[leitura]**
- **Por que importa:** são credenciais de administração da rede. Com C1, qualquer pessoa consegue obtê-las.
- **Sugestão:**
  - Criptografar a senha no banco (AES-GCM com chave do `.env`).
  - Tirar `adminPassword` da listagem.
  - Mostrar a senha só sob demanda, numa rota própria restrita a ADMIN/SUPERADM e registrada na auditoria.
- **Esforço:** M

### C4. Build do front quebrado ✅ resolvido
- **Arquivo:** `src/app/(painel)/dashboard/overview/_components/ip-overview-container.tsx:165`, `:174` e `:194`
- **Problema:** o container passa as props `onOpenReserveDialog` e `ipAddresses`, que não existem mais. **[confirmado]** As abas `FindAvailableIpsTab` e `AvailableIpsTab` e o `ReserveIpsDialog` foram refatorados para cuidar da própria seleção e receber `onRefreshAll`/`selectedIps`. É uma refatoração interrompida.
- **Por que importa:** `pnpm build` falha, então o front não pode ir para produção.
- **Sugestão:** alinhar o container às props atuais, que são `networks` e `onRefreshAll` nas abas e `selectedIps` no diálogo, e remover o estado `reserveState`, que ficou duplicado.
- **Esforço:** P

### C5. Reserva de IPs quebrada: colunas que não existem no schema nem no banco ✅ resolvido
- **Arquivos:** `back:src/services/ipaddress.service.ts:407`, `:418`, `:482` e `:498-499`
- **Problema:** `reserveIps` e `cancelIpReservation` gravam `reservationReason` e `reservedAt`. **[confirmado]**
  - O model `IpAddress` não tem esses campos (`back:prisma/schema.prisma:27-39`).
  - A tabela `"IpAddress"` no banco também não tem.
  - O `tsc` acusa o erro.

  Em execução, o Prisma lança `PrismaClientValidationError`, e a reserva e o cancelamento respondem 400 "Erro na estrutura de dados enviada para o banco.".
- **Por que importa:** é uma funcionalidade visível da tela "Visão Geral de IPs" que não funciona.
- **Sugestão:** adicionar `reservationReason String?` e `reservedAt DateTime? @db.Timestamptz(6)` ao model e aplicar no banco. Junto com M10, é a hora de criar migrations.
- **Esforço:** P
- **Dúvida:** pelo histórico do Git, esses campos nunca estiveram no `schema.prisma`. Não dá para saber se as colunas chegaram a existir no banco e foram removidas por um `prisma db push`.

---

## 🟠 Alto

### A1. `PATCH /api/auth/update-user` permite gravar qualquer URL como avatar ✅ resolvido (27/10/2026)
> **Resolvido:**
> - **Back:** o hook `before` do Better Auth (`back:src/lib/auth.ts`) responde 400 a qualquer `update-user` que envie `image`. A foto só muda por `PUT`/`DELETE /api/users/me/avatar`.
> - **Front:** `resolveAvatarUrl` só aceita `/api/avatars/<uuid>.webp` e `blob:`.
> - **Testes:** `back:src/routes/auth.int.test.ts` e `src/lib/avatar.test.ts`.

- **Arquivo:** `back:src/lib/auth.ts` (o Better Auth expõe `update-user` por padrão)
- **Problema:**
  - O endpoint aceita `name` e `image` livres.
  - No front, `resolveAvatarUrl` usa URLs `http(s)` como vierem (`src/lib/avatar.ts:36-41`).

  Assim, qualquer usuário contorna as regras de avatar (tipo, tamanho, reprocessamento) e pode apontar a foto para um servidor externo. Esse servidor passa a receber o IP de quem abre o sistema, como um pixel de rastreamento. **[leitura]**
- **Por que importa:** a validação de avatar só existe na rota própria, e esse caminho a anula.
- **Sugestão:** bloquear `image` no `update-user` com um hook `before` que rejeita o campo, e aceitar em `resolveAvatarUrl` só caminhos `/api/avatars/`.
- **Esforço:** P

### A2. Papéis quase não são aplicados no backend ✅ resolvido
- **Arquivos:** `back:src/routes/*.ts`, que só usam `requireAuth`, e `src/config/sidebar-menu.ts:70-113`
- **Problema:**
  - `requireAdmin` só protege a escrita de redes, a auditoria e o painel de auditoria.
  - Qualquer usuário logado, inclusive `CAM_OPERATOR`, cria, altera e exclui ativos, departamentos, localidades, switches e APs, e reserva IPs.
  - O menu esconde itens por papel (`allowedRoles`): o `CAM_OPERATOR` só vê Câmeras, mas isso é só visual. **[leitura]**
- **Por que importa:** a função do usuário não limita nada no servidor.
- **Sugestão:** definir a matriz de permissões e aplicá-la com um `requireRole(...roles)` por rota. Para o `CAM_OPERATOR`, restringir ao tipo `CAMERA`.
- **Esforço:** M
- **Dúvida:** qual é a política desejada para `USER` e `CAM_OPERATOR`?

### A3. Endpoint de IPs recentes sempre falha ✅ resolvido
- **Arquivo:** `back:src/services/ipaddress.service.ts:245`
- **Problema:** `select: { name: true }` em `Asset`, mas `Asset` não tem `name`. `GET /api/ip-addresses/recent` lança erro de validação do Prisma. **[confirmado pelo tsc]**
- **Por que importa:** a rota está documentada no Swagger e quebrada. No front, `getRecentIpsAction` (`src/actions/ip-addresses.ts:257`) não é usada, por isso ainda ninguém notou.
- **Sugestão:** remover o campo ou trocá-lo pelo nome da especialização (por exemplo, `accessPoint.name` ou `switch.hostname`). Outra opção é remover a rota.
- **Esforço:** P

### A4. Auditoria de switch e Access Point fora da transação
- **Arquivos:**
  - `back:src/services/access-point.service.ts:123`, `:252` e `:411`
  - `back:src/services/switch.service.ts:96`, `:216` e `:392`
- **Problema:** chamam `createAuditLog({...}, tx)` com dois argumentos, mas a função recebe um único objeto, com `tx` dentro dele (`back:src/lib/audit.ts:14`). **[confirmado pelo tsc, TS2554]** O `tx` é ignorado, e o log é gravado na conexão global, em paralelo com a transação.
- **Por que importa:**
  - Se a transação falha depois do log, fica um registro de auditoria de uma operação que não aconteceu.
  - Sob carga, cada operação usa duas conexões.
- **Sugestão:** `createAuditLog({ ..., tx })`.
- **Esforço:** P

### A5. Reserva de IP: verificação fora da transação e sem validar a rede ✅ resolvido
- **Arquivo:** `back:src/services/ipaddress.service.ts:376-450`
- **Problemas:** **[leitura]**
  - A checagem de `IN_USE` (linha 380) acontece **antes** da transação. Se um IP for alocado a um ativo entre a leitura e a escrita, a reserva sobrescreve o status `IN_USE`.
  - Não verifica se cada IP pertence ao `networkId` informado nem ao CIDR da rede. Um IP já existente de outra rede é reservado mesmo assim, e um IP novo é criado na rede errada.
  - `ipAddresses` não tem `.max()` (`back:src/validators/ipaddress.validator.ts:139`).
  - A auditoria usa outro `createAuditLog` (`back:src/lib/ip-utils.ts:41`), fora da transação.
- **Sugestão:**
  - `updateMany({ where: { id, status: { not: "IN_USE" } } })` dentro da transação, verificando o `count`, como já é feito em `assets.service.ts:207`.
  - Validar que os IPs estão no CIDR.
  - Limitar o array.
  - Unificar o `createAuditLog`.
- **Esforço:** M

### A6. Cinco vulnerabilidades críticas no Next.js e dependências de segurança desatualizadas ✅ resolvido (28/10/2026)
> **Em andamento (um pacote por vez):**
> - ✅ **`next` 16.2.7 → 16.4.3** (28/10/2026), junto com o `eslint-config-next`.
>   - A 16.3.6 ainda deixaria 3 avisos críticos, corrigidos só na 16.4.1; o `pnpm audit` não aponta mais nenhum aviso do `next`.
>   - Vulnerabilidades críticas do front: de 7 para 2 (`better-auth` e `proxy-addr`).
> - ✅ **`axios` 1.17.0 → 1.21.0** (28/10/2026): o `pnpm audit` não aponta mais avisos do `axios` nem do `form-data`. Vulnerabilidades do front: de 127 para 83 (2 críticas, 40 altas). `tsc`, testes e `build` passam.
> - ✅ **`better-auth` → 1.7.14 nas duas pontas** (28/10/2026; front 1.6.14, back 1.4.18):
>   - o `pnpm audit` não aponta mais avisos do `better-auth`; vulnerabilidades do front: 79 (1 crítica, `proxy-addr`), do back: 109 (sem críticas);
>   - back: 428 testes passam, incluindo login, avatar e rate limit; o `tsc` segue com os 2 erros que já existiam (`auth.ts:76` e `ip-utils.ts:51`);
>   - front: `tsc`, testes e `build` passam;
>   - o `@better-auth/cli` 1.4.18 do back foi removido: nada o usava e ele trazia o `core` antigo, que quebrava o `better-auth` 1.7.
> - ✅ **`fastify` 5.7.4 → 5.12.7** (28/10/2026), no back:
>   - também `@fastify/cors` 11.3.1, `@fastify/swagger` 9.9.2 e `@fastify/swagger-ui` 6.1.2, que corrige o `@fastify/static`;
>   - o `pnpm audit` não aponta mais avisos do `fastify` nem do `@fastify/*`; vulnerabilidades do back: de 132 para 90 (sem críticas);
>   - 428 testes passam; o `tsc` segue com os mesmos 2 erros de antes.
> - Fica para depois: `@fastify/rate-limit` 11 e `fastify-type-provider-zod` 7 (majors, sem aviso de segurança).

- **Arquivos:** `package.json` e `back:package.json`
- **Problema:**
  - **Front, `next` 16.2.7:** avisos críticos de RCE (GHSA-p293-qw3h-jr36, GHSA-2xp9-vwfh-vxw4, GHSA-vcvr-r3jv-pc5j), corrigidos a partir da **16.3.6**.
  - **Front, `axios`:** 22 avisos altos.
  - **Back, `better-auth` 1.4.18:** 2 críticas e 9 altas; correções até a **1.6.22**.
  - **Back, `fastify` 5.7.4:** 9 altas, corrigidas até a **5.12.5**.
  - **Versões diferentes:** o front usa `better-auth` ^1.6.14 e o back, 1.4.18.
- **Por que importa:** são falhas conhecidas e públicas.
- **Sugestão:** atualizar, nesta ordem, `next`, `axios`, `better-auth` (as duas pontas na mesma versão), `fastify` e `@fastify/*`. Rodar o build e testar o login depois de cada atualização.
- **Esforço:** M

### A7. Sem testes, sem CI e sem scripts de verificação no backend ✅ resolvido (05/11/2026)
> **Resolvido (05/11/2026):** o CI rodou nos dois repositórios e passou (2/2 em cada: push e pull request). No back, o log do GitHub mostra o Postgres 17 saudável, `TEST_DATABASE_URL` apontando para `sysip_test`, 23 arquivos e 508 testes passando, nenhum pulado; os 14 arquivos `*.int.test.ts` rodaram com banco de verdade. Gatilhos: back em push na `main`, `dev` e `find-errors` e PR para `main` e `dev`; front em push na `main` e `find-errors` e PR para `main`. O lint segue como aviso até zerar os erros (ver a ordem no CLAUDE.md).
>
> **Histórico (28/10/2026):**
> - **Back:** scripts `build` (`tsc -p tsconfig.build.json`, sem os testes) e `start` (`node dist/index.js`), já que o back roda como JavaScript compilado. O `tsc` voltou a ficar sem erros: o `createAuditLog` morto de `ip-utils.ts` foi removido e o `headers` do `auth.ts` foi corrigido. O `server.ts` passou a usar `HOST` e `PORT` do `env`. Testado: `node dist/index.js` sobe, escuta em `127.0.0.1` e responde (401 sem login; o login inválido consulta o banco pelo Prisma).
> - **CI:** `.github/workflows/ci.yml` nos dois repositórios. Bloqueia em `typecheck`, testes e `build`; o `lint` roda como aviso (`continue-on-error`) até o M13 e a limpeza zerarem os erros.
- **Arquivos:** os dois repositórios
- **Problema:** não há testes nem CI, e com isso o build quebrado (C4) e os erros de tipo (C5, A3, A4) foram para a branch principal sem ninguém perceber.
- **Sugestão:**
  - Adicionar ao back os scripts `typecheck` (`tsc --noEmit`), `lint` e `build`.
  - Criar um CI mínimo (GitHub Actions) que rode `tsc` e `lint` nos dois projetos e `next build` no front.
- **Esforço:** M

### A8. Em produção (HTTPS) o cookie de sessão ganha o prefixo `__Secure-` e o front não o reconhece ✅ resolvido (29/10/2026)
> **Resolvido:** `src/lib/session-cookie.ts` (`findSessionCookie`) aceita os dois nomes e devolve nome e valor; `proxy.ts` e `server-api.ts` o usam e repassam o cookie com o nome original. Teste unitário com 3 casos (357 testes passam). **Verificado ao vivo:** back em `NODE_ENV=production` com `BETTER_AUTH_URL=https://...` (cookie `__Secure-...; Secure`) e front em produção: `/assets`, `/infra` e `/assets/printers` responderam 200 com dados. **Não testado:** navegador com HTTPS de verdade (proxy reverso).
- **Arquivos:** `src/proxy.ts:5` e `:55`, `src/lib/server-api.ts:8` e `:20`
- **Problema:** **[confirmado]** com `BETTER_AUTH_URL` em `https://...` (e também com `NODE_ENV=production`), o Better Auth devolve `Set-Cookie: __Secure-better-auth.session_token=...; Secure`. Com `http://` o nome é `better-auth.session_token`. O front procura sempre o nome **sem** prefixo:
  - `proxy.ts` não acha o cookie e redireciona toda rota protegida para `/login`;
  - `getServerApi` não encontra o cookie, e as leituras do servidor seguem sem sessão (401).
- **Por que importa:** na produção prevista (proxy reverso com HTTPS) ninguém consegue entrar: o login responde 200 e o painel volta para `/login`. Nunca apareceu porque o desenvolvimento usa `http://localhost`.
- **Sugestão:** um helper único (`src/lib/session-cookie.ts`) com os dois nomes possíveis (`__Secure-better-auth.session_token` e `better-auth.session_token`) que devolve o nome e o valor do que existir; `proxy.ts` e `server-api.ts` passam a usá-lo e repassam o cookie com o **nome original** (o que o back espera). Teste unitário do helper. O back não muda.
- **Esforço:** P

---

## 🟡 Médio

### M1. O painel inteiro é renderizado no cliente, depois de buscar a sessão ✅ resolvido (28/10/2026)
> **Resolvido:**
> - O layout `(painel)` decide no servidor: `getMyProfile` com 401 faz `redirect("/login")`; com API fora do ar ou erro, mostra um aviso com "Tentar novamente", sem deslogar.
> - O `PainelShell` deixou de ser Client Component e não usa mais `authClient.useSession()`: monta o usuário do sidebar a partir do perfil. A tela "Autenticando sessão..." e a requisição extra de sessão em toda navegação inicial acabaram, e o HTML do painel chega pronto.
> - As telas de perfil (`profile-form` e `profile-avatar-card`) não chamam mais `useSession().refetch()`: o `router.refresh()` já recarrega o layout com o perfil novo. O tipo `UserSession` perdeu o `emailVerified`, que ninguém usava.
> - **Verificado** com o back compilado e o front em produção: sem cookie e com cookie inválido vão para `/login`; com sessão válida o e-mail já vem no HTML do servidor; com a API desligada aparece "Não foi possível conectar ao servidor".
> - **Fica como está:** o `proxy.ts` segue barrando a falta de cookie (é só uma checagem otimista) e o logout continua pelo `authClient.signOut` no sidebar.
- **Arquivo:** `src/components/painel-shell.tsx:23-46`
- **Problema:** o `PainelShell` (client) esconde `children` enquanto `authClient.useSession()` carrega (linha 31) e retorna `null` quando não há sessão. Com isso, todo o HTML que os Server Components geraram é descartado na primeira pintura, e o usuário vê "Autenticando sessão..." em toda navegação inicial.
- **Por que importa:**
  - Atrasa a primeira tela.
  - Faz uma requisição extra.
  - Duplica a verificação que o `proxy.ts` e o `getMyProfile` já fazem no servidor.
- **Sugestão:** decidir no servidor, no layout `(painel)`: se `getMyProfile` retornar 401, `redirect("/login")`. Depois disso, renderizar o shell sem esperar a sessão do cliente.
- **Esforço:** M

### M2. A auditoria esconde erros (403/500) como lista vazia ✅ resolvido (28/10/2026)
> **Resolvido:**
> - `fetchAuditLogs` devolve `{ data, error, status }` (como `services/user.ts`) e sempre usa `/api/audit-logs`.
> - A página trata cada caso: 401 vai para o login; 403 mostra "Acesso restrito"; servidor fora do ar mostra "Não foi possível conectar ao servidor..."; 500 mostra "O servidor encontrou um erro ao carregar os logs..." (a mensagem técnica da API não aparece). As duas últimas ficam num alerta vermelho com "Tentar novamente", diferente do estado de lista vazia.
> - O `ErrorBox` virou o componente compartilhado `src/components/error-box.tsx` (a página de usuários usa o mesmo).
> - Testes em `src/services/audit.service.test.ts`.
- **Arquivo:** `src/services/audit.service.ts:26-34`
- **Problema:**
  - Qualquer falha, inclusive o 403 para um usuário `USER`, vira "nenhum log".
  - A linha 22 monta `"/audit-logs"` sem o prefixo `/api` quando não há query string. Isso hoje nunca acontece, porque a página sempre envia `page` e `limit`.
- **Sugestão:** retornar `{ data, error, status }`, como em `services/user.ts`, mostrar uma mensagem de acesso negado e usar sempre `/api/audit-logs`.
- **Esforço:** P

### M3. Código morto e debug que vaza dados no log ✅ resolvido (28/10/2026)
> **Resolvido:** foram removidos os arquivos abaixo; antes, uma busca confirmou que nenhum era importado.
> - **Front:** `src/services/auth.ts`, `src/actions/auth.ts`, o arquivo vazio `axios` e o `package-lock.json`. O tipo `UserSession`, o único usado, foi para `src/types/user.ts`.
> - **Back:** `user.controller.ts` (o tsc caiu de 4 para 2 erros) e `dist/index.js`; o `.gitignore` foi corrigido de `./dist` para `/dist`.

- **Arquivos:**
  - `src/services/auth.ts`: `authService.getMe`, sem uso. Chama `/api/auth/account-info` e faz `console.log` da resposta inteira (linhas 27 e 43).
  - `src/actions/auth.ts`: `loginAction`, sem uso. Grava o token **sem assinatura** em um cookie `httpOnly: false` (linha 42), o que não funciona com o Better Auth e é inseguro.
  - `back:src/controllers/user.controller.ts`: importa funções que não existem (TS2305) e não é usado por nenhuma rota.
  - `back:dist/index.js`: arquivo versionado com só um `console.log`; o `./dist` do `.gitignore` não funciona com o prefixo `./`.
  - Arquivo vazio `axios` na raiz do front.
  - `package-lock.json` junto com `pnpm-lock.yaml`.
- **Sugestão:** remover tudo.
- **Esforço:** P

### M4. Componentes e actions sem uso ✅ resolvido (29/10/2026)
> **Resolvido:** confirmei no código (nenhum importador) antes de apagar.
> - **14 componentes** removidos (a lista abaixo, todos sem importadores). `computer-actions.tsx` constava na lista e eu o havia editado no M14; mesmo assim ninguém o importava.
> - **2 arquivos órfãos** que sobraram da remoção: `src/lib/reports/build-report-payload.ts` e `format-report-filters.ts`.
> - **Actions removidas:** `getIpStatsAction`, `getOverviewStatsAction`, `getRecentIpsAction`, `verifyIpAction` (achada na varredura; também sem uso) e `src/actions/options.ts` inteiro (`createProcessorAction`, `createOperatingSystemAction`, `createDiskAction`; o último chamava `POST /api/options/disks`, que não existe no back).
> - **Service e tipos:** `getStats`, `verifyIp` e `getRecentIps` de `services/ip-address.ts` (sem chamadores) e os tipos `IpStatusStat` e `VerifyIpResponse`. `getOverviewStats` continua (usado em `/dashboard/overview`).
> - **Verificado:** `tsc`, build e 357 testes ok; varredura de arquivos órfãos e de exports de actions/services sem uso retorna vazia. Lint: 168 → 134 problemas (os `any`, avisos e imports dos arquivos apagados saíram junto).
> - **Não testado:** navegação no navegador depois da remoção (o build e o `tsc` cobrem referências de import, não rotas dinâmicas).

- **Problema:** 14 componentes só aparecem no próprio arquivo:
  - `assets/computers/components/{asset-edit-header, asset-network-fields, asset-organizational-fields, computer-hardware-fields, quick-option-forms}`
  - `assets/computers/{computer-actions, computer-spec-fields}`
  - `assets/shared/asset-base-fields`
  - `infra/departments/department-search`
  - `reports/filters/{report-allocation-filters, report-network-filters}`
  - `reports/{report-filters, table/report-pagination, table/report-table}`

  O único uso de `createDiskAction` (`src/actions/options.ts:55`) está em `quick-option-forms.tsx`, que também não é usado, e ele chama `POST /api/options/disks`, que **não existe** no back. Também sem uso: `getRecentIpsAction`.
- **Sugestão:** remover, ou criar a rota `POST /options/disks` caso o formulário rápido de discos seja retomado.
- **Esforço:** P

### M5. Swagger e Scalar públicos ✅ resolvido (28/10/2026)
> **Resolvido:** a documentação fica desligada por padrão.
> - `/docs`, `/reference`, `/swagger.json` e o OpenAPI do Better Auth só são registrados com `ENABLE_API_DOCS=true`.
> - A variável é validada em `back:src/config/env.ts` (só `true` ou `false`; o padrão é `false`).
> - **Testes:** `back:src/plugins/api-docs.int.test.ts` e `back:src/config/env.test.ts`.

- **Arquivos:** `back:src/plugins/swagger.ts:18` (`/docs`) e `back:src/plugins/apiReference.ts:6` (`/reference`, `/swagger.json`)
- **Problema:** a documentação completa da API responde 200 sem login. **[confirmado]**
- **Sugestão:** registrar só quando `NODE_ENV !== "production"`, ou proteger as rotas com autenticação.
- **Esforço:** P

### M6. CORS, origens confiáveis e acesso pela rede fixos no código ✅ resolvido (28/10/2026)
> **Resolvido:**
> - **Back:** `CORS_ORIGINS` (lista separada por vírgulas, validada em `config/env.ts`: cada item precisa ser uma origem, sem barra nem caminho) alimenta o CORS e o `trustedOrigins` do Better Auth. O padrão é `http://localhost:3000,http://127.0.0.1:3000`; em produção, o endereço HTTPS do proxy. Testes em `env.test.ts` e `app.int.test.ts`.
> - **Front:** o `allowedDevOrigins` vem de `ALLOWED_DEV_ORIGINS` (só no `pnpm dev`). O IP que estava fixo foi para o `.env.local`.
> - `HOST` também passou a valer (A7).
> - **Não alterado:** `crossSubDomainCookies` segue ligado no Better Auth. Com o front e a API sob a mesma origem do proxy ele não é necessário; reveja quando o domínio de produção existir.
- **Arquivos:**
  - `back:src/plugins/cors.ts:6`
  - `back:src/lib/auth.ts:13`
  - `next.config.ts:5`
  - `back:src/config/env.ts`, que define `CORS_ORIGINS` mas **não é importado em lugar nenhum**
- **Problema:**
  - O CORS e o `trustedOrigins` aceitam só `localhost:3000`.
  - O Next libera `10.172.254.110` em `allowedDevOrigins`.

  Quem abre o front pelo IP da rede tem as chamadas do navegador bloqueadas pelo CORS ou recusadas pelo Better Auth (origem não confiável).
- **Sugestão:** ler as origens de `CORS_ORIGINS` (já validada em `config/env.ts`) nos dois lugares.
- **Esforço:** P

### M7. Hook `preSerialization` converte toda resposta duas vezes ✅ resolvido (28/10/2026)
> **Resolvido:** o `JSON.parse(JSON.stringify(...))` virou `toJsonSafe` (`back:src/utils/serealizeBigInt.ts`), uma única passada que gera o mesmo objeto, sem montar e reler o texto. Num payload de 10000 linhas de relatório: de cerca de 140 ms para cerca de 65 ms.
> - **Por que não remover o hook:** vários schemas de resposta esperam `Date` como texto (`createdAt: z.string()` em `audit-log.validator.ts` e `reports-audit-dashboard.validator.ts`); sem a conversão, a serialização do Zod falharia. O `BigInt.prototype.toJSON` sozinho não resolveria isso.
> - A conversão duplicada do `report.controller.ts` foi removida (o hook já converte a mesma resposta).
> - **Testes:** `back:src/utils/serealizeBigInt.test.ts` compara `toJsonSafe` com o comportamento antigo em 13 casos (BigInt, Date, `undefined`, `NaN`, `toJSON`, Buffer...); `back:src/app.int.test.ts` confere `addressInt` como string e `createdAt` como texto numa resposta real.
- **Arquivo:** `back:src/app.ts:42-49`
- **Problema:** `JSON.parse(JSON.stringify(payload))` em **toda** resposta, só para converter `BigInt`.
- **Por que importa:** dobra o custo de serialização nas listagens grandes (relatórios aceitam `limit` de até 10000).
- **Sugestão:** `BigInt.prototype.toJSON` ou um serializer próprio só onde há `BigInt` (`addressInt`). Já existe `utils/serealizeBigInt.ts`.
- **Esforço:** P

### M8. Listagens sem limite máximo ✅ resolvido (28/10/2026)
> **Resolvido:** `GET /assets` e `GET /access-points` aceitam `limit` só de 1 a 100; fora disso, 400. É o maior valor do seletor de paginação do front.
> - **Testes:** `back:src/routes/list-limit.int.test.ts`.
> - **Fica para depois:** `departments`, `locations` e `switches` vão até 1000, e `reports` até 10000. O próprio front pede `switches?limit=1000` em `src/services/assets.ts`.

- **Arquivos:** `back:src/validators/asset.validator.ts:308` e `back:src/validators/access-point.validator.ts:45`
- **Problema:** `limit` não tem `.max()`, então `?limit=1000000` carrega a tabela inteira.
- **Sugestão:** `.max(100)`, como nas outras rotas.
- **Esforço:** P

### M9. Sem rate limit no login nem no aceite de convite ✅ resolvido (28/10/2026)
> **Resolvido** com `@fastify/rate-limit`, em `back:src/lib/rate-limit.ts`:
> - **Login:** 5 tentativas por minuto por IP.
> - **Validar convite:** 10 por minuto por token e 60 no total.
> - **Aceitar convite:** 5 por minuto por token e 30 no total.
>
> Os convites passam pelo servidor do Next, sempre com o mesmo IP, e por isso o limite é por token, mais um teto global. Ao estourar, a resposta é 429 com `retry-after`. Testes: `back:src/routes/rate-limit.int.test.ts`.

- **Arquivos:** `back:src/lib/auth.ts` e `back:src/routes/user.ts:216`
- **Problema:** o rate limit nativo do Better Auth só vale em produção por padrão, e não há limite nenhum nas rotas públicas de convite.
- **Sugestão:** configurar `rateLimit` explicitamente no Better Auth e usar `@fastify/rate-limit` nas rotas públicas.
- **Esforço:** P

### M10. Sem migrations: o banco depende de `db push` ✅ resolvido (28/10/2026)
> **Resolvido:** baseline `0_init` em `back:prisma/migrations`, gerado com `prisma migrate diff --from-empty`.
> - O banco de desenvolvimento foi comparado com o schema antes: sem drift (as colunas de reserva do C5 existem, o que responde a dúvida 2).
> - A migration aplicada num banco vazio reproduz o schema exato (diff vazio) e foi marcada como aplicada no banco de desenvolvimento (`migrate resolve --applied 0_init`).
> - **Produção:** o banco será criado do zero, então basta `prisma migrate deploy`. O `prisma migrate resolve --applied 0_init` é só para bancos antigos criados por `db push`, como o de desenvolvimento.
> - O `CLAUDE.md` do back descreve o novo fluxo (`migrate dev` e `migrate deploy`).
- **Arquivos:** `back:prisma.config.ts:10` aponta para `prisma/migrations`, que não existe.
- **Problema:** não há histórico das mudanças do banco; `db push` pode apagar colunas sem aviso. Ver a dúvida em C5.
- **Sugestão:** fazer o baseline com `prisma migrate diff`, depois criar a pasta e usar `prisma migrate dev` / `deploy`.
- **Esforço:** M

### M11. Auditoria apagada junto com o usuário ✅ resolvido (28/10/2026)
> **Resolvido:** `AuditLog.user` passou de `onDelete: Cascade` para `Restrict`, com a migration `20261028000000_audit_log_restrict` (aplicada no banco de desenvolvimento).
> - Optei por `Restrict` em vez de `SetNull`: `userId` continua obrigatório, sem mudar tipos nem o front. Uma exclusão física de quem tem histórico passa a ser recusada pelo banco.
> - A exclusão pela API já é lógica (anonimização), então nada muda no uso normal.
> - **Produção:** aplique com `prisma migrate deploy`.
- **Arquivo:** `back:prisma/schema.prisma:240` (`AuditLog.user` com `onDelete: Cascade`)
- **Problema:** apagar um usuário apaga todo o histórico dele. Hoje a exclusão é lógica, mas qualquer exclusão física, manual ou futura, perde a auditoria.
- **Sugestão:** `onDelete: Restrict` ou `SetNull`, com `userId` opcional.
- **Esforço:** P

### M12. Erros do React Compiler: `setState` em effect e refs no render ✅
> **Resolvido (29/10/2026), um arquivo por vez** (12 arquivos):
> - ✅ `src/hooks/use-mobile.ts`: trocado por `useSyncExternalStore` (servidor e hidratação assumem desktop, como antes). Lint do arquivo limpo; `tsc`, build e 357 testes passam. **Testado no navegador pelo usuário (sidebar ao estreitar a janela): funcionou.
> - ✅ `src/components/app-sidebar.tsx`: o `useEffect` que recalculava `openGroups` foi removido. O grupo aberto é derivado de `pathname`; o estado guarda só as aberturas/fechamentos manuais, válidos para a rota em que foram feitos (mesmo comportamento de antes: ao trocar de rota, volta ao padrão). Efeito colateral bom: o servidor já renderiza o grupo aberto, sem piscar. Lint do arquivo limpo, `tsc` e 357 testes ok. Testado no navegador pelo usuário: funcionou.
> - ✅ `src/components/pagination.tsx`: o limite inicial, guardado em `useRef` e lido no render, passou a `useState(currentLimit)` (mesmo efeito: vale só o valor da primeira renderização). Lint do arquivo limpo, `tsc` e 357 testes ok. Testado no navegador pelo usuário: funcionou.
> - ✅ `src/components/search-input.tsx`: tinha só um aviso (`exhaustive-deps`), que a regra do compilador também cobra. O debounce de 400 ms saiu do `useEffect` e foi para o `onChange` (timer em `useRef`, limpo ao desmontar e ao limpar a busca). Lint do arquivo limpo, `tsc` e 357 testes ok. Testado no navegador pelo usuário: funcionou.
> - ✅ `src/components/assets/quick-search-modal.tsx`: os dois `setState` em effect saíram. (1) O estado da busca foi para um componente interno (`QuickSearchBody`) dentro do `DialogContent`, que desmonta ao fechar; o reset da consulta e dos resultados acontece sozinho. (2) `loading` e `results` agora são derivados de `query` e do último resultado buscado; o effect só faz o debounce de 300 ms e grava o resultado de forma assíncrona (resposta antiga descartada). Diferença: se a busca der erro, a lista fica vazia em vez de manter o resultado anterior. Lint do arquivo limpo, `tsc` e 357 testes ok. Testado no navegador pelo usuário: funcionou.
> - ✅ `src/components/ui/combobox-search.tsx`: os dois `setState` em effect saíram. O reset da busca e do item focado agora acontece em `close()`, chamado por todos os caminhos de fechamento (clique fora, Esc, Enter, clique na opção, limpar, botão do gatilho); o índice focado volta a -1 em `changeSearch`, no `onChange`. Sobrou um effect só para focar o campo ao abrir (sem `setState`). Componente usado em 12 arquivos (formulários e filtros de relatório). Lint do arquivo limpo, `tsc` e 357 testes ok. Testado no navegador pelo usuário: funcionou.
> - ✅ `src/components/allocation-edit-modal.tsx`: o `useEffect([isOpen])` que fazia `form.reset` e `setApiError(null)` saiu. O formulário foi para um componente interno (`AllocationForm`) dentro do `DialogContent`, que desmonta ao fechar; cada abertura recomeça com os valores atuais do ativo e sem erro antigo. Lint: o erro de `set-state-in-effect` e o aviso de `exhaustive-deps` sumiram; sobra um aviso antigo de `catch (error)` sem uso (cai no M13/limpeza). `tsc` e 357 testes ok. Testado no navegador pelo usuário: funcionou. Os modais `system-specs-edit-modal` e `switch-connection-edit-modal` seguem o mesmo padrão.
> - ✅ `src/components/assets/computers/components/system-specs-edit-modal.tsx`: mesmo padrão do `allocation-edit-modal` (formulário interno `SystemSpecsForm` dentro do `DialogContent`; o `useEffect` de reset saiu). Lint: o erro de `set-state-in-effect` sumiu; restam os `any` de `computer?: any` (M13). `tsc` e 357 testes ok. Testado no navegador pelo usuário: funcionou.
> - ✅ `src/components/assets/shared/components/switch-connection-edit-modal.tsx`: (1) mesmo padrão dos outros modais (formulário interno `SwitchConnectionForm`; o effect de reset saiu); (2) o effect que zerava a porta quando o switch era removido foi para o `onChange` do combobox, e o valor inicial da porta já nasce vazio quando não há switch; (3) `form.watch` virou `useWatch` (sumiu o aviso `incompatible-library`). Sobra um `any` (`form.setError(key as any)`), do M13. `tsc` e 357 testes ok. O primeiro teste no navegador falhou por causa de um bug do back (ver M18), não do modal. Testado no navegador pelo usuário após o M18: funcionou.
> - ✅ `src/app/(painel)/dashboard/overview/_components/tabs/available-ips-tab.tsx`: os dois `setState` em effect saíram. (1) A sub-rede selecionada é derivada: `chosenNetworkId || networks[0]?.id`. (2) A busca guarda o resultado com a chave dos filtros (`rede|página|limite|reloadToken`); `loading`, `ips` e `meta` são derivados dessa chave, e o effect só dispara a action e grava a resposta (resposta antiga descartada). Recarregar depois de reservar passou a ser `reloadToken + 1`. A seleção de IPs é zerada nos handlers de rede, página e limite (antes, a cada busca). Lint do arquivo limpo, `tsc` e 357 testes ok. Testado no navegador pelo usuário: funcionou.
> - ✅ `src/app/(painel)/dashboard/overview/_components/tabs/reserved-ips-tab.tsx`: mesmo padrão do `available-ips-tab` (resultado guardado com a chave `rede|busca|página|limite|reloadToken`; `loading`, `ips` e `meta` derivados; o effect só dispara a action; resposta antiga descartada; `reload()` incrementa o token depois de editar/cancelar reserva). Lint do arquivo limpo, `tsc` e 357 testes ok. O teste da busca por motivo falhou por causa de um bug do back (ver M19), não do componente. Testado no navegador pelo usuário após o M19: funcionou.
> - ✅ `src/app/(painel)/assets/access-points/add/page.tsx`: o effect que zerava rede/IP ao mudar o fabricante para um escopo de VLAN diferente virou uma assinatura do formulário (`form.subscribe` no campo `vendor`); o `setState` acontece no callback. Lint: sumiram `set-state-in-effect` e `exhaustive-deps`; resta o `any` de `createAccessPointAction(payload as any)` (M13). Testado no navegador pelo usuário: funcionou.
> - **M12 concluído:** o lint não tem mais nenhuma violação `react-hooks` (total geral 191 → 168). Bugs do back achados nos testes: M18 e M19.
- **Arquivos:**
  - `src/components/app-sidebar.tsx:93`
  - `src/components/pagination.tsx:51`
  - `src/hooks/use-mobile.ts:14`
  - `src/components/assets/quick-search-modal.tsx:101`
  - `src/components/ui/combobox-search.tsx:125`
  - `dashboard/overview/_components/tabs/*` e outros 4 arquivos (lista completa no lint)
- **Problema:** `setState` síncrono dentro de `useEffect` causa renderizações em cascata, e ler `ref.current` durante o render deixa o componente desatualizado.
- **Sugestão:**
  - Derivar o estado durante o render. Por exemplo, os grupos abertos da sidebar podem vir de `pathname`, e o estado manual guarda só as exceções.
  - `use-mobile`: usar `useSyncExternalStore`.
- **Esforço:** M

### M13. `any` espalhado (89 no front em 29/10/2026, 23 no back)
> **Em andamento, por módulo, um commit cada.** Regras: sem `as unknown as X` nem casts equivalentes; onde não der para tipar direito, o `any` fica e é anotado aqui.
> - ✅ **Módulo 1: erros do axios** (`any` no front: 89 → 52; lint geral 134 → 97).
>   - Novo `src/lib/api-error.ts` (com `api-error.test.ts`, 12 casos: validação 400, 403, servidor fora do ar, erro que não é do axios, corpo vazio ou com tipos errados): `getApiErrorBody`, `getApiErrorStatus`, `hasApiErrorData`, `describeApiError` (para log) e `apiErrorMessage(error, fallback, ...chaves)`.
>   - Os 36 `catch (e: any)` viraram `catch (e)` (unknown). **As mensagens não mudam:** cada ponto mantém a precedência que tinha (`message` só, `error` só, `error` depois `message`, ou o padrão `message` depois `error`), por isso `apiErrorMessage` recebe as chaves. Ex.: o cadastro de AP continua mostrando só `message` (a API de patrimônio duplicado responde em `error`, então ali aparece o texto padrão, como antes).
>   - `handleError` (`actions/assets/helpers.ts`) agora recebe `unknown`. Mudou só o log: grava o corpo da resposta ou a mensagem, em vez do objeto de erro inteiro.
>   - **Ficou `any` de propósito:** `ActionResponse<T = any>` (helpers.ts) e `types/report.ts:17` (`value?: any`), por dependerem dos módulos seguintes; `audit-log-details-modal.tsx:78` (módulo 5).
>   - **Achado no teste do usuário (corrigido junto):** cadastrar ativo com patrimônio ou MAC repetido mostrava só "registro já existe". Causa no back: com o adapter pg o Prisma 7 não preenche `meta.target`, então o `errorHandler` caía no 409 genérico. Agora `src/utils/unique-violation.ts` lê o campo da `driverAdapterError` e a mensagem traz o valor (ex.: `O patrimônio "PAT-1" já está em uso por outro ativo.`). Teste: `src/routes/duplicates.int.test.ts`. No front, cadastro e edição de switch e AP liam só `message`; passaram a ler `error` e depois `message`.
>   - **Testado pelo usuário no navegador: funcionou.**
>   - **Módulo 2 (actions e services de ativos), testado pelo usuário: funcionou.** 5 `any` removidos, sem casts.
>     - `handleError` passou a devolver `fieldErrors` como `Record<string, string[]>` ou `undefined` (antes `null`), compatível com `ActionResult`; saíram os 3 `as any` de impressoras, câmeras e telefones.
>     - `searchAssetsAction` ganhou o tipo local `SearchApiItem` (baseado em `AssetItem`).
>     - `asset-options.action.ts` usa `SwitchItem`; o nome do switch deixou de ler `sw.switch?.*` e `sw.ip` (campos que a API não manda nessa rota) e lê `hostname`, `model` e `asset.ip.address`.
>     - `any` no front (grep `: any|<any>|as any|any[]`): 44 → 39. Lint: 92 problemas (27 de ordem de imports).
>     - Ficam: `ActionResponse<T = any>` e `ActionResult<T = any>` (o `T` padrão vira `unknown` quando todas as chamadas informarem o tipo) e `network?: any` em `types/assets.ts`.
>   - **Módulo 3 (IPs, redes e dashboard), testado pelo usuário: funcionou.** 14 `any` removidos, sem casts. Quase não havia `any` de IPs e redes; o recorte virou "dashboard + componentes de ativos que sobraram".
>     - **Bug achado:** o tipo `AuditDashboardData` (`types/dashboard.ts`) não batia com a API (`createdAt` e `user` objeto, `topUsers[].count`). O `any` escondia isso e o card "Atividade recente" da tela inicial mostrava a data vazia (`log.timestamp`). O tipo foi corrigido e a data aparece relativa ("há 2 horas"), como em `reports-audit`.
>     - `assets/page.tsx` usa `LucideIcon`; `types/assets.ts` tipa `ip.network`; o aviso de erro do `switch-connection-edit-modal` mapeia só os dois campos do form (sem `key as any`).
>     - `system-specs-edit-modal` recebe `ComputerDetails`; saíram fallbacks que a API nunca manda (`processorId`, `operatingSystemId`, `storageDiskId`, `ramMemory`). `computer-row-item` perdeu o `disk.size` (o disco só tem `name`). `asset-technical-card` não precisa mais do cast de `vlanType`.
>     - Achado no teste: o link "Ver todos" de "Atividade recente" apontava para `/audit-logs` (404); agora vai para `/reports-audit/audit-logs`.
>     - `any` no front (grep): 39 → 30. Lint: 83 problemas.
>   - **Módulo 4 (relatórios), testado pelo usuário: funcionou.** 14 `any` removidos, sem casts.
>     - `reports/page.tsx`: saiu o `extractList` (tratava formatos de resposta que os services nunca devolvem). Cada lista usa o `.data` tipado do service; o `.catch` devolve `{ data: [] }`. Também saíram fallbacks de campos que não existem nos tipos (`title`, `model` de processador e disco, `name` de rede e de switch). O rótulo das redes continua `endereço (VLAN x)`.
>     - Saiu o `(params as any).model` do filtro de impressora: nada na tela gera `?model=` (o filtro usa `printerModel`). Uma URL antiga com `?model=` deixa de filtrar.
>     - `types/report.ts`: `FilterValue` no lugar do `any` de `SingleFilter.value`, e `AssetReportData` com os campos que a tabela e a impressão leem. `report-print-modal` usa esse tipo.
>     - `ReportSwitchFilters` trocou o `onChange(field, val: any)` por `onTextChange` (modelo e fabricante) e `onTotalPortsChange` (número).
>     - `any` no front (grep): 30 → 16. Lint: 68 problemas.
>   - **Módulo 5 (auditoria, formulários e `lib/utils`), testado pelo usuário: funcionou.** front sem `any` explícito, exceto 1 (abaixo). Sem `as unknown as`.
>     - **Formulários de cadastro:** saíram os 6 `payload as any`. Dois tipos estavam errados e viraram achados: `CreateAccessPointInput.patrimony` era `string` obrigatório, mas a API aceita nulo (agora opcional e nulável); e o cadastro de switch/câmera/AP enviava `ipId: null`, que a API recusava (ver o achado seguinte).
>     - **Ficha do switch** (`switches/[id]/page.tsx`): saiu o `as any` do `asset`. `SwitchAsset`/`SwitchIp` ganharam os campos que a ficha já lia (`vlanType`, `vlanTag`, `switchPort`, `connectedToSwitchId`, `ip.network`).
>     - **Auditoria:** `details` virou `Record<string, unknown>`. O novo type guard `isRecord` (`lib/utils.ts`) faz o estreitamento no modal de detalhes e em `getFormattedEntity`, que agora não quebra se `details.type` não for texto. Teste novo: `lib/audit-utils.test.ts` (4).
>     - `sanitizePayloadForBackend` recebe e devolve `unknown`; os `refine` dos schemas de ativo usam o tipo da base (`AssetBaseData`); `SingleFilter.value` no zod deixou de ser `z.any()`; `ActionResponse` e `ActionResult` passaram a `T = unknown` (nenhum chamador lia `data`).
>     - **Achado no teste do usuário (regra de negócio, decidida com ele):** câmera, Access Point e switch podem ser cadastrados **sem IP** (ex.: guardados no almoxarifado). Antes o back exigia `ipId` nesses três e o toast mostrava o texto cru do zod ("expected string, received null"). Back: `asset.validator` (CAMERA e ACCESS_POINT), `access-point.validator`, `switch.validator` e `createSwitch` (reserva o IP só se informado); com IP informado, a validação da VLAN e a reserva continuam. Teste: `src/routes/no-ip.int.test.ts` (6). Front: `CreateSwitchPayload.ipId` opcional. O IP pode ser vinculado depois pela ficha. Fica de fora: outros campos ainda podem devolver o texto cru do zod.
>     - **Mais dois achados no teste do usuário:** (1) o filtro "sem IP" da lista de switches não funcionava: `switchService.getSwitches` montava a query só com `page`, `limit` e `search`, então o `hasIp` nunca chegava na API (a API já filtrava; teste em `no-ip.int.test.ts`). (2) Telefone pode ser cadastrado **sem ramal** (reserva): `phoneData.phoneNumber` ficou opcional no back, e o formulário de cadastro, o card de edição e o schema do front deixaram de exigir. A coluna `Phone.phoneNumber` continua `NOT NULL`: sem ramal grava `""` (o código já fazia isso) e a API devolve `null`; as telas já mostram "Sem Ramal". Sem migração.
>     - **Ficou `any` de propósito (1):** `"" as any` em `computer-specs-form-block.tsx:343`. O bloco é genérico em `TFieldValues` e já usa `as Path<TFieldValues>` em todos os campos; tipar esse `setValue` direito pede refazer o componente.
>     - Lint: 46 problemas (30 de ordem de imports).
>   - **Módulo 6 (back), testado pelo usuário no navegador (relatório com tipo inválido, convite, troca de role, login/logout na auditoria): funcionou.** de 23 `any` explícitos sobram 3 (e 25 → 6 erros de lint no back).
>     - **Relatórios:** `normalizeFilters` e `getAssetReportData` recebem `ReportQueryInput` (o tipo do schema que a rota já valida) em vez de `any`, e o `report-query-builder` perdeu os 8 `as any`. Para isso, `ReportFilterPayload.types` virou `AssetType[]`.
>     - **Código morto removido:** `normalizeFilters` aceitava apelidos de campo (`switchModel`, `osId`, `ram`, `apVendor`...) que o enum `allowedFilterFields` da rota recusa, então nunca chegavam. Saíram 22 `case` e o `payload.connectedToSwitchId` de topo. Antes de mexer, o comportamento alcançável foi travado em `normalize-filters.test.ts` (rodado contra o código antigo e o novo).
>     - **Mudança de comportamento:** tipo de ativo inexistente no filtro (`type: "foo"`) agora dá **400 "Tipo de ativo inválido: FOO."** (antes caía no erro do Prisma e virava 500 no controller). O `report.controller` deixa o `AppError` passar para o handler global.
>     - **Bug achado ao provar o 400 pela rota (`report-types.int.test.ts`):** o schema de resposta 400 de `POST /api/reports/assets` esperava `{ statusCode, error, message }`, mas o handler global responde `{ error, data }`. Qualquer erro 400 dessa rota (inclusive validação do corpo) virava 500 "Response doesn't match the schema". O 400 agora usa `{ error, data? }`.
>     - `listAssets` recebe `AssetQueryInput`; `inviteUserHandler` e `updateUserRoleHandler` usam `InviteUserInput`/`UpdateUserRoleInput` (antes `role: any`); `details` de auditoria passa por `toJsonObject` (`utils/json.ts`); os `z.any()` viraram `z.unknown()`; `ReportQueryPayload`, `AssetReportResponse` e `ReportSummary` (sem uso) saíram de `types/report.ts`.
>     - **`auth.ts`:** o hook de login lia `ctx.context` como `Record<string, any>` e caía em `returned` quando não havia `newSession`. Agora lê `ctx.context.newSession`. Sem teste prévio do log de LOGIN/LOGOUT, foi escrito `audit-login.int.test.ts` e rodado contra o código antigo e o novo: os dois gravam o log.
>     - **Ficaram 3 `any` de propósito:** `utils/sanitize.ts` (`sanitizeEmptyFields<T>` devolve `T` mas troca `""` por `null`; tipar direito muda o contrato dos 9 chamadores em `asset.controller`/`switch.controllers`).
>     - Achado (não corrigido): o enum `allowedFilterFields` aceita `patrimony`, `createdAt`, `*.hostname`, `*.username`, `*.serial` etc., que o `normalizeFilters` ignora em silêncio.
>   - **Plano dos próximos módulos:** 2 actions e services de ativos; 3 IPs, redes e dashboard; 4 relatórios; 5 auditoria, formulários e `lib/utils`; 6 back (23, começando por `report-query-builder`).
- **Exemplos:**
  - `src/lib/utils.ts:26` (`sanitizePayloadForBackend`)
  - `src/components/audit-logs/audit-log-details-modal.tsx`
  - `back:src/lib/reports/report-query-builder.ts:83-215`
- **Sugestão:** tipar primeiro as fronteiras com a API (respostas e erros do axios, com `isAxiosError`) e os builders de relatório.
- **Esforço:** G

### M14. Server Components chamam Server Actions para ler dados ✅
> **Resolvido (29/10/2026), por módulo, um commit cada:**
> - ✅ **Ativos:** `getAssetDashboardData` virou `fetchAssetDashboardData` (`src/services/asset-dashboard.ts`) e as três leituras de opções (`getProcessorsAction`, `getOperatingSystemsAction`, `getDisksAction`) viraram `optionsService` (`src/services/options.ts`). Todos os chamadores foram atualizados (páginas de ativos, de computador e de relatórios, e `services/assets.ts`); em `actions/options.ts` ficaram só as criações.
> - ✅ **IPs/redes:** `getInfraDashboardData` virou `fetchInfraDashboardData` (`src/services/infra-dashboard.ts`), usado pela página `/infra`. As leituras de IP e de redes feitas por componentes de cliente seguem como actions (ver abaixo).
> - ✅ **Relatórios:**
>   - O wrapper `getReportsAuditDashboardAction` foi removido; a página chama `fetchReportsAuditDashboardData` direto.
>   - `services/reports.service.ts` perdeu o `"use server"` e a função virou `fetchAssetReport` (usada pela página). A exportação, que roda em componente de cliente, usa a nova action fina `getAssetReportAction` em `src/actions/reports.ts`.
>   - **Não testado ao vivo:** o clique em exportar (a action só é chamada pelo componente de cliente); as páginas e as chamadas `/api/reports/*` deram 200.
> - ✅ **Ativos, parte 2 (módulo 4):** `services/assets.ts` perdeu o `"use server"` e ficou só com `getAssets` e `getAssetById`. A exclusão foi para `actions/assets/delete-asset.action.ts` (`deleteAssetAction`) e a leitura das telas de cadastro para `actions/assets/asset-options.action.ts` (`getAssetOptionsAction`). Seis telas `add/page.tsx` e cinco componentes de exclusão foram atualizados. Não há mais `"use server"` em `src/services/`.
>   - **Verificado:** `tsc`, build e 354 testes; teste real (back compilado + front em produção, banco de testes): exclusão de uma impressora e selects de `computers/add` e `printers/add` carregando, feito pelo usuário no navegador.
> - **M14 concluído.**
> - **Ficam como actions de propósito:** as leituras chamadas por componentes de cliente, sob demanda (`findAvailableIpsAction`, `getAvailableIpsAction`, `getReservedIpsAction`, `searchAssetsAction`, `findIpByAddressAction`). O cookie de sessão é httpOnly e um componente de cliente não usa `getServerApi`; a action é o caminho certo ali.
> - `getIpStatsAction`, `getOverviewStatsAction` e `getRecentIpsAction` não têm uso: seguem no M4.
- **Exemplos:** `src/app/(painel)/reports-audit/reports/page.tsx:284` (`getDisksAction`) e `assets/computers/[id]/page.tsx`
- **Problema:**
  - Server Actions servem para mutações. Cada função exportada em arquivo `"use server"` vira um endpoint POST público, que segue protegido pelo backend.
  - Leituras deveriam usar os `services/*`.
- **Sugestão:** mover as leituras (`get*Action`) para `services/` e deixar em `actions/` só o que altera dados.
- **Esforço:** M

---

### M15. Corpo JSON malformado responde 500 ✅ resolvido (28/10/2026)
> **Resolvido:** o handler global responde com o status 4xx do próprio Fastify para os erros `FST_ERR_*` (JSON malformado vira 400 com "Corpo da requisição inválido: JSON malformado."). Teste em `back:src/app.int.test.ts`.
- **Arquivo:** `back:src/plugins/errorHandler.ts`
- **Problema:** o handler global não trata `FST_ERR_CTP_INVALID_JSON_BODY`; um corpo JSON inválido cai no fallback e responde 500 "Internal Server Error". **[confirmado]** durante os testes de permissão.
- **Por que importa:** um erro do cliente aparece como falha do servidor e polui o log.
- **Sugestão:** responder 400 para os erros `FST_ERR_CTP_*` (ou para qualquer erro com `statusCode` 4xx do próprio Fastify).
- **Esforço:** P

### M16. `trustProxy` do Fastify: o rate limit vê o IP do proxy ✅ resolvido (28/10/2026)
- **Arquivos:** `back:src/config/env.ts`, `back:src/app.ts`
- **Problema:** em produção a API fica atrás de um proxy reverso (Nginx/Caddy) na mesma máquina. Sem `trustProxy`, `req.ip` é sempre o IP do proxy, e o rate limit do login (M9, por IP) trata todos os usuários como um só: cinco tentativas erradas de qualquer pessoa bloqueiam o login de todos.
- **Resolvido:** a variável `TRUST_PROXY` (`true` ou `false`, padrão `false`) liga o `trustProxy` do Fastify, e o `req.ip` passa a ser o do `X-Forwarded-For`. Testes em `back:src/routes/rate-limit.int.test.ts`: ligado, o limite é por IP do cabeçalho; desligado, o cabeçalho é ignorado (não dá para fugir do limite forjando-o).
- **Em produção:** `TRUST_PROXY=true` e `HOST=127.0.0.1`. Ligado, o Fastify confia em qualquer `X-Forwarded-For` recebido: só ligue com o proxy como único caminho até a API. O proxy deve **sobrescrever** o cabeçalho com o IP real (Nginx: `proxy_set_header X-Forwarded-For $remote_addr;`).
- **Pendência resolvida (04/11/2026):** os hooks de auditoria de login e logout liam o `x-forwarded-for` direto, e o próprio Better Auth também (o `session.ipAddress` usa esse cabeçalho por padrão). **[confirmado por teste]** com `TRUST_PROXY` desligado, um `X-Forwarded-For` inventado entrava no IP da auditoria. Correção: `routes/auth.ts` troca o cabeçalho interno `x-client-ip` pelo `request.ip` do Fastify (que respeita o `trustProxy`) ao repassar a requisição, o Better Auth passou a ler o IP só desse cabeçalho (`advanced.ipAddress.ipAddressHeaders`) e os hooks usam `session.ipAddress ?? x-client-ip`. Nada mais no `src` lê `x-forwarded-for`. Testes em `audit-login.int.test.ts` (+3): desligado, o IP inventado (e um `x-client-ip` forjado) não aparece e o IP é o da conexão; ligado, aparece o IP repassado pelo proxy, no login e no logout. Back: `tsc`, 508 testes, lint igual (5). **Testado pelo usuário e commitado.** Efeito colateral: o rate limit interno do Better Auth passa a usar o mesmo IP confiável.
- **Esforço:** P

### M17. Cookie de sessão com `Domain` tirado do `BETTER_AUTH_URL`: não funciona abrindo o sistema por outro host ✅ resolvido (29/10/2026)
> **Resolvido (decisão: desligar):** `crossSubDomainCookies` removido de `back:src/lib/auth.ts`; o cookie sai host-only (sem `Domain`). Teste de integração novo em `back:src/routes/auth.int.test.ts` (falhou antes, passa agora; 454 testes do back passam). **Verificado ao vivo:** back compilado com `BETTER_AUTH_URL=http://localhost:3005`, login pelo host `127.0.0.1`: `Set-Cookie` sem `Domain` e `/assets` responde 200 com a sessão. **Não testado:** navegador abrindo por IP da rede ou por domínio com proxy HTTPS. Se front e API um dia ficarem em subdomínios diferentes, será preciso religar a opção.
- **Arquivo:** `back:src/lib/auth.ts` (`advanced.crossSubDomainCookies.enabled: true`)
- **Problema:** **[confirmado]** com essa opção ligada, o cookie sai com `Domain=` igual ao host do `BETTER_AUTH_URL` (hoje `Domain=localhost`). Se o navegador abre o sistema por outro host (`127.0.0.1`, o IP da rede que o `ALLOWED_DEV_ORIGINS` libera, ou um domínio diferente do configurado), o navegador **rejeita o cookie**: o login responde 200, nada é gravado e o painel volta para `/login`. Foi o que aconteceu no teste em `http://127.0.0.1:3100`.
- **Por que importa:** é uma armadilha de configuração (o login "funciona" e a sessão nunca fica), e a produção atrás de um proxy com a mesma origem não precisa de cookie entre subdomínios.
- **Sugestão (❓ decidir):** desligar o `crossSubDomainCookies`; o cookie passa a valer só para o host que o emitiu (host-only) e funciona em qualquer host. Só manter ligado se algum dia o front e a API ficarem em subdomínios diferentes.
- **Esforço:** P

### M18. `PATCH /api/assets/:id/connectivity` não desconecta do switch e libera o IP sem querer ✅ corrigido (29/10/2026, testado pelo usuário)
- **Arquivos:** `back:src/validators/asset.validator.ts` (`UpdateConnectivitySchema`) e `back:src/services/assets.service.ts` (`updateConnectivity`)
- **Descoberto em:** teste do `switch-connection-edit-modal` no M12: "Remover / Limpar campo" + salvar mostrava o toast de sucesso, mas o ativo seguia ligado ao switch. Não é regressão do M12: o front já mandava `null`.
- **Causa:** `optionalUuid` converte **campo ausente em `null`**. Com isso a API não distinguia "não mexer" de "limpar" e o service tratava `null` como "manter o valor atual". Efeitos **[confirmados com teste de integração]**:
  - não é possível desconectar um ativo do switch;
  - editar só o switch/porta (o modal não envia `newIpId`) fazia `newIpId` virar `null`, e o service **liberava o IP atual para `AVAILABLE`** enquanto o ativo continuava com o `ipId`. Pior que o sintoma original: o IP aparecia livre para outro ativo.
- **Correção:** `patchUuid` (ausente continua ausente; `""`/`"null"` viram `null`) em `newIpId` e `connectedToSwitchId`; no service, `undefined` mantém, `null` desconecta e, sem switch, a porta vai a `null`. Testes novos em `back:src/routes/connectivity.int.test.ts` (2 falhavam antes; os 3 passam; suíte do back 457 ok).
- **Fica de fora:** `newIpId: null` explícito ainda libera o IP anterior mas mantém o `ipId` do ativo (nenhuma tela envia isso hoje). Decidir se "null" deve desvincular o IP.
- **Esforço:** P

### M19. A busca de IPs reservados não encontra pelo motivo ✅ corrigido (29/10/2026, testado pelo usuário)
- **Arquivo:** `back:src/services/ipaddress.service.ts` (`listIpAddresses`)
- **Descoberto em:** teste da aba de IPs reservados no M12. O campo diz "Buscar IP ou motivo", mas digitar parte do motivo não filtrava nada. Não é regressão do M12: o front sempre mandou `search` igual.
- **Causa:** **[confirmado com teste]** o filtro `search` procurava só em `address`.
- **Correção:** `OR` entre `address` e `reservationReason` (sem diferenciar maiúsculas). Testes novos em `back:src/routes/ip-search.int.test.ts` (o de motivo falhava antes; os 3 passam; suíte do back 460 ok). O `reservationReason` só é preenchido em RESERVED, então as outras listagens não mudam.
- **Esforço:** P

### M20. Fichas e filtros carregam só 8 departamentos e 8 localidades ✅ corrigido (29/10/2026, testado pelo usuário)
- **Arquivos:** `[id]/page.tsx` das 6 fichas de ativo (computers, printers, phones, cameras, switches, access-points), `reports-audit/reports/page.tsx` e `src/actions/assets/asset-options.action.ts`
- **Descoberto em:** teste do M4. Na ficha, o modal "Modificar Alocação" abria com departamento e localidade vazios. Não é regressão do M12.
- **Causa:** **[confirmado com 12 departamentos/localidades no banco de testes]** as páginas chamavam `getDepartments()` e `getLocations()` sem argumentos, e o padrão dos services é `limit = 8` (a API devolve do mais novo para o mais antigo). Se o departamento ou a localidade do ativo ficasse fora dos 8 primeiros, o combobox não achava o item para exibir, e a lista de escolha também ficava incompleta. Os filtros de departamento/localidade do relatório sofriam do mesmo mal. O cadastro (`asset-options.action`) pedia `getLocations(0, 100)`.
- **Correção:** todas as chamadas passam a `(1, 1000)` (o máximo que o back aceita). **Verificado:** antes, com o ativo no "Depto 01", o HTML da ficha trazia só os departamentos 05–12; depois, traz os 12 (e as 12 localidades). 357 testes e build ok.
- **Fica de fora:** acima de 1000 departamentos ou localidades o problema volta. O caminho definitivo é um combobox com busca no servidor, ou um endpoint de opções sem paginação.
- **Esforço:** P

### M24. Switch e AP ligados a um switch: a ligação não aparece (e, no cadastro, nem é gravada)
- **Descoberto em:** teste do M21. O toast dizia "salvo", mas a ligação não aparecia, só para switch e AP (computador, telefone, impressora e câmera funcionavam).
- **Causa (confirmada pelo banco e por teste de integração, não só pelo status):** eram **dois defeitos**, nenhum é regressão desta revisão (o `git log -S` mostra que os schemas de resposta nunca tiveram o campo; vem de `a96befc`, "switch/AP como recurso próprio", e de `14c5ed9`, que pôs o campo no schema de criação do AP sem nunca gravá-lo).
  1. **Edição (caso 3 do relatório): gravava, mas a ficha não mostrava.** No banco de desenvolvimento, `5c65b037… → b5211253…` (porta 1) estava gravado. `PATCH /api/assets/:id/connectivity` funcionava. Mas `GET /api/switches/:id` e `GET /api/access-points/:id` não devolviam `connectedToSwitchId`, `switchPort` nem `connectedToSwitch`: o schema de resposta (`SwitchResponseSchema`, `AccessPointResponseSchema`) descartava os campos, e a ficha do AP ainda fixava `connectedToSwitchId: null`.
  2. **Cadastro (caso 1 + 2): nunca gravava.** O formulário de novo switch e o de novo AP tinham o campo de switch/porta, mas o payload da página não o enviava. E o back descartava: `CreateSwitchSchema` não tinha o campo e o `createAccessPoint` aceitava o campo no schema mas não o escrevia no `Asset`.
- **Correção:**
  - Back: `CreateSwitchSchema` ganhou `connectedToSwitchId` e `switchPort`; `createSwitch` e `createAccessPoint` gravam a ligação, validando com a nova `validateUplink` (porta sem switch dá 400, switch inexistente 404, porta ocupada ou maior que o limite do switch segue a regra existente); as consultas incluem `connectedToSwitch` e os schemas de resposta devolvem os três campos (`ConnectedSwitchSchema` compartilhado).
  - Front: as páginas de cadastro de switch e de AP enviam `connectedToSwitchId` e `switchPort`; as fichas mapeiam `connectedToSwitch` para o card.
- **Teste:** `src/routes/switch-ap-uplink.int.test.ts` (7 casos): cadastra e edita switch e AP ligados a um switch, lê **do banco** que a ligação foi gravada e que o `GET` devolve a ligação; mais porta sem switch (400), switch inexistente (404) e porta ocupada (409). Os 4 primeiros falharam antes da correção.
- **Verificação:** back `tsc`, 493 testes e lint (5 erros, os mesmos de antes); front `tsc`, 398 testes, `build` e lint (46, igual). **Não testado ao vivo no navegador**: aguarda o seu teste (cadastrar switch e AP com switch; abrir a ficha do `5c65b037…`).
- **Campos desconhecidos:** o back descarta em silêncio (zod `object` sem `strict`), o que escondeu este defeito. **Não recomendo `.strict()` agora:** o próprio front envia campo que o back não conhece (o cadastro de AP manda `vlanType`), então rejeitar quebraria o cadastro. Fica como item futuro: limpar os payloads do front, depois usar `.strict()` nas rotas de escrita, com teste por rota.
- **Lição para o M22:** a sonda de auto-ligação e ciclo foi refeita conferindo o banco: `A→A`, `A→B` e `B→A` **foram gravados** (200 e ligação no banco). Ou seja, o M22 está confirmado de verdade.

### M21. Relatório: o filtro "Switch" é descartado pela página (nome de parâmetro diferente)
- **Onde:** `src/components/reports/report-container.tsx:200-201` grava `connectedToSwitchId` na URL; `src/app/(painel)/reports-audit/reports/page.tsx:27,119-123` lê `connectedSwitchId`.
- **Problema:** **[confirmado]** o filtro "Switch" (ativo conectado a um switch) nunca chega à API, para **nenhum** tipo de ativo: a tela recarrega e o resultado volta sem o filtro. Os dois nomes entraram juntos no commit `eff694f`, então nunca funcionou.
- **Back está correto:** `report-switch-filter.int.test.ts` (cascata SW-A ← SW-B ← SW-C, mais computador e impressora em SW-A) mostra que `type=switch` + `connectedToSwitchId=SW-A` traz só o SW-B (ligação direta), e que computador e impressora filtram certo.
- **Sugestão:** `page.tsx` passar a ler `connectedToSwitchId` (2 pontos e o tipo de `searchParams`).
- **Esforço:** P
- **Teste:** `src/components/reports/report-url-params.test.ts` confere que cada parâmetro que o container grava na URL é lido pela página (26 casos; falhava em `connectedToSwitchId`). Esse teste achou um segundo caso, `printerSerial` (o container grava, a página nem lê e o back ignora `printer.serial` em silêncio): tratado no M25.
- **Status:** ✅ corrigido (03/11/2026). `page.tsx` lê `connectedToSwitchId`. `tsc`, 398 testes e `build` ok; lint igual (46 problemas, nenhum novo). Não testado ao vivo no navegador: aguarda o seu teste (tipo SWITCH + filtro Switch = X deve trazer só os switches ligados direto em X).

### M22. O cadastro aceita ligar um switch nele mesmo ou fechar um ciclo entre switches ✅
- **Onde:** `PATCH /api/assets/:id/connectivity` e `updateAsset` (`assets.service.ts`, `finalSwitchId`). `validateSwitchPort` só confere se o switch existe e o número da porta; nada compara o switch escolhido com o próprio ativo ou com a cadeia acima dele.
- **Problema:** **[confirmado]** num teste temporário no banco de teste: `A → A` respondeu 200, `A → B` 200 e depois `B → A` (ciclo) 200. Hoje isso só gera dado incoerente; passa a travar qualquer consulta que suba ou desça a cascata (ver M23).
- **Sugestão:** ao salvar a ligação de um ativo do tipo SWITCH, recusar com 400 se o switch escolhido for ele mesmo ou se ele aparecer na cadeia acima do escolhido (subir por `connectedToSwitchId` com limite de profundidade). Teste: auto-ligação, ciclo de 2 e de 3 switches, e ligação válida em cascata. Cobrir também a criação e o cadastro de switch (`switch.service.ts`). Já pode existir ciclo gravado: conferir no banco antes.
- **Esforço:** P a M
- **Banco de desenvolvimento (consulta somente leitura, 04/11/2026):** nenhum switch ligado nele mesmo e nenhum ciclo. Há 3 switches ligados, em cascata normal (`sw-core-teste` ← `sw-core-teste03` ← `sw-teste-2`, e `sw-teste-semip` ← `sw-teste-cascate`). Nada foi alterado.
- **Correção (04/11/2026):**
  - Back: `assertNoSwitchCycle` (`assets.service.ts`), chamada em `updateConnectivity` quando o ativo é switch e o concentrador muda. Recusa com 400 a auto-ligação ("SW-A não pode ser ligado a ele mesmo.") e o ciclo ("SW-B já está ligado, direta ou indiretamente, ao SW-A."), subindo a cascata com limite de 50 níveis e conjunto de visitados (um ciclo antigo já gravado não trava a consulta). AP e demais tipos não passam pela checagem: só switch tem ativos abaixo de si.
  - **Cadastro:** um switch novo não tem ninguém ligado nele, então não pode fechar ciclo nem apontar para si; a validação vale na edição, que é o único caminho que altera o concentrador de um ativo existente (o `updateAsset` não escreve esse campo).
  - Front: `connectivityErrorField` (`lib/connectivity-error.ts`) decide em qual campo a mensagem aparece. O código antigo usava `includes("porta")`, que desviaria o ciclo para o campo da porta se o switch se chamasse, por exemplo, "SW-Portaria". O modal mostra a mensagem junto ao campo do switch e no aviso geral.
- **Testes:** back `switch-cycle.int.test.ts` (6 casos, conferindo o banco depois do 400: auto-ligação, ciclo direto, ciclo de 3 níveis, ligações válidas/troca/desligar, AP, ciclo antigo já gravado). Front: `connectivity-error.test.ts` (4) e `switch-connection-edit-modal.test.tsx`, que renderiza o modal com a action simulada e confere que a mensagem aparece no formulário (falha sem a correção). Para isso entraram `jsdom`, `@testing-library/react` e `@testing-library/user-event` como devDependencies, e o `vitest.config.ts` passou a incluir `*.test.tsx` (cada teste de componente declara `// @vitest-environment jsdom`).
- **Verificação:** back `tsc`, 499 testes e lint (5 erros, os mesmos de antes); front `tsc`, 403 testes, `build` e lint (46, igual). **Não testado ao vivo no navegador.**
- **Status:** ✅ corrigido (04/11/2026), testado pelo usuário no navegador: funcionou.

### M23. Melhoria: filtro de switch em cascata nos relatórios (não é defeito) ✅
- **Pedido:** no filtro "Switch" uma opção **"Incluir ativos em cascata"**, desligada por padrão. Desligada: só a ligação direta (comportamento anterior). Ligada: todos os ativos abaixo do switch escolhido, em qualquer nível.
- **Decisões do usuário:** limite de **10 níveis**; o switch escolhido **não entra** no resultado; coluna **"Nível"** (1 = ligado direto) e coluna **"Conectado via"** (caminho a partir do switch escolhido, ex.: `SW-A → SW-B`), também na exportação; **aviso** quando a cascata é cortada no limite.
- **Back:** `lib/reports/switch-cascade.ts` (`findSwitchCascade`, consulta `WITH RECURSIVE` em `$queryRaw`; `describeCascadePaths`). Um nível a mais é lido só para saber se houve corte. Proteção contra ciclo já gravado: o caminho acumulado impede revisitar um switch, e a raiz nunca volta. O payload ganhou `includeCascade`; sem `switchId` ele é ignorado. No `getAssetReportData`, a lista de ids da cascata substitui a ligação direta (`id IN (...)`) e se combina com os demais filtros (tipo, departamento etc.). Cada linha da página/exportação recebe `cascadeLevel` e `cascadePath`; a resposta ganha `cascade: { maxDepth, truncated }` (só com a cascata ligada; o schema de resposta da rota foi estendido para não descartar o campo, como no M24).
- **Front:** checkbox "Incluir ativos em cascata" (aparece com um switch escolhido), parâmetro `cascade=1` na URL, `includeCascade` no payload (inclusive o da exportação), chip "(em cascata)", colunas "Nível" e "Conectado via" na tabela da tela e na da impressão/PDF, aviso `ReportCascadeNotice` na tela e no PDF quando `truncated`. `fetchAssetReport` repassa o campo `cascade`.
- **Testes:** back `report-switch-filter.int.test.ts` (+5 casos: 3 níveis com nível e caminho, switch escolhido fora, combinação com tipo, cascata desligada sem colunas extras, corte em 10 níveis com `truncated`, ciclo antigo gravado); front `report-cascade.test.tsx` (4: tabela, impressão, aviso de corte; renderizados em jsdom) e o teste de contrato de URL (`cascade`).
- **Verificação:** back `tsc`, 505 testes e lint (5 erros, os mesmos de antes); front `tsc`, 409 testes, `build` ok e lint (46, igual). **Não testado ao vivo no navegador.**
- **Observações:** a ordem do resultado segue `createdAt` desc, não por nível. O caminho usa o hostname do switch (ou patrimônio/modelo, se não houver). Os ativos além do 10º nível não entram no resultado nem nos totais (o aviso diz isso).
- **Status:** ✅ implementado (04/11/2026), testado pelo usuário no navegador: funcionou.

### M25. Relatório: o filtro de número de série da impressora não existia
- **Onde:** `report-container.tsx` guardava `printerSerial` e o gravava na URL, mas **não havia input** na tela (`report-printer-filters.tsx` só tinha o modelo), a página não lia o parâmetro e o back ignorava `printer.serial` (o enum `allowedFilterFields` o aceitava, o `normalizeFilters` e o `report-query-builder` não). Achado pelo teste de contrato do M21.
- **Decisão do usuário:** implementar o filtro (em vez de remover o campo).
- **Correção:** back: `specific.printer.serial` no schema e nos tipos, `case "printer.serial"` no `normalizeFilters` (que também passa a incluir o tipo PRINTER, como o modelo faz) e `contains` sem diferenciar maiúsculas no `report-query-builder`. Front: input "Número de Série" no filtro de impressoras, leitura de `printerSerial` na página, filtro no payload da exportação (`buildPayload`) e chip "Série Impressora".
- **Testes:** `report-types.int.test.ts` (serial "abc" traz só a impressora com `ABC123`; falhava antes e trazia as duas); `report-url-params.test.ts` deixou de excluir o `printerSerial`.
- **Verificação:** back `tsc`, 500 testes e lint (5 erros, os mesmos de antes); front `tsc`, 404 testes, `build` ok e lint (46, igual). **Não testado ao vivo no navegador.**
- **Status:** ✅ corrigido (04/11/2026), testado pelo usuário no navegador: funcionou.

## 🟢 Baixo

### B1. Configurações duplicadas ou erradas ✅ resolvido (05/11/2026)
> **Resolvido:** `eslint.config.mts` removido (o ESLint usa o `.mjs`, que vem primeiro na busca). `components.json` passou a ter `"config": ""`, o valor do shadcn para Tailwind v4. Removidas do `package.json` as dependências que só o `.mts` usava (`eslint-config-prettier`, `eslint-plugin-react`, `globals`, `typescript-eslint`); uma busca no repositório (fora de `node_modules`) mostrou que nenhum outro arquivo as importava. Verificado: `tsc`, 409 testes, `build` ok e lint igual (46 problemas), antes e depois. **Não testado:** `npx shadcn add` com o `components.json` novo; testar na primeira vez que for preciso adicionar um componente.
- **ESLint:** há dois configs, `eslint.config.mjs` (usado) e `eslint.config.mts` (sem efeito, e com regras diferentes).
- **shadcn:** `components.json:7` aponta para `tailwind.config.js`, que não existe no Tailwind v4.
- **Esforço:** P

### B2. Tokens de fonte quebrados no tema
- **Arquivo:** `src/app/globals.css`
- **Problema:**
  - A linha 15 define `--font-sans` como `var(--font-sans)`, ou seja, referência a si mesmo.
  - As linhas 28 e 30 usam `--font-geist-sans`, que não é definida.
  - A fonte Inter só funciona porque `layout.tsx` aplica `inter.className`.
  - `--destructive-foreground` está definido, mas não aparece no `@theme inline`, então a classe `text-destructive-foreground` não é gerada.
- **Sugestão:** usar `Inter({ variable: "--font-sans" })` e um único `--font-sans` no `@theme inline`.
- **Esforço:** P

### B3. Cores fixas em vez dos tokens do tema
- **Problema:**
  - Há cerca de 629 classes com cor fixa (`bg-zinc-*`, `bg-red-*`, etc.), contra cerca de 270 com os tokens (`bg-card`, `bg-muted`...).
  - O modo escuro fica dependente de `dark:` manual.
  - 26 arquivos montam `className` com template string em vez de `cn()`. Exemplo: `audit-log-container.tsx`.
- **Sugestão:** migrar aos poucos para os tokens e `cn()`.
- **Esforço:** M

### B4. Acessibilidade
- **Problemas:**
  - Os `<select>` dos filtros da auditoria não têm rótulo (`src/components/audit-logs/audit-log-filters.tsx:122` e `:139`).
  - A mensagem de erro do login não usa `role="alert"` (`src/app/login/page.tsx`).
  - `lang="pt-br"` deveria ser `pt-BR` (`src/app/layout.tsx:24`).
- **Esforço:** P

### B5. Metadata e páginas de erro
- **Problema:**
  - Só o layout raiz define `metadata` (título "NetManager" em todas as páginas).
  - Não existe nenhum `error.tsx` nem `not-found.tsx`.
  - Só `users` e `settings/profile` têm `loading.tsx`.
- **Sugestão:** colocar `title` por página (template `"%s · NetManager"`) e um `error.tsx` no grupo `(painel)`.
- **Esforço:** P

### B6. Detalhes menores
- **Front:**
  - `src/lib/server-api.ts:21` envia o cookie também como `Authorization: Bearer`, mas o back não usa o plugin bearer.
  - `react/no-unescaped-entities` em `infra/departments/[id]/page.tsx:41`.
  - `src/hooks/use-availableIps.ts` está sem formatação Prettier.
  - `src/actions/ip-addresses.ts` revalida `/dashboard/ip-addresses` e `/infra/ip-addresses`, rotas que não existem.
  - `getAvailableIpsAction` está duplicada em `actions/ip-addresses.ts` e `actions/networks.ts`.
- **Back:**
  - O `.env` tem `PORT:3005` (linha 1), sintaxe que o dotenv ignora; a porta 3005 só vale pelo valor padrão.
  - O `.env.example` não lista `SMTP_*`, `EMAIL_FROM`, `FRONTEND_URL` nem `UPLOADS_DIR`.
  - O nome do arquivo `routes/infra-dashoboard.ts` tem erro de digitação.
  - `middlewares/auth.middleares.ts`: erro de digitação no nome e um tipo `AuthSession` sem uso.
- **README:** os `README.md` são os padrões do `create-next-app`.
- **Esforço:** P

---

## Dúvidas registradas
1. **Papéis:** qual é a política desejada para `USER` e `CAM_OPERATOR` (A2)?
2. **Reserva de IPs:** as colunas de reserva existiram no banco algum dia (C5)?
3. **Access Points:** `getApVlanType` (`src/lib/utils.ts:71`) devolve `GENERAL_DATA` para APs que não são Ruckus, mas `assets.service.ts` só aceita `WIFI_MGMT` para `ACCESS_POINT`. É preciso confirmar se o cadastro de AP passa por essa validação (`access-point.service.ts`) e qual regra vale.
4. **Ambiente de produção:** como o sistema será publicado (domínio, HTTPS, mesmo host para front e back)? Isso define a configuração do CORS, do cookie (`crossSubDomainCookies`) e do Swagger.
   - **Resposta (28/10/2026):** servidor Linux próprio, na rede interna da organização, sem nuvem. Front e back no mesmo servidor, atrás de um proxy reverso (Nginx ou Caddy) com HTTPS, que encaminha `/api` para o back. Back e Next escutam só em `127.0.0.1` (`HOST=127.0.0.1` no back). Como o navegador fala só com a origem do proxy, o cookie não precisa de `crossSubDomainCookies`; o `BETTER_AUTH_URL`, o CORS e o `trustedOrigins` devem usar o endereço HTTPS do proxy (ver M6). O Swagger fica desligado (`ENABLE_API_DOCS=false`).

---

## Plano de correção (ordem recomendada)

1. **Segurança imediata (P):**
   - C1: `disableSignUp`.
   - C2: bloquear login de usuário inativo.
   - A1: bloquear `image` no `update-user`.
   - M5: Swagger só em dev.
2. **Voltar a compilar (P):**
   - C4: props do overview, para o build passar.
   - C5: campos de reserva no schema.
   - A3: IPs recentes.
   - A4: `tx` na auditoria.
   - M3: remover o `user.controller.ts` morto.
   - Objetivo: `tsc` sem erros nos dois projetos.
3. **Proteção de credenciais (M):**
   - C3: criptografar as senhas de AP e tirá-las da listagem.
4. **Atualizar dependências (M):**
   - A6: `next` ≥ 16.3.6, `axios`, `better-auth` alinhado nas duas pontas, `fastify` ≥ 5.12.5.
   - Rodar build e testar login.
5. **Rede de segurança (M):**
   - A7: scripts `typecheck`/`lint`/`build` no back e CI.
   - M10: migrations com baseline.
6. **Autorização por papel (M):**
   - A2, depois de definida a política.
   - A5: reserva de IP atômica.
   - M8: limite das listagens.
   - M9: rate limit.
7. **Qualidade e desempenho (M/G):**
   - M1: shell decidido no servidor.
   - M2: erros da auditoria.
   - M6: origens configuráveis.
   - M7: serialização do `BigInt`.
   - M11: auditoria sem cascata.
   - M12: React Compiler.
   - M14: leituras em `services/`.
8. **Limpeza contínua:**
   - M4: código morto.
   - M13: `any`.
   - Itens 🟢.
   - `eslint --fix` para a ordem dos imports.
