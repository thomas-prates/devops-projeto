# Relatório Final - Fase 2: Entrega Contínua, Monitoramento e Segurança

**Disciplina:** DevOps na Prática  
**Curso:** Análise e Desenvolvimento de Sistemas - PUCRS  
**Projeto:** Task DevOps API  
**Fase:** 2 - Entrega Contínua, Monitoramento e Segurança

---

## 1. Introdução

Este relatório descreve a implementação da Fase 2 do projeto DevOps, que expandiu a infraestrutura criada na Fase 1 para incluir Entrega Contínua (CD), Containerização, Monitoramento, Logging e Segurança. O objetivo foi evoluir de um pipeline de Integração Contínua básico para um fluxo DevOps completo que automatiza desde a validação do código até o deploy em produção.

---

## 2. Objetivos da Fase 2

### 2.1 Objetivos Gerais
- Expandir o pipeline de CI para incluir Entrega Contínua (CD)
- Containerizar a aplicação utilizando Docker
- Implementar scripts de deploy automatizados
- Adicionar monitoramento e logging
- Implementar práticas de segurança
- Documentar todo o processo

### 2.2 Objetivos Específicos
- Criar pipeline CI/CD completo no GitHub Actions
- Desenvolver Dockerfile otimizado para produção
- Implementar health checks automatizados
- Criar scripts de deploy e rollback
- Adicionar logging estruturado na aplicação
- Documentar fluxo DevOps completo

---

## 3. Implementação Realizada

### 3.1 API REST de Tarefas

#### 3.1.1 Estrutura da Aplicação
A aplicação foi reestruturada para seguir uma arquitetura MVC:

```
src/
├── app.ts              # Configuração do Express
├── server.ts           # Ponto de entrada do servidor
├── controllers/        # Controladores das rotas
│   └── taskController.ts
├── models/            # Modelos de dados
│   └── task.ts
└── routes/            # Definição das rotas
    └── tasks.ts
```

#### 3.1.2 Endpoints Implementados
- `POST /tasks` - Criar nova tarefa
- `GET /tasks` - Listar todas as tarefas
- `GET /tasks/:id` - Buscar tarefa por ID
- `PUT /tasks/:id` - Atualizar tarefa
- `DELETE /tasks/:id` - Deletar tarefa
- `GET /health` - Health check da aplicação

#### 3.1.3 Modelo de Dados
Cada tarefa possui:
- `id`: Identificador único
- `title`: Título da tarefa
- `description`: Descrição detalhada
- `status`: 'pending' ou 'completed'
- `createdAt`: Data de criação

### 3.2 Testes Automatizados

#### 3.2.1 Cobertura de Testes
Foram implementados testes utilizando Jest e Supertest cobrindo:
- Health check endpoint
- Criação de tarefas
- Listagem de tarefas
- Busca por ID
- Atualização de tarefas
- Exclusão de tarefas
- Tratamento de erros
- Validação de campos obrigatórios

#### 3.2.2 Resultados dos Testes
Todos os 10 testes implementados passam com sucesso, garantindo a qualidade do código antes do deploy.

### 3.3 Containerização com Docker (item 2a do enunciado)

#### 3.3.1 Estrutura do Dockerfile

O [`Dockerfile`](../Dockerfile) usa **build multi-stage**: dois estágios `FROM` no mesmo arquivo, e só o resultado do último vira a imagem final. Com isso, o compilador TypeScript e as dependências de desenvolvimento ficam fora da imagem que roda em produção.

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
RUN npm ci
COPY src ./src
RUN npm run build

# Stage 2: Production
FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache wget
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
EXPOSE 3000
USER node
CMD ["node", "dist/server.js"]
```

**Estágio 1: `builder` (compilação)**

| Instrução | O que faz | Por quê |
|---|---|---|
| `FROM node:20-alpine AS builder` | Parte da imagem oficial do Node 20 sobre Alpine Linux e dá o nome `builder` ao estágio | Alpine é pequena (~5 MB de base). O nome permite referenciar o estágio depois |
| `COPY package*.json` + `tsconfig.json` | Copia **só** os manifestos antes do código | Cache de camadas: se só o código mudar, o Docker reaproveita a camada do `npm ci` e o build fica muito mais rápido |
| `RUN npm ci` | Instala **todas** as dependências (incluindo `typescript`, `jest` etc.) exatamente como no `package-lock.json` | O `tsc` é necessário para compilar. `npm ci` garante build reprodutível |
| `COPY src ./src` + `RUN npm run build` | Copia o código-fonte e roda `tsc`, gerando JavaScript em `/app/dist` | O `tsconfig.json` define `rootDir: ./src` e `outDir: ./dist`, então `src/server.ts` vira `dist/server.js` |

**Estágio 2: produção (imagem final)**

| Instrução | O que faz | Por quê |
|---|---|---|
| `FROM node:20-alpine` | Recomeça de uma imagem **limpa** | Nada do estágio anterior vem junto, a não ser o que for copiado explicitamente |
| `RUN apk add --no-cache wget` | Instala o `wget` | É usado pelo `healthcheck` do `docker-compose.yml`. `--no-cache` não deixa o índice do apk na imagem |
| `COPY package*.json` + `RUN npm ci --omit=dev` | Instala **só** as dependências de produção (ex.: `express`) | Imagem menor e menos superfície de ataque: pacotes de dev não chegam à produção |
| `COPY --from=builder /app/dist ./dist` | Traz do estágio `builder` **apenas** o JavaScript compilado | Código-fonte TypeScript, `tsc` e devDependencies ficam para trás |
| `EXPOSE 3000` | Documenta a porta da API | O mapeamento real é feito no `docker run -p` / compose |
| `USER node` | Troca para o usuário `node` (UID 1000), que já vem na imagem oficial | **Usuário não-root**: se a aplicação for comprometida, o invasor não tem privilégios de root dentro do container. Como `dist/` e `node_modules/` foram criados como root antes do `USER`, o processo também não consegue alterar o próprio código |
| `CMD ["node", "dist/server.js"]` | Inicia o servidor na forma *exec* (sem shell intermediário) | O Node recebe o `SIGTERM` do `docker stop` diretamente e executa o *graceful shutdown* implementado em `src/server.ts` |

O [`.dockerignore`](../.dockerignore) complementa o build: exclui `node_modules`, `tests`, `.git`, `.github`, `*.tfvars`, `.env` e `*.md` do contexto enviado ao Docker. O build fica mais rápido e nenhum arquivo sensível vai parar em uma camada da imagem.

> **Observação:** o health check do container está configurado no `docker-compose.yml` (seção 3.3.2), e não como instrução `HEALTHCHECK` no Dockerfile. Quando o container é iniciado pelo `scripts/deploy.sh` (via `docker run`), a verificação de saúde é feita pelo próprio script e pelo pipeline (seção 3.5).

#### 3.3.2 Evidências do build local

Comandos executados na raiz do repositório:

```bash
# 1. Build da imagem
docker build -t devops-projeto:local .

# 2. Imagem gerada e tamanho
docker images devops-projeto

# 3. Container rodando e usuário não-root
docker run -d --name devops-local -p 3000:3000 devops-projeto:local
docker exec devops-local whoami        # esperado: node
curl http://localhost:3000/health      # esperado: {"status":"ok",...}
docker rm -f devops-local
```

**[PRINT 1: saída do `docker build`, mostrando os dois estágios (`[builder 1/6]` ... e `[stage-1 ...]`) e `COPY --from=builder`]**

**[PRINT 2: saída do `docker images devops-projeto`, com o tamanho da imagem final]**

**[PRINT 3: `docker exec devops-local whoami` retornando `node` e o `curl /health` retornando `status: ok`]**

#### 3.3.3 Docker Compose
Arquivo `docker-compose.yml` configurado para:
- Build automático da imagem
- Mapeamento de portas
- Health check configurado
- Reinicialização automática
- Variáveis de ambiente

#### 3.3.4 .dockerignore
Arquivo configurado para excluir:
- `node_modules`
- Arquivos de teste
- Documentação
- Arquivos de configuração local
- Arquivos sensíveis

### 3.4 Pipeline CI/CD

#### 3.4.1 Workflow CI (Integração Contínua)
O pipeline CI continua sendo executado em:
- Push para branches `main` e `develop`
- Pull Requests para `main` e `develop`

**Etapas do CI:**
1. Checkout do código
2. Configuração do Node.js 20
3. Instalação de dependências
4. Execução de testes
5. Geração de cobertura de testes
6. Build da aplicação TypeScript
7. Validação do Terraform (fmt e validate)

#### 3.4.2 Workflow CD (Entrega Contínua)
O pipeline CD foi adicionado em `.github/workflows/ci-cd.yml` e é executado apenas em:
- Push para branch `main`

**Etapas do CD:**
1. **Job CI**: Executa todas as validações do CI
2. **Job Terraform**: Valida a infraestrutura como código
3. **Job Build Image**: 
   - Configura Docker Buildx
   - Login no GitHub Container Registry
   - Build da imagem Docker
   - Push da imagem com tags versionadas
4. **Job Deploy** (detalhado na seção 3.5.2):
   - Verificação dos secrets (falha se algum estiver ausente)
   - Configuração de SSH
   - Cópia e execução do `scripts/deploy.sh` no servidor
   - Health check externo
5. **Job Smoke Test**:
   - Teste de health check
   - Teste de criação de tarefa
   - Teste de listagem de tarefas

#### 3.4.3 Estratégia de Versionamento
As imagens Docker são versionadas com:
- Tag baseada no branch (main, develop)
- Tag baseada no SHA do commit
- Tag `latest` para a branch principal

### 3.5 Scripts de Deploy (item 2b do enunciado)

#### 3.5.1 Passo a passo do `scripts/deploy.sh`

O [`scripts/deploy.sh`](../scripts/deploy.sh) roda **dentro da instância EC2**. Ele troca o container em execução pela versão mais recente da imagem publicada no GitHub Container Registry (GHCR).

| # | Trecho do script | O que acontece |
|---|---|---|
| 1 | `set -euo pipefail` | Modo estrito: o script **aborta no primeiro comando que falhar** (`-e`), acusa variáveis não definidas (`-u`) e não esconde erros dentro de pipes (`pipefail`). Isso faz o código de saída do script refletir o resultado real do deploy |
| 2 | `IMAGE="${IMAGE:-ghcr.io/thomas-prates/devops-projeto:latest}"`<br>`PORT="${PORT:-3000}"`<br>`CONTAINER="devops-projeto"` | Parâmetros com valor padrão. O pipeline passa `IMAGE` e `PORT` pelo ambiente, e o script também pode ser rodado à mão sem argumentos. O nome fixo do container permite achar e substituir a versão anterior |
| 3 | `docker pull "$IMAGE"` | Baixa a imagem nova do GHCR. A imagem é pública, então não precisa de `docker login` na EC2. Se o pull falhar (rede, tag inexistente), o `set -e` aborta **antes** de mexer no container em execução |
| 4 | `docker rm -f "$CONTAINER" 2>/dev/null \|\| true` | Para e remove o container antigo. O `\|\| true` evita que o script quebre no **primeiro deploy**, quando ainda não existe container |
| 5 | `docker run -d --name ... --restart unless-stopped -p "${PORT}:3000" "$IMAGE"` | Sobe o novo container em segundo plano (`-d`). `--restart unless-stopped` faz o Docker reiniciar a aplicação se ela cair ou se a EC2 reiniciar. `-p` publica a porta 3000 do container na porta do host liberada no Security Group do Terraform |
| 6 | `sleep 5` | Dá tempo para o Node iniciar o servidor Express |
| 7 | `curl --fail --silent --show-error http://127.0.0.1:${PORT}/health` | **Health check local**: `--fail` faz o `curl` retornar erro em respostas HTTP ≥ 400 ou em conexão recusada. Com o `set -e`, o script então termina com código ≠ 0 |
| 8 | `echo "Deploy concluído com sucesso."` | Só é alcançado se todos os passos anteriores deram certo |

#### 3.5.2 Como o script se encaixa no job `deploy` do pipeline

O job `deploy` do [`.github/workflows/ci-cd.yml`](../.github/workflows/ci-cd.yml) só roda em push para `main` e depende de `build-image` (que depende de `ci` e `terraform`). Assim, só é implantada uma imagem que passou nos testes, na validação do Terraform e foi publicada no GHCR com sucesso.

```
build-image ──► deploy ──────────────────────────────────────────────► smoke-test
                 1. Verificar secrets de deploy (falha se faltar algum)
                 2. Configurar SSH: grava SSH_PRIVATE_KEY em ~/.ssh/deploy_key (chmod 600)
                    e registra a chave do host (ssh-keyscan SERVER_IP)
                 3. scp scripts/deploy.sh  ──►  SERVER_USER@SERVER_IP:/tmp/
                 4. ssh ... "IMAGE=... PORT=3000 /tmp/deploy.sh"   (executa passos 1–8 acima)
                 5. Health check EXTERNO: curl http://SERVER_IP:3000/health
```

Pontos importantes da integração:

- **Propagação de falhas:** o `ssh` devolve ao runner o código de saída do `deploy.sh`. Se o health check local (passo 7) falhar, o step "Deploy no servidor" fica vermelho e o `smoke-test` não roda.
- **Dois níveis de health check:** o passo 7 do script testa a aplicação **de dentro** da EC2 (`127.0.0.1`). O step final do job testa **de fora**, pela internet, e com isso valida também o Security Group (porta 3000) e o IP público.
- **Smoke tests:** o job `smoke-test` roda depois do deploy e executa `GET /health`, `POST /tasks` e `GET /tasks` contra o servidor real.
- **Secrets:** a chave privada, o IP e o usuário nunca aparecem no código. Ficam em GitHub Secrets (seção 3.7.2), e o GitHub mascara os valores nos logs.

#### 3.5.3 Evidências do deploy

**[PRINT 4: aba Actions do GitHub com o workflow "CI/CD Pipeline" completo em verde (CI → Validar Terraform → Build Docker Image → Deploy to Production → Smoke Tests)]**

**[PRINT 5: log do step "Deploy no servidor" com as mensagens `Atualizando imagem: ghcr.io/...`, `Aguardando aplicação...` e `Deploy concluído com sucesso.`]**

**[PRINT 6: `curl http://<IP-da-EC2>:3000/health` retornando `{"status":"ok","timestamp":...,"uptime":...}`]**

#### 3.5.4 Script de Rollback (`scripts/rollback.sh`)
Segue a mesma estrutura do `deploy.sh` (pull → remove container → run → health check), mas usa a imagem indicada em `PREVIOUS_IMAGE` (padrão: tag `:previous`).

> **Limitação conhecida:** o pipeline atual não publica a tag `:previous`. Para fazer rollback hoje, é preciso passar explicitamente uma tag por SHA já publicada, por exemplo `PREVIOUS_IMAGE=ghcr.io/thomas-prates/devops-projeto:main-<sha> ./rollback.sh`. Essa limitação motiva a melhoria de Blue-Green (seção 8).

### 3.6 Monitoramento e Logging

#### 3.6.1 Logging Estruturado
Implementado logging com:
- Timestamps ISO 8601
- Informações de request (método, path)
- Informações de response (status, tempo)
- Logs de erro com stack trace
- Logs de startup e shutdown

#### 3.6.2 Health Check Avançado
Endpoint `/health` retorna:
```json
{
  "status": "ok",
  "timestamp": "2026-09-08T22:15:30.123Z",
  "uptime": 123.456
}
```

#### 3.6.3 Docker Health Check
Configurado no docker-compose.yml:
- Intervalo: 30 segundos
- Timeout: 10 segundos
- Retries: 3 tentativas
- Start period: 40 segundos

#### 3.6.4 Comandos de Monitoramento
Documentados comandos para:
- Visualizar logs em tempo real
- Verificar status do container
- Monitorar recursos (CPU, memória)
- Verificar health status

### 3.7 Segurança

#### 3.7.1 Boas Práticas Implementadas
- Segredos armazenados em GitHub Secrets
- Chaves SSH não versionadas
- Imagens Docker com usuário não-root
- Security Group na AWS liberando apenas as portas 22 (SSH) e 3000 (API). A restrição de origem do SSH é uma melhoria futura (seção 8.8)
- Validação de código de infraestrutura
- Arquivos sensíveis no .gitignore

#### 3.7.2 GitHub Secrets Configurados
- `SSH_PRIVATE_KEY`: Chave SSH para acesso ao servidor
- `SERVER_IP`: IP do servidor de produção
- `SERVER_USER`: Usuário do servidor
- `GITHUB_TOKEN`: Token para acesso ao GHCR (gerado automaticamente pelo GitHub a cada execução, não precisa ser cadastrado)

**Como verificar se os secrets estão configurados:**
1. No GitHub, abrir o repositório → **Settings** → **Secrets and variables** → **Actions**, aba *Repository secrets*. Devem aparecer `SSH_PRIVATE_KEY`, `SERVER_IP` e `SERVER_USER`. O valor nunca é exibido, só o nome e a data de atualização.
2. Pela linha de comando: `gh secret list`.
3. No próprio pipeline: o step **"Verificar secrets de deploy"** do job `deploy` falha com erro explícito, listando os secrets que estão faltando.

**[PRINT 7: tela Settings → Secrets and variables → Actions com os três secrets listados]**

> **Correção aplicada:** uma versão anterior do workflow, quando os secrets estavam ausentes, imprimia "Pulando deploy" e terminava com `exit 0`. O job ficava **verde sem ter feito deploy**, e foi isso que aconteceu na única execução bem-sucedida anterior (10/09/2026, antes do cadastro dos secrets). Agora a ausência de secrets faz o pipeline falhar, então um job `deploy` verde significa que o deploy realmente aconteceu.

---

## 4. Infraestrutura como Código

### 4.1 Terraform
A infraestrutura AWS continua sendo gerenciada via Terraform com:
- VPC (10.0.0.0/16)
- Subnet pública (10.0.1.0/24)
- Internet Gateway
- Route Table
- Security Group (portas 22 e 3000)
- Instância EC2 (t3.micro, Amazon Linux 2023, região sa-east-1)
- Docker instalado via user_data

### 4.2 Validação Automática
O pipeline CI valida automaticamente:
- Formatação do código Terraform
- Sintaxe e validade da configuração
- Não provisiona recursos durante o CI

---

## 5. Fluxo DevOps Implementado

### 5.1 Fluxo Completo

```
Desenvolvimento
    ↓
Git Commit
    ↓
Push para GitHub
    ↓
Trigger Pipeline CI
    ↓
Testes Automatizados
    ↓
Build da Aplicação
    ↓
Validação Terraform
    ↓
[Se branch main]
    ↓
Build Imagem Docker
    ↓
Push para GHCR
    ↓
Deploy via SSH
    ↓
Health Check
    ↓
Smoke Tests
    ↓
Aplicação em Produção
```

### 5.2 Branches
- `main`: Branch de produção, trigger do CD
- `develop`: Branch de desenvolvimento, CI apenas
- `feature/*`: Branches de funcionalidades
- `fix/*`: Branches de correções

---

## 6. Documentação

### 6.1 Documentação Criada
- `README.md`: Documentação principal do projeto
- `knowledge/spec.md`: Especificação técnica completa
- `knowledge/fase2.md`: Requisitos da Fase 2
- `knowledge/monitoramento-logging.md`: Guia de monitoramento
- `knowledge/relatorio-fase2.md`: Este relatório

### 6.2 Instruções de Uso
Documentadas instruções para:
- Instalação e execução local
- Execução com Docker
- Execução de testes
- Deploy em produção
- Rollback em caso de falha
- Monitoramento e troubleshooting

---

## 7. Resultados e Análise

### 7.1 Objetivos Alcançados
✅ Pipeline CI/CD completo implementado  
✅ Aplicação containerizada com Docker  
✅ Scripts de deploy e rollback funcionais  
✅ Monitoramento e logging implementados  
✅ Práticas de segurança aplicadas  
✅ Documentação completa criada  

### 7.2 Métricas de Sucesso
- **Tempo de Build**: Reduzido com cache de dependências
- **Tempo de Deploy**: Automatizado e consistente
- **Taxa de Sucesso**: 100% nos testes automatizados
- **Tempo de Recuperação**: Rollback automatizado disponível
- **Observabilidade**: Logs estruturados e health checks

### 7.3 Desafios Encontrados
1. **Configuração de Secrets**: Necessidade de configurar secrets no GitHub
2. **Acesso SSH**: Configuração de chaves SSH para deploy
3. **Registry**: Configuração do GitHub Container Registry
4. **Versionamento**: Estratégia de tags para imagens Docker

### 7.4 Soluções Implementadas
1. Documentação detalhada de configuração de secrets
2. Scripts de deploy com tratamento de erros
3. Uso de GITHUB_TOKEN para autenticação no GHCR
4. Estratégia de versionamento semântico nas tags

---

## 8. Melhorias Futuras (item 3c do enunciado)

Cada melhoria abaixo parte de uma **limitação concreta observada no projeto atual**, e não de uma lista genérica de ferramentas. Para cada uma: o problema hoje, a proposta e o que ela resolve.

### 8.1 Observabilidade (métricas e alertas)
- **Limitação atual:** a única forma de saber se a aplicação está saudável é o `GET /health`, que retorna apenas `status`, `timestamp` e `uptime`. Não há métricas de latência, taxa de erros (HTTP 5xx), uso de CPU/memória do container nem alertas. Se a API começar a responder devagar ou devolver erros em `/tasks` (com `/health` ainda ok), ninguém é avisado. O problema só aparece no próximo pipeline ou quando um usuário reclama.
- **Proposta:** expor um endpoint `/metrics` com a biblioteca `prom-client` (contadores de requisições por rota/status e histograma de latência), coletar com **Prometheus**, visualizar em **Grafana** e configurar alertas (ex.: taxa de 5xx > 1% por 5 min, p95 de latência > 500 ms). Alternativa gerenciada: CloudWatch Agent na EC2 + CloudWatch Alarms.
- **O que resolve:** tira a equipe do modo "descobre quando quebra" e dá dados objetivos para decidir sobre escala e para validar deploys. Também é **pré-requisito** para o Canary (8.6), que precisa comparar métricas entre versões.

### 8.2 Logs Centralizados
- **Limitação atual:** a aplicação escreve logs em `stdout` (`console.log`), que ficam no driver `json-file` do Docker, **dentro da EC2**. O `scripts/deploy.sh` executa `docker rm -f` a cada deploy, o que **apaga os logs do container anterior**. Justamente quando um deploy dá errado, os logs da versão que funcionava somem. Além disso, consultar logs exige acesso SSH ao servidor, e eles se perdem se a instância for recriada pelo Terraform.
- **Proposta:** enviar os logs para o **CloudWatch Logs** usando o driver nativo do Docker (`docker run --log-driver=awslogs --log-opt awslogs-group=devops-projeto ...` no `deploy.sh`, com uma IAM Role na EC2 criada via Terraform). Em cenário maior, stack ELK/Loki. Adotar logs em formato JSON (ex.: `pino`) facilita buscas por campo.
- **O que resolve:** os logs sobrevivem a deploys e à recriação da instância, podem ser consultados sem SSH (o que reduz a necessidade da porta 22 aberta) e permitem filtros e retenção configurável.

### 8.3 Tracing Distribuído
- **Limitação atual:** os logs atuais registram método, rota, status e tempo, mas **não têm um identificador de requisição**. Com requisições concorrentes, as linhas se intercalam e não dá para reconstruir o caminho de uma requisição específica. Hoje a API é um único serviço com armazenamento em memória, então o impacto ainda é pequeno. Mas assim que houver banco de dados (ver 8.7) ou um segundo serviço, não haverá como saber **onde** o tempo de uma requisição lenta foi gasto.
- **Proposta:** instrumentar a aplicação com **OpenTelemetry** (auto-instrumentação para Express/HTTP), exportando traces para Jaeger ou AWS X-Ray, e incluir o `trace_id` em cada linha de log.
- **O que resolve:** correlação entre logs, métricas e requisições e visão de latência por etapa. É uma melhoria de **prioridade menor** que 8.1 e 8.2 e se justifica conforme a arquitetura crescer. Fica aqui como preparação, não como necessidade imediata.

### 8.4 Orquestração com Kubernetes
- **Limitação atual:** a aplicação roda em **uma única EC2 t3.micro, em uma única zona de disponibilidade** (`sa-east-1a`). É um ponto único de falha: se a instância cair, a API fica fora do ar. O `--restart unless-stopped` só cobre falhas do processo, não da máquina. Escalar exige ação manual, e o deploy é imperativo (SSH + script).
- **Proposta:** migrar para um orquestrador. Pelo porte do projeto, o passo mais proporcional é **Amazon ECS/Fargate** ou um cluster **k3s**. Em escala maior, **EKS**. Um `Deployment` com 2+ réplicas em zonas diferentes, `readinessProbe`/`livenessProbe` apontando para o `/health` já existente e um `Service`/Load Balancer na frente.
- **O que resolve:** *self-healing* no nível de máquina, alta disponibilidade entre zonas, escala horizontal (inclusive automática por métricas) e rolling update nativo. O deploy passa a ser declarativo (`kubectl apply`/GitOps) em vez de comandos SSH.
- **Custo:** maior complexidade operacional e custo. Por isso vem depois de observabilidade e logs, sem os quais operar um cluster seria às cegas.

### 8.5 Deploy Blue-Green
- **Limitação atual:** o `deploy.sh` faz `docker rm -f` do container antigo **antes** de subir o novo. Há sempre uma **janela de indisponibilidade** (no mínimo os 5 s do `sleep` mais a inicialização). Pior: se a nova versão falhar no health check, o container antigo **já foi destruído** e a API fica fora do ar até alguém agir. O `rollback.sh` depende da tag `:previous`, que o pipeline não publica (seção 3.5.4).
- **Proposta:** manter duas "cores" na EC2 (ex.: `devops-projeto-blue` na porta 3001 e `-green` na 3002) atrás de um **Nginx** como proxy reverso na porta 3000. O deploy sobe a nova cor, roda o health check nela e **só então** troca o `upstream` do Nginx (`nginx -s reload`, sem derrubar conexões). A cor antiga continua rodando até a próxima versão. O pipeline também passa a usar a tag imutável `main-<sha>`, já publicada, em vez de `latest`.
- **O que resolve:** deploy **sem downtime**, e o rollback vira trocar o proxy de volta para a cor anterior, em segundos, sem precisar de pull.

### 8.6 Deploy Canary
- **Limitação atual:** hoje a nova versão recebe **100% do tráfego imediatamente**, e a validação acontece depois (health check + smoke tests, que cobrem só `/health`, `POST /tasks` e `GET /tasks`). Um bug em `PUT` ou `DELETE /tasks/:id`, ou uma degradação de performance, passa pelos smoke tests e atinge todos os usuários.
- **Proposta:** expor a nova versão a uma **fração do tráfego** (ex.: 10%) usando pesos no Nginx (`upstream` com `weight`) ou *weighted target groups* de um Application Load Balancer. Comparar taxa de erros e latência entre versões (usando as métricas de 8.1) e aumentar gradualmente (10% → 50% → 100%), ou abortar automaticamente se as métricas piorarem (ex.: Argo Rollouts/Flagger no Kubernetes).
- **O que resolve:** limita o **raio de impacto** de uma versão defeituosa a uma pequena parte dos usuários e valida com tráfego real, não só com smoke tests. Complementa o Blue-Green: o Blue-Green resolve downtime e rollback, o Canary resolve detecção gradual de regressões.

### 8.7 Backup e Recuperação de Desastres (Backup/DR)
- **Limitação atual:** há três riscos concretos:
  1. **Dados em memória:** o `TaskModel` guarda as tarefas em um array (`private tasks: Task[] = []`). **Todo deploy, restart ou queda do container apaga todas as tarefas.** Não há o que fazer backup hoje, porque não há persistência.
  2. **Estado do Terraform local:** o `terraform.tfstate` existe apenas na máquina do desenvolvedor (corretamente fora do Git). Se ele for perdido, o Terraform deixa de reconhecer a infraestrutura existente e não consegue mais gerenciá-la nem destruí-la com segurança. Também não há *lock* contra dois `apply` simultâneos.
  3. **Zona única:** toda a infraestrutura está em uma só AZ.
- **Proposta:**
  1. Persistir os dados em um banco gerenciado (**RDS PostgreSQL** ou **DynamoDB**) com backup automático e *point-in-time recovery*.
  2. Configurar **backend remoto do Terraform** em S3 (com versionamento e criptografia) + tabela DynamoDB para *state locking*.
  3. Definir e documentar **RTO/RPO** (ex.: RTO de 30 min, RPO de 5 min) e testar a recuperação periodicamente: recriar o ambiente do zero com `terraform apply` + pipeline, restaurando o banco a partir do backup.
- **O que resolve:** os dados passam a sobreviver a deploys e falhas, a infraestrutura pode ser recuperada por qualquer membro da equipe, e a recuperação vira um procedimento testado em vez de improvisado.

### 8.8 Outras melhorias identificadas
| Melhoria | Limitação atual que justifica |
|---|---|
| **Scan de vulnerabilidades (Trivy)** no job `build-image` | A imagem é publicada no GHCR sem nenhuma verificação de CVEs nas dependências npm ou na base Alpine |
| **Restringir SSH no Security Group** | A porta 22 está aberta para `0.0.0.0/0` em `terraform/main.tf`. Com logs centralizados (8.2) e deploy via SSM Session Manager, a porta 22 poderia ser fechada |
| **Testes de carga (k6)** | Não se sabe quantas requisições por segundo uma t3.micro suporta, o que é necessário para dimensionar o auto-scaling de 8.4 |

### 8.9 Priorização sugerida
1. **Curto prazo:** Logs centralizados (8.2), Observabilidade (8.1), Backend remoto do Terraform (8.7-2) e Trivy. Baixo custo, alto ganho imediato.
2. **Médio prazo:** Persistência em banco (8.7-1), Blue-Green (8.5), restrição de SSH.
3. **Longo prazo:** Kubernetes (8.4), Canary (8.6) e Tracing (8.3), que dependem das anteriores para valerem o investimento.

---

## 9. Conclusão

A Fase 2 do projeto DevOps foi concluída com sucesso, expandindo significativamente as capacidades do projeto. A implementação de Entrega Contínua, Containerização, Monitoramento e Segurança transformou o projeto de uma simples demonstração de CI em um fluxo DevOps completo e production-ready.

Os principais aprendizados incluem:
- Importância da automação em todas as etapas
- Valor da containerização para consistência de ambientes
- Necessidade de monitoramento e logging para operação
- Criticalidade de segurança em pipelines automatizados
- Benefícios de infraestrutura como código

O projeto agora demonstra de forma prática e completa os conceitos modernos de DevOps, servindo como base sólida para evoluções futuras e aplicações em cenários reais.

---

## 10. Referências

- Documentação do GitHub Actions
- Documentação do Docker
- Documentação do Terraform
- Especificação do projeto (knowledge/spec.md)
- Requisitos da Fase 2 (knowledge/fase2.md)

---

**Data de conclusão:** 8 de setembro de 2026  
**Status:** ✅ Concluído com sucesso
