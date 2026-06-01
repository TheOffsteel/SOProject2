[README.md](https://github.com/user-attachments/files/28465239/README.md)
# Monitor — Dashboard de Infraestrutura e Monitoramento de Sistema

> Projeto Integrador — Sistemas Operacionais & DevOps

---

## Objetivo do Projeto

Desenvolver uma aplicação web de monitoramento de infraestrutura aplicando na prática os conceitos estudados durante as aulas de:

- Sistemas Operacionais Linux
- DevOps e Git Flow
- Integração Contínua (CI) e Entrega Contínua (CD)
- Automação de Pipelines
- Containerização com Docker
- Orquestração com Kubernetes
- Monitoramento e Observabilidade

O projeto demonstra como o desenvolvimento moderno de software depende diretamente da integração entre desenvolvimento, infraestrutura e sistemas operacionais, entregando um **Dashboard de Infraestrutura** com visualização de métricas do sistema em tempo real.

---

## Tema do Projeto

**Monitor** é uma aplicação web (Dashboard de Infraestrutura) que exibe métricas do sistema operacional, status de serviços e recursos de hardware em uma interface visual baseada no design system da NVIDIA — priorizando clareza técnica e informação densa.

A aplicação foca em:

- Exibição de métricas de CPU, memória e disco
- Status da aplicação e dos containers
- Monitoramento de recursos em tempo real
- Registro e visualização de logs operacionais
- Consumo de recursos por processo

---

## Tecnologias Utilizadas

### Frontend / Aplicação

| Tecnologia | Versão | Finalidade |
|---|---|---|
| React | 19.x | Biblioteca de interface |
| TypeScript | 5.x | Tipagem estática |
| TanStack Router | 1.x | Roteamento client-side |
| TanStack Query | 5.x | Gerenciamento de estado e cache |
| TailwindCSS | 4.x | Estilização utilitária |
| Radix UI | - | Componentes acessíveis |
| Recharts | 2.x | Gráficos e visualizações |
| Lucide React | 0.575 | Ícones |
| Zod | 3.x | Validação de schemas |
| React Hook Form | 7.x | Formulários |
| Vite | 7.x | Build tool e bundler |

### Infraestrutura / Deploy

| Tecnologia | Finalidade |
|---|---|
| Bun | Runtime e gerenciador de pacotes |
| Cloudflare Workers | Deploy edge / serverless |
| Wrangler | CLI do Cloudflare para deploy |
| Vercel | Plataforma de deploy (alternativo) |
| Docker | Containerização da aplicação |
| Kubernetes | Orquestração de containers |
| GitHub Actions | Pipeline CI/CD |

### Qualidade de Código

| Ferramenta | Finalidade |
|---|---|
| ESLint | Linting de código TypeScript/React |
| Prettier | Formatação automática |
| TypeScript ESLint | Regras específicas para TypeScript |

---

## Estrutura da Aplicação

```
SOProject2/
├── .lovable/                  # Configurações da plataforma Lovable
├── .github/
│   └── workflows/             # Pipelines GitHub Actions (CI/CD)
├── deploy/                    # Scripts e configurações de deploy
│   ├── docker/
│   │   ├── Dockerfile
│   │   └── docker-compose.yml
│   └── kubernetes/
│       ├── deployment.yaml
│       ├── service.yaml
│       └── ingress.yaml
├── src/
│   ├── components/            # Componentes React reutilizáveis
│   │   ├── ui/                # Componentes base (Radix UI + Tailwind)
│   │   ├── charts/            # Gráficos de métricas (Recharts)
│   │   ├── cards/             # Cards de status e métricas
│   │   └── layout/            # Navbar, Footer, Sidebar
│   ├── routes/                # Páginas/rotas da aplicação (TanStack Router)
│   │   ├── index.tsx          # Dashboard principal
│   │   ├── cpu.tsx            # Monitoramento de CPU
│   │   ├── memory.tsx         # Monitoramento de Memória
│   │   ├── disk.tsx           # Monitoramento de Disco
│   │   └── logs.tsx           # Visualização de Logs
│   ├── hooks/                 # Custom hooks (queries, métricas)
│   ├── lib/                   # Utilitários e helpers
│   └── styles/                # Estilos globais e design tokens
├── .gitignore
├── .prettierrc
├── .prettierignore
├── DESIGN.md                  # Sistema de design (tokens, cores, tipografia)
├── bun.lock                   # Lockfile do Bun
├── bunfig.toml                # Configuração do Bun
├── components.json            # Configuração dos componentes shadcn/ui
├── eslint.config.js           # Regras ESLint
├── package.json               # Dependências e scripts
├── tsconfig.json              # Configuração TypeScript
├── vite.config.ts             # Configuração do Vite + Cloudflare plugin
└── wrangler.jsonc             # Configuração do deploy no Cloudflare Workers
```

---

## Organização do Ambiente

### Pré-requisitos

- [Bun](https://bun.sh/) >= 1.0
- [Node.js](https://nodejs.org/) >= 18 (alternativo ao Bun)
- [Docker](https://www.docker.com/) >= 24
- [kubectl](https://kubernetes.io/docs/tasks/tools/) (opcional, para Kubernetes)

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Ambiente de execução
NODE_ENV=development

# Configurações da aplicação
VITE_APP_TITLE=Monitor
VITE_API_BASE_URL=http://localhost:8787

# Cloudflare Workers (para deploy em produção)
CLOUDFLARE_ACCOUNT_ID=seu_account_id
CLOUDFLARE_API_TOKEN=seu_api_token
```

> **Importante:** Nunca commite o arquivo `.env` no repositório. Ele já está listado no `.gitignore`.

---

## Como Executar

### 1. Clonar o repositório

```bash
git clone https://github.com/TheOffsteel/SOProject2.git
cd SOProject2
```

### 2. Instalar dependências

```bash
# Com Bun (recomendado)
bun install

# Ou com npm
npm install
```

### 3. Executar em desenvolvimento

```bash
# Com Bun
bun run dev

# Ou com npm
npm run dev
```

A aplicação estará disponível em: `http://localhost:5173`

### 4. Build para produção

```bash
bun run build
```

### 5. Preview do build

```bash
bun run preview
```

---

## Docker

A aplicação está containerizada para garantir portabilidade e padronização do ambiente de execução.

### Build da imagem

```bash
docker build -f deploy/docker/Dockerfile -t monitor-app:latest .
```

### Executar com Docker

```bash
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  monitor-app:latest
```

### Executar com Docker Compose

```bash
docker-compose -f deploy/docker/docker-compose.yml up -d
```

### Verificar containers em execução

```bash
docker ps
docker logs monitor-app
```

### Parar containers

```bash
docker-compose -f deploy/docker/docker-compose.yml down
```

---

## Kubernetes

A estrutura de orquestração permite escalar e gerenciar a aplicação em ambiente de produção.

### Aplicar configurações

```bash
# Criar o Deployment
kubectl apply -f deploy/kubernetes/deployment.yaml

# Criar o Service
kubectl apply -f deploy/kubernetes/service.yaml

# Criar o Ingress (opcional)
kubectl apply -f deploy/kubernetes/ingress.yaml
```

### Verificar status

```bash
# Verificar pods
kubectl get pods

# Verificar services
kubectl get services

# Ver logs do pod
kubectl logs -l app=monitor-app

# Descrever deployment
kubectl describe deployment monitor-app
```

### Escalar a aplicação

```bash
kubectl scale deployment monitor-app --replicas=3
```

---

## Pipeline CI/CD

O projeto utiliza **GitHub Actions** para automatizar o fluxo de integração e entrega contínua.

### Etapas do pipeline

```
Push / Pull Request
        │
        ▼
┌───────────────────┐
│   1. Checkout     │  Clonar o repositório
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│  2. Setup Bun     │  Configurar runtime
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│  3. Install Deps  │  bun install
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│   4. Lint         │  eslint . (validação de código)
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│   5. Type Check   │  tsc --noEmit
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│   6. Tests        │  Testes automatizados
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│   7. Build        │  vite build
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│  8. Docker Build  │  Build da imagem
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│   9. Deploy       │  Cloudflare Workers / Vercel
└───────────────────┘
```

### Branches e ambientes

| Branch | Ambiente | Deploy Automático |
|---|---|---|
| `main` | Produção | ✅ Sim |
| `develop` | Staging | ✅ Sim |
| `feature/*` | — | ❌ Apenas validação |
| `hotfix/*` | — | ❌ Apenas validação |

---

## Automação Operacional (Sistemas Operacionais Linux)

O projeto demonstra o uso prático de conceitos de Sistemas Operacionais através de scripts Shell e ferramentas Linux.

### Scripts disponíveis em `deploy/`

#### Inicialização da aplicação

```bash
# Iniciar todos os serviços
chmod +x deploy/start.sh
./deploy/start.sh
```

#### Monitoramento de recursos

```bash
# Verificar uso de CPU, memória e disco
./deploy/monitor.sh

# Exemplo de saída:
# [2026-06-01 10:30:00] CPU: 24% | MEM: 61% | DISK: 45%
```

#### Backup automatizado

```bash
# Executar backup manual
./deploy/backup.sh

# Agendar com cron (todo dia às 02:00)
0 2 * * * /caminho/deploy/backup.sh >> /var/log/monitor-backup.log 2>&1
```

#### Verificação de saúde da aplicação

```bash
# Health check
./deploy/healthcheck.sh

# Reiniciar serviço em caso de falha
./deploy/restart-on-failure.sh
```

### Agendamento com crontab

```bash
# Editar crontab
crontab -e

# Exemplos de tarefas agendadas:
*/5 * * * * /deploy/monitor.sh >> /var/log/monitor-metrics.log
0 2 * * * /deploy/backup.sh >> /var/log/backup.log
@reboot /deploy/start.sh
```

### Gerenciamento de processos

```bash
# Verificar processos da aplicação
ps aux | grep monitor

# Verificar portas em uso
ss -tlnp | grep :3000

# Matar processo por porta
fuser -k 3000/tcp
```

---

## Logs e Monitoramento

A aplicação gera logs estruturados para facilitar a observabilidade e o diagnóstico de problemas.

### Localização dos logs

```
/var/log/monitor/
├── app.log          # Logs da aplicação
├── error.log        # Logs de erro
├── deploy.log       # Logs de deploy
└── metrics.log      # Métricas operacionais coletadas
```

### Visualizar logs em tempo real

```bash
# Logs da aplicação
tail -f /var/log/monitor/app.log

# Apenas erros
tail -f /var/log/monitor/error.log

# Com Docker
docker logs -f monitor-app

# Com Kubernetes
kubectl logs -f deployment/monitor-app
```

### Formato de log

```
[2026-06-01T10:30:00.000Z] [INFO]  Aplicação iniciada na porta 3000
[2026-06-01T10:30:05.000Z] [INFO]  CPU: 18% | MEM: 54% | DISK: 42%
[2026-06-01T10:35:12.000Z] [WARN]  Uso de memória acima de 80%: 83%
[2026-06-01T10:40:00.000Z] [ERROR] Falha ao coletar métrica de disco: EACCES
```

---

## Versionamento com Git Flow

O projeto segue o modelo **Git Flow** para organização do desenvolvimento.

### Estrutura de branches

```
main          ─────●──────────────────●──── (produção)
                   │                  │
develop       ─────●────●────●────────● ──── (integração)
                        │    │
feature/      ──────────●    │              (novas funcionalidades)
                             │
hotfix/       ───────────────●              (correções urgentes)
```

### Convenção de commits

```
feat: adiciona gráfico de uso de CPU
fix: corrige atualização em tempo real do dashboard
docs: atualiza README com instruções de Docker
chore: atualiza dependências do projeto
refactor: reorganiza componentes de métricas
ci: adiciona step de testes no pipeline
```

### Fluxo de trabalho

```bash
# Nova funcionalidade
git checkout develop
git checkout -b feature/grafico-memoria
# ... desenvolvimento ...
git add .
git commit -m "feat: adiciona gráfico de uso de memória"
git push origin feature/grafico-memoria
# Abrir Pull Request para develop

# Hotfix em produção
git checkout main
git checkout -b hotfix/correcao-cpu-gauge
# ... correção ...
git commit -m "fix: corrige leitura do gauge de CPU"
git push origin hotfix/correcao-cpu-gauge
# Abrir Pull Request para main e develop
```

---

## Testes Automatizados

O projeto implementa testes para garantir estabilidade e detectar regressões automaticamente.

### Executar testes

```bash
# Todos os testes
bun run test

# Com cobertura
bun run test:coverage

# Modo watch
bun run test:watch
```

### Estrutura de testes

```
src/
└── __tests__/
    ├── unit/
    │   ├── components/      # Testes de componentes React
    │   ├── hooks/           # Testes de custom hooks
    │   └── lib/             # Testes de utilitários
    └── integration/
        ├── routes/          # Testes de rotas
        └── api/             # Testes de integração com API
```

---

## Deploy

### Cloudflare Workers (produção)

```bash
# Autenticar no Cloudflare
bunx wrangler login

# Deploy em produção
bunx wrangler deploy

# Deploy em ambiente de staging
bunx wrangler deploy --env staging
```

### Render

A aplicação está disponível em produção via Render:

🌐 **[https://so-project2.render.app](https://soproject2.onrender.com)**

---

## Gerenciamento de Configuração

O projeto separa claramente código-fonte, configurações e variáveis sensíveis:

| Arquivo/Local | Conteúdo | Versionado |
|---|---|---|
| `src/` | Código-fonte da aplicação | ✅ Sim |
| `.env` | Variáveis de ambiente locais | ❌ Não |
| `.env.example` | Modelo de variáveis de ambiente | ✅ Sim |
| `wrangler.jsonc` | Config de deploy (Cloudflare) | ✅ Sim |
| `deploy/kubernetes/` | Manifests K8s | ✅ Sim |
| Secrets do GitHub | API Keys e tokens | ❌ Apenas no CI |

---

## Critérios de Avaliação

| Critério | Implementação | Status |
|---|---|---|
| Uso correto do Git/Git Flow | Branches, commits semânticos, PRs | ✅ |
| Sistemas Operacionais Linux | Scripts shell, cron, logs, processos | ✅ |
| Pipeline CI/CD | GitHub Actions com lint, build e deploy | ✅ |
| Docker | Dockerfile + Docker Compose | ✅ |
| Kubernetes | Deployment, Service e Ingress | ❌ |
| Testes Automatizados | Testes unitários e de integração | ❌ |
| Organização e documentação | README detalhado + DESIGN.md | ✅ |

---

## Desafios Extras

- [ ] Health Check automatizado com reinício de serviço
- [ ] Canary Release via Cloudflare Traffic Routing
- [ ] Monitoramento avançado com alertas por threshold
- [ ] Rollback automatizado em caso de falha no deploy
- [ ] Balanceamento de carga com Kubernetes HPA

---

## Integrantes do Grupo

| Nome | GitHub |
|---|---|
| *(João Gabriel Rodrigues Lara)* | [@TheOffsteel](https://github.com/TheOffsteel) |
| *(Lucas Prestes Arruda)* |  [@LucasPrestes](https://github.com/LucasPrestes06) |
| *(Maycon Rezende)* | [@MayconRezende](https://github.com/maycon-rezende) |
| *(Leonardo Sigolo)* | [@LeonardoSigolo](https://github.com/LeleoDosCode) |

---

## Referências

- [TanStack Router Docs](https://tanstack.com/router)
- [TanStack Query Docs](https://tanstack.com/query)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Vite Docs](https://vitejs.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/)
- [Radix UI Docs](https://www.radix-ui.com/)
- [Docker Docs](https://docs.docker.com/)
- [Kubernetes Docs](https://kubernetes.io/docs/)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Projeto DevOps — Referência do Professor](https://github.com/deivisontakatu/aula-devops)

---

> Projeto desenvolvido para a disciplina de **Sistemas Operacionais** — aplicando conceitos de Linux, DevOps, CI/CD, Docker e Kubernetes em uma aplicação web real de monitoramento de infraestrutura.
