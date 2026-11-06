# NetManager (frontend)

Gestão de redes, IPs e ativos de TI: computadores, impressoras, telefones, câmeras, switches e access points, com relatórios, auditoria e usuários por convite.

Este repositório é o **frontend** (Next.js 16, React 19, TypeScript, Tailwind v4 e shadcn/ui). O backend (Fastify, Prisma e Better Auth) fica em outro repositório, `sysip-backend-2.0`.

## Como rodar

```bash
pnpm install        # use pnpm: o npm falha com ERESOLVE
pnpm dev            # http://localhost:3000 (a API é esperada em NEXT_PUBLIC_API_URL)
```

Variáveis de ambiente do front e do back: [`docs/variaveis-de-ambiente.md`](./docs/variaveis-de-ambiente.md).

## Comandos

| Comando | O que faz |
|---|---|
| `pnpm dev` | Servidor de desenvolvimento |
| `pnpm build` / `pnpm start` | Build e execução de produção |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` | ESLint |
| `pnpm test` | Testes (Vitest) |

## Documentação

Tudo está em [`docs/`](./docs/README.md): arquitetura, rotas, componentes, estilos, dados e API, convenções, matriz de permissões por role e o relatório de problemas conhecidos com o plano de correção. As instruções para trabalhar no código (e com o Claude Code) estão em [`CLAUDE.md`](./CLAUDE.md).
