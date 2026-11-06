# Documentação: NetManager (gestão de ativos de rede)

Documentação do **frontend** (`gestao-de-ativos-front`, este repositório) e do **backend** (`../sysip-backend-2.0`), gerada a partir do código em 26/10/2026.

| Documento | Conteúdo |
|---|---|
| [arquitetura.md](./arquitetura.md) | Visão geral, diagrama mermaid, fluxo de dados entre front e back, Server × Client |
| [rotas.md](./rotas.md) | Todas as rotas de `src/app`: arquivo, tipo, autenticação, papel e dados |
| [componentes.md](./componentes.md) | Componentes próprios, onde são usados, shadcn instalado, hooks e utilitários |
| [estilos.md](./estilos.md) | Tailwind v4, tema, variáveis CSS, dark mode e padrões visuais |
| [dados-e-api.md](./dados-e-api.md) | Endpoints do backend, services, Server Actions e cache/revalidação |
| [backend.md](./backend.md) | Stack do backend, estrutura, banco e modelos, auth, upload e integrações |
| [variaveis-de-ambiente.md](./variaveis-de-ambiente.md) | Variáveis dos dois projetos (só os nomes) |
| [convencoes.md](./convencoes.md) | Nomes, pastas, padrões de código e cuidados |
| [permissoes.md](./permissoes.md) | Matriz oficial de permissões por role, diagnóstico, checklist de segurança e plano de implementação |
| [problemas-encontrados.md](./problemas-encontrados.md) | Relatório da revisão: saída das ferramentas, problemas por prioridade e plano de correção |

## Início rápido

```bash
# backend
cd ../sysip-backend-2.0
pnpm install
npx prisma generate
pnpm dev            # http://localhost:3005 (Swagger em /docs)

# frontend
cd ../gestao-de-ativos-front
pnpm install
pnpm dev            # http://localhost:3000
```

Pré-requisitos:
- PostgreSQL acessível via `DATABASE_URL`;
- `.env` no back e `.env.local` no front (ver [variaveis-de-ambiente.md](./variaveis-de-ambiente.md)).
