# Componentes

## shadcn/ui (`src/components/ui/`)

`components.json`:
- style `default`, `rsc: true`, `baseColor: neutral`, variáveis CSS;
- aliases `@/components`, `@/components/ui`, `@/lib`, `@/hooks`.

O primitivo vem do pacote `radix-ui` unificado; alguns `@radix-ui/react-*` antigos continuam no `package.json`.

Componentes instalados:
- **Estrutura:** `card`, `separator`, `sidebar`, `sheet`, `collapsible`, `tabs`, `table`, `skeleton`, `empty`.
- **Formulário:** `form` (react-hook-form), `input`, `input-group`, `textarea`, `label`, `checkbox`, `select`.
- **Sobreposição:** `dialog`, `popover`, `dropdown-menu`, `tooltip`, `command` (cmdk).
- **Feedback:** `alert`, `badge`, `progress`, `avatar`, `button`.
- **Customizado:** `combobox-search` (busca com cmdk + popover). Não é um componente oficial do shadcn.

Toasts com `sonner` (`<Toaster />` no layout raiz).

## Componentes próprios

### Permissões

| Componente | Arquivo | Uso |
|---|---|---|
| `RequirePermission` (S) | `components/require-permission.tsx` | Guarda de página por recurso e ação da matriz; sem permissão, mostra `AccessDenied` |
| `AccessDenied` | `components/access-denied.tsx` | Aviso "Acesso restrito" |
| `RoleProvider`, `useCan`, `useRole`, `Can` (C) | `components/permission-provider.tsx` | Role do usuário no painel (fornecida pelo `PainelShell`) para esconder botões e atalhos |

### Layout e navegação

| Componente | Arquivo | Uso |
|---|---|---|
| `PainelShell` (C) | `components/painel-shell.tsx` | Layout `(painel)`: sessão, sidebar, `main max-w-7xl` |
| `AppSidebar` (C) | `components/app-sidebar.tsx` | Menu por papel (`config/sidebar-menu.ts`), troca de tema, rodapé com avatar e logout |
| `SidebarLogoFull` / `SidebarLogoIcon` | `components/sidebar-logo.tsx` | Cabeçalho da sidebar |
| `ThemeProvider` | `components/theme-provider.tsx` | `next-themes` (`attribute="class"`, padrão do sistema) |
| `Pagination` (C) | `components/pagination.tsx` | 15 telas de listagem; usa `page` e `limit` da URL |
| `SearchInput` (C) | `components/search-input.tsx` | Busca com debounce na URL (`?search=`) |
| `AllocationEditModal` | `components/allocation-edit-modal.tsx` | Edição de departamento e localidade de um ativo |

### Blocos reutilizáveis (em `components/users/`, mas usados no sistema todo)

| Componente | Uso |
|---|---|
| `PageTitle` | Cabeçalho de página (título, descrição, `leftSide`, `rightSide`). 25 arquivos |
| `BackButton` | Voltar (`router.back`). 23 arquivos |
| `ConfirmDeleteDialog` | Confirmação destrutiva; pode ser controlada (`open`, `setOpen`, `trigger={null}`). 12 arquivos |
| `EmptyState` | Lista vazia. 10 arquivos |
| `FieldError` | Erro de campo de formulário. 16 arquivos |

### Avatar (`components/avatar/`)

| Componente | Uso |
|---|---|
| `UserAvatar` | Foto (`resolveAvatarUrl`) com fallback para as iniciais. A `key={src}` remonta o Radix ao remover a foto. Usado em sidebar, tabela de usuários, auditoria e perfil |
| `AvatarUploader` (C) | Seleção, validação e recorte; não chama a API (`onSelect(file, crop)`). Usado em "Minha Conta" (`settings/profile/_components/profile-avatar-card.tsx`) e no aceite de convite |
| `AvatarCropDialog` (C) | `react-easy-crop`, máscara redonda 1:1, zoom |

### Ativos (`components/assets/`)

O padrão por tipo (`computers`, `printers`, `phones`, `cameras`, `switches`, `access-points`) é:
- `<tipo>-row-item.tsx`: linha da listagem;
- `<tipo>-hardware-card.tsx`: cartão de dados técnicos no detalhe;
- `<tipo>-specs-form-block.tsx`: bloco técnico do formulário de criação.

Compartilhados (`assets/shared/`):

| Componente | Uso |
|---|---|
| `AllocationFormBlock`, `ConnectivityFormBlock` | Blocos de alocação e conectividade dos formulários de criação |
| `AssetTechnicalCard`, `AssetAllocationCard`, `AssetConnectivityCard` | Cartões do detalhe |
| `AssetFilters`, `NotesPopover`, `NetworkSelectorFields`, `QuickChangeIpModal` | Filtros e utilidades |
| `components/switch-connection-edit-modal.tsx` | Porta e switch do ativo |

Outros:
- `computers/computer-filters.tsx` e `computers/components/system-specs-edit-modal.tsx`;
- `quick-search-modal.tsx` + `quick-search-Trigger.tsx`: "Consulta Rápida" da sidebar;
- `assets-notes-card.tsx`.

### Infraestrutura (`components/infra/`)

- `networks/{network-form, network-item, network-filters}`
- `departments/{department-form, department-item}`
- `locations/{location-form, location-item}`
- `dashboard/{header, stats-cards, capactity-chart, module-shortcuts}`

### Dashboard (`components/dashboard/`)

`dashboard-client-view` (C) junta `dashboard-header`, `dashboard-kpi-cards`, `dashboard-network-usage`, `dashboard-activity-summary` e `dashboard-quick-actions`. A Visão Geral de IPs fica em `app/(painel)/dashboard/overview/_components/`:
- container e estatísticas;
- abas: disponíveis, encontrar e reservados;
- diálogos de reserva, edição e cancelamento.

O container recebe as redes da busca e as estatísticas, estas só para quem tem `ipUsage`, e renderiza conforme a matriz.

### Relatórios (`components/reports/`)

`report-container` (C) junta:
- `report-type-selector`;
- `filters/*`: gerais, por tipo e chips ativos;
- `summary/report-kpi-cards`;
- `table/report-table-content`;
- `report-print-modal`: impressão.

### Auditoria (`components/audit-logs/`)

`audit-log-container` (C), `audit-log-filters` (filtros na URL), `audit-log-table`, `audit-log-details-modal` e `audit-log-action-badge`.

### Usuários (`app/(painel)/users/_components/`)

`users-table` (S), `user-row-actions`, `invite-user-dialog`, `change-user-role-dialog` e `user-account-dialog`, que confirma desativar, reativar e excluir.

## Componentes sem uso (candidatos a remoção, M4)

- `assets/computers/components/`: `asset-edit-header`, `asset-network-fields`, `asset-organizational-fields`, `computer-hardware-fields`, `quick-option-forms`
- `assets/computers/`: `computer-actions`, `computer-spec-fields`
- `assets/shared/asset-base-fields`
- `infra/departments/department-search`
- `reports/filters/`: `report-allocation-filters`, `report-network-filters`
- `reports/`: `report-filters`, `table/report-pagination`, `table/report-table`

## Hooks e utilitários

| Arquivo | Conteúdo |
|---|---|
| `hooks/use-mobile.ts` | `useIsMobile` (shadcn sidebar) |
| `hooks/use-availableIps.ts` | Busca IPs livres por tipo de VLAN |
| `lib/utils.ts` | `cn`, `getFieldErrors` (zod), `sanitizePayloadForBackend`, `sanitizeNullable`, `getApVlanType` |
| `lib/avatar.ts` | Constantes, validação, `resolveAvatarUrl`, `buildAvatarFormData` e `createAvatarPreview` |
| `lib/permissions.ts` | Matriz (`can`, `assetResource`, `ipNetworkScope`, `canManageVlan`, `canSeeNetworkType`), em cópia idêntica do backend |
| `lib/user-roles.ts` | `ROLE_LABELS`, `canManageUsers`, `canChangeRole`, `canDeactivate`, `getInitials`, `formatDateBR` |
| `lib/audit-utils.ts` | `getFormattedEntity` (rótulo da entidade e do subtipo de ativo) |
| `lib/reports/*` | Monta o payload e formata os filtros do relatório |
| `config/sidebar-menu.ts` | Grupos e itens do menu com `allowedRoles` |
