# Estilos

## Tailwind v4

- **Configuração:** fica toda em CSS, em `src/app/globals.css`. Não há `tailwind.config.*`; o `components.json` ainda cita `tailwind.config.js` (B1).
- **PostCSS:** `postcss.config.mjs` com `@tailwindcss/postcss`.
- **Imports:** `tailwindcss`, `tw-animate-css` (animações do shadcn) e `shadcn/tailwind.css`.
- **Dark mode:** `@custom-variant dark (&:is(.dark *))`, a classe `.dark` no `<html>`, aplicada pelo `next-themes` (`ThemeProvider` em `src/app/layout.tsx`: `defaultTheme="system"`, `enableSystem`, `disableTransitionOnChange`). O botão de tema fica no `AppSidebar`.

## Tema (variáveis CSS)

O bloco `@theme inline` mapeia as variáveis para as cores do Tailwind (`bg-primary`, `text-muted-foreground`, `border-border` etc.).

| Token | Claro | Escuro | Origem |
|---|---|---|---|
| `--primary` | `hsl(221 83% 28%)` | `hsl(217 91% 60%)` | azul da logo (#0f3d99) |
| `--secondary` | `hsl(199 89% 48%)` | igual | azul claro da logo (#109cd9) |
| `--warning` (token próprio) | `hsl(43 96% 56%)` | `hsl(43 90% 50%)` | amarelo da logo (#f5be18) |
| `--destructive` | `hsl(0 84.2% 60.2%)` | `hsl(0 62.8% 30.6%)` | — |
| `--background` / `--card` | branco | `hsl(240 10% 3.9%)` | base zinc/neutral |
| `--radius` | `0.5rem` | — | escala `--radius-sm` … `--radius-4xl` |

Há também os tokens `--sidebar-*`, `--chart-1..5`, `--border`, `--input` e `--ring`. `--destructive-foreground` está definido, mas **não** está mapeado no `@theme inline`; por isso a classe `text-destructive-foreground` não existe.

## Fonte

O layout raiz aplica a Inter (`next/font/google`) com `inter.className`. No `globals.css`, `--font-sans` tem uma referência circular, e as linhas do `@theme inline` apontam para `--font-geist-*`, que não existem (B2).

## Padrões visuais observados

- **Superfícies:** `bg-card border border-border/80 rounded-2xl shadow-xs`, em filtros, tabelas e cartões.
- **Fundo do painel:** `bg-zinc-50 dark:bg-zinc-950` (`painel-shell.tsx`); a largura do conteúdo é `max-w-7xl mx-auto`. A página "Minha Conta" usa `max-w-3xl`.
- **Controles de formulário fora do shadcn**, como nos filtros de auditoria: `px-3 py-2 text-xs sm:text-sm bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary`.
- **Textos:** os títulos usam `PageTitle`; as descrições, `text-muted-foreground`; os tamanhos pequenos são frequentes (`text-xs` em tabelas e badges).
- **Ícones:** `lucide-react`, normalmente `h-4 w-4`.
- **Responsividade:** grids `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`, espaçamento `px-1.5 md:px-0`.
- **Feedback:**
  - toasts com `sonner`;
  - erro em linha com `text-destructive` e `role="alert"` (nos componentes novos);
  - spinners `Loader2 animate-spin`.

## Inconsistências (B3)

- Cerca de 629 classes usam a paleta fixa (`zinc`, `slate`, `red`, `emerald`...), contra cerca de 270 que usam os tokens. Com isso, o modo escuro depende de `dark:` manual.
- 26 arquivos montam `className` com template string em vez de `cn()`, o que permite classes em conflito, sem `tailwind-merge`.
- Há botões e selects estilizados à mão ao lado dos `Button` e `Select` do shadcn.

**Recomendação para código novo:** usar os tokens (`bg-card`, `text-muted-foreground`, `bg-primary`...), `cn()` e os componentes de `components/ui`.
