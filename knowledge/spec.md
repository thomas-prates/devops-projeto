# SPEC.md — Task DevOps API

## 1. Visão geral

### 1.1 Nome do projeto

**Task DevOps API**

### 1.2 Objetivo do documento

Este documento especifica o projeto DevOps desenvolvido para a disciplina **DevOps na Prática**, consolidando os requisitos, decisões técnicas, estrutura esperada, entregas da Fase 1 e o escopo de implementação da Fase 2.

A especificação deve servir como referência para implementação em outro ambiente de desenvolvimento sem depender do contexto da conversa em que o projeto foi definido.

> **Importante sobre o estado atual:** até o momento, a maior parte do conteúdo da Fase 1 foi **definida/especificada** (arquitetura, estrutura, pipeline e scripts propostos), mas não há evidência nesta conversa de que todos os recursos tenham sido efetivamente executados, publicados ou validados em uma conta GitHub/AWS. Portanto, este documento diferencia requisitos e implementação prevista de itens que precisam ser comprovados por execução.

---

## 2. Contexto acadêmico

O projeto atende à Fase 1 e à Fase 2 da disciplina.

### Fase 1 — Configuração e Automação Inicial

Escopo principal:

- Documentação de planejamento;
- Repositório de código no GitHub;
- Pipeline de Integração Contínua (CI) com GitHub Actions;
- Testes automatizados;
- Infraestrutura como Código (IaC) com Terraform.

### Fase 2 — Entrega Contínua, Monitoramento e Segurança

Escopo principal informado no enunciado:

- Expansão do pipeline de CI para incluir Entrega Contínua (CD);
- Containerização da aplicação com Docker;
- Scripts de deploy usando containers;
- Relatório final das etapas do projeto;
- Fluxograma completo do fluxo DevOps;
- Análise dos resultados e sugestões de melhorias futuras.

As aulas indicadas para a Fase 2 são:

1. Entrega Contínua (CD);
2. Containers e Orquestração;
3. Monitoramento e Logging;
4. Segurança em DevOps;
5. Teste;
6. Gerenciamento de Configurações;
7. DevOps na Prática.

O template disponibilizado pelos professores organiza a entrega em três seções: **Pipeline de Entrega Contínua**, **Implementação de Containers e Orquestração** e **Relatório Final e Demonstração**.

---

## 3. Descrição do projeto

O **Task DevOps API** é uma API REST simples para gerenciamento de tarefas. O sistema deverá permitir operações básicas de cadastro, consulta, atualização e exclusão de tarefas e disponibilizar um endpoint de saúde da aplicação.

O objetivo técnico do projeto não é construir um sistema de negócio complexo, mas fornecer uma aplicação pequena e controlável que permita demonstrar práticas DevOps de ponta a ponta:

```text
Código → Versionamento → CI → Testes → Build → Container → CD → Deploy → Monitoramento/Logs → Segurança
```

A aplicação será utilizada como veículo para demonstrar automação, integração contínua, entrega contínua, infraestrutura como código e posteriormente containerização, deploy, monitoramento, logging e segurança.

---

## 4. Objetivos

### 4.1 Objetivos gerais

- Aplicar conceitos de DevOps em um projeto executável;
- Automatizar validações do código;
- Automatizar a entrega da aplicação;
- Descrever infraestrutura por código;
- Containerizar a aplicação;
- Demonstrar um fluxo DevOps completo.

### 4.2 Objetivos específicos

- Criar uma API REST de tarefas;
- Versionar o código no GitHub;
- Implementar testes automatizados;
- Configurar GitHub Actions para CI;
- Validar código e infraestrutura automaticamente;
- Provisionar infraestrutura AWS com Terraform;
- Criar imagem Docker da aplicação;
- Automatizar o deploy do container;
- Documentar todas as etapas;
- Criar um fluxograma do fluxo DevOps;
- Avaliar resultados e propor melhorias.

---

## 5. Requisitos da aplicação

### 5.1 Requisitos funcionais

A API deve possuir, no mínimo:

- `POST /tasks` — criar tarefa;
- `GET /tasks` — listar tarefas;
- `GET /tasks/:id` — consultar tarefa por identificador;
- `PUT /tasks/:id` — atualizar tarefa;
- `DELETE /tasks/:id` — remover tarefa;
- `GET /health` — verificar disponibilidade da aplicação.

Uma tarefa deve possuir, no mínimo:

- `id`;
- `title`;
- `description`;
- `status`;
- `createdAt`.

Status mínimos:

- `pending`;
- `completed`.

### 5.2 Requisitos não funcionais

- Node.js como runtime;
- Express para API HTTP;
- Jest e Supertest para testes;
- Git para versionamento;
- GitHub para hospedagem do código;
- GitHub Actions para CI/CD;
- Terraform para IaC;
- AWS como ambiente de infraestrutura;
- Docker para containerização;
- Configurações e segredos fora do código-fonte;
- README com instruções de execução;
- Projeto organizado em diretórios de código, testes, workflow e infraestrutura.

---

## 6. Stack tecnológica

### Aplicação

- Node.js
- JavaScript
- Express

### Testes

- Jest
- Supertest

### DevOps

- Git
- GitHub
- GitHub Actions
- Docker
- Terraform

### Nuvem

- AWS
- EC2
- VPC
- Subnet pública
- Internet Gateway
- Route Table
- Security Group

### Componentes da Fase 2 a incorporar

- Container Registry, preferencialmente GitHub Container Registry (GHCR) ou AWS ECR;
- Monitoramento e logging;
- Mecanismos de segurança do pipeline e da infraestrutura.

---

## 7. Estrutura do repositório

Estrutura alvo:

```text
task-devops-api/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── ci-cd.yml
├── infrastructure/
│   ├── main.tf
│   ├── provider.tf
│   ├── variables.tf
│   ├── outputs.tf
│   ├── versions.tf
│   └── terraform.tfvars.example
├── src/
│   ├── app.js
│   ├── server.js
│   └── routes/
│       └── tasks.js
├── tests/
│   ├── health.test.js
│   └── tasks.test.js
├── scripts/
│   ├── deploy.sh
│   └── rollback.sh
├── Dockerfile
├── .dockerignore
├── docker-compose.yml
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

Os nomes podem ser ajustados durante a implementação, desde que as responsabilidades permaneçam equivalentes.

---

# 8. FASE 1 — Configuração e Automação Inicial

## 8.1 Documentação de planejamento

Foram definidos:

- Descrição do projeto;
- Objetivos;
- Requisitos funcionais;
- Requisitos não funcionais;
- Estratégia de branches;
- Plano de CI;
- Especificação inicial de infraestrutura;
- Organização dos arquivos Terraform;
- Estrutura esperada do repositório.

### Estado

**Definido/especificado.** A execução e as evidências devem ser produzidas no ambiente real.

---

## 8.2 Configuração do GitHub

### Repositório esperado

```text
https://github.com/SEU-USUARIO/task-devops-api
```

O placeholder deve ser substituído pelo endereço real após criação do repositório.

### Estratégia de branches

- `main`: versão estável;
- `develop`: integração do desenvolvimento;
- `feature/*`: novas funcionalidades;
- `fix/*`: correções.

### Regras de fluxo

1. Desenvolver em branch de funcionalidade/correção;
2. Executar testes localmente;
3. Fazer push para GitHub;
4. Abrir Pull Request;
5. Executar CI automaticamente;
6. Corrigir falhas;
7. Integrar após aprovação.

### Estado

**Especificado.** Criar/configurar o repositório real e registrar as evidências.

---

## 8.3 Testes automatizados

A aplicação deve usar Jest e Supertest.

Mínimo de cobertura funcional:

- `GET /health` retorna HTTP 200 e corpo esperado;
- criação de tarefa;
- listagem de tarefas;
- consulta por ID;
- atualização;
- exclusão;
- tratamento de tarefa inexistente;
- validação de campos obrigatórios.

Exemplo de teste do endpoint de saúde:

```javascript
const request = require("supertest");
const app = require("../src/app");

describe("GET /health", () => {
  it("deve retornar o status da aplicação", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "ok"
    });
  });
});
```

Scripts esperados no `package.json`:

```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "node --watch src/server.js",
    "test": "jest --runInBand",
    "test:coverage": "jest --coverage --runInBand"
  }
}
```

### Estado

**Especificado.** Implementar e executar os testes para gerar evidência real.

---

## 8.4 Pipeline de Integração Contínua

O workflow da Fase 1 deve estar em:

```text
.github/workflows/ci.yml
```

O pipeline deve disparar em:

- `push` para `main`;
- `push` para `develop`;
- `pull_request` para `main`;
- `pull_request` para `develop`.

### Etapas de CI

1. Checkout;
2. Configuração do Node.js;
3. Instalação das dependências;
4. Testes automatizados;
5. Cobertura de testes;
6. Inicialização do Terraform sem backend remoto;
7. `terraform fmt -check`;
8. `terraform validate`.

### Workflow de referência

```yaml
name: Continuous Integration

on:
  push:
    branches:
      - main
      - develop

  pull_request:
    branches:
      - main
      - develop

jobs:
  test:
    name: Testar aplicação
    runs-on: ubuntu-latest

    steps:
      - name: Checkout do código
        uses: actions/checkout@v4

      - name: Configurar Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Instalar dependências
        run: npm ci

      - name: Executar testes
        run: npm test

      - name: Executar cobertura
        run: npm run test:coverage

  terraform:
    name: Validar Terraform
    runs-on: ubuntu-latest

    defaults:
      run:
        working-directory: infrastructure

    steps:
      - name: Checkout do código
        uses: actions/checkout@v4

      - name: Instalar Terraform
        uses: hashicorp/setup-terraform@v3

      - name: Inicializar Terraform
        run: terraform init -backend=false

      - name: Verificar formatação
        run: terraform fmt -check

      - name: Validar Terraform
        run: terraform validate
```

### Observação importante

O pipeline da Fase 1 executa validações de Terraform, mas **não deve provisionar recursos AWS durante o CI**. O objetivo do CI é validar o código de infraestrutura. O provisionamento real deve ser feito de maneira controlada no processo de entrega/deploy.

### Estado

**Workflow especificado.** Deve ser criado no GitHub e executado com sucesso.

---

# 9. Infraestrutura como Código — Terraform

## 9.1 Objetivo

Descrever e provisionar a infraestrutura da aplicação de maneira versionada, reproduzível e automatizada.

## 9.2 Infraestrutura planejada

- VPC `10.0.0.0/16`;
- Subnet pública `10.0.1.0/24`;
- Internet Gateway;
- Route Table com rota `0.0.0.0/0`;
- Security Group;
- EC2;
- IP público para acesso da aplicação.

## 9.3 Região e instância

Valores planejados:

- Região AWS: `us-east-1`;
- Tipo de instância: `t2.micro` como referência inicial;
- Sistema operacional: Amazon Linux 2023;
- Porta da aplicação: `3000`.

Os valores devem ser parametrizados sempre que possível.

## 9.4 Arquivos Terraform

### `versions.tf`

```hcl
terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}
```

### `provider.tf`

```hcl
provider "aws" {
  region = var.aws_region
}
```

### `variables.tf`

```hcl
variable "aws_region" {
  description = "Região da AWS"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Nome do projeto"
  type        = string
  default     = "task-devops-api"
}

variable "instance_type" {
  description = "Tipo da instância EC2"
  type        = string
  default     = "t2.micro"
}

variable "application_port" {
  description = "Porta utilizada pela aplicação"
  type        = number
  default     = 3000
}
```

### `main.tf`

A implementação deve criar os recursos AWS necessários para rede e execução da aplicação. A versão inicial proposta inclui VPC, subnet pública, Internet Gateway, route table, Security Group e EC2.

Exemplo de referência:

```hcl
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-2023.*-x86_64"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "${var.project_name}-vpc"
  }
}

resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true

  tags = {
    Name = "${var.project_name}-public-subnet"
  }
}

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "${var.project_name}-internet-gateway"
  }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = {
    Name = "${var.project_name}-public-route-table"
  }
}

resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

resource "aws_security_group" "application" {
  name        = "${var.project_name}-security-group"
  description = "Permite acesso à aplicação"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "Acesso à aplicação"
    from_port   = var.application_port
    to_port     = var.application_port
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Acesso SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Todo tráfego de saída"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-security-group"
  }
}

resource "aws_instance" "application" {
  ami                         = data.aws_ami.amazon_linux.id
  instance_type               = var.instance_type
  subnet_id                   = aws_subnet.public.id
  vpc_security_group_ids      = [aws_security_group.application.id]
  associate_public_ip_address = true

  user_data = <<-EOF
    #!/bin/bash
    dnf update -y
    dnf install -y git nodejs npm

    mkdir -p /opt/task-devops-api
    echo "Infraestrutura provisionada com Terraform" > /opt/task-devops-api/status.txt
  EOF

  tags = {
    Name = "${var.project_name}-server"
  }
}
```

### `outputs.tf`

```hcl
output "instance_id" {
  description = "ID da instância EC2"
  value       = aws_instance.application.id
}

output "public_ip" {
  description = "IP público da instância"
  value       = aws_instance.application.public_ip
}

output "application_url" {
  description = "URL da aplicação"
  value       = "http://${aws_instance.application.public_ip}:${var.application_port}"
}
```

### `terraform.tfvars.example`

```hcl
aws_region       = "us-east-1"
project_name     = "task-devops-api"
instance_type    = "t2.micro"
application_port = 3000
```

## 9.5 Comandos Terraform

```bash
terraform init
terraform fmt
terraform validate
terraform plan
terraform apply
```

Para remoção:

```bash
terraform destroy
```

### Segurança de credenciais

Nunca versionar:

- chaves AWS;
- tokens;
- senhas;
- arquivos `.tfvars` com segredos reais;
- credenciais de registry.

O `.gitignore` deve ignorar arquivos sensíveis.

### Estado

**Arquitetura e scripts de referência definidos.** A infraestrutura real ainda precisa ser provisionada e validada. Durante a implementação da Fase 2, a estratégia de estado remoto e o gerenciamento das credenciais devem ser definidos conforme o ambiente utilizado.

---

# 10. FASE 2 — Entrega Contínua, Monitoramento e Segurança

## 10.1 Objetivo da Fase 2

Evoluir o projeto da simples integração contínua para um fluxo de **Entrega Contínua**, incorporando containers, deploy automatizado, observabilidade, segurança e documentação final.

---

## 10.2 Item 1 — Pipeline de Entrega Contínua (CD)

### Requisito

Expandir o pipeline de CI existente para incluir CD.

### Objetivo

Após a aprovação das validações, gerar uma imagem da aplicação e disponibilizá-la para deploy automatizado em ambiente de execução.

### Fluxo esperado

```text
Push / Pull Request
        ↓
Checkout
        ↓
Instalar dependências
        ↓
Testes automatizados
        ↓
Validação Terraform
        ↓
Build da aplicação
        ↓
Build da imagem Docker
        ↓
Push da imagem para Registry
        ↓
Deploy no ambiente
        ↓
Health Check
        ↓
Resultado do deploy
```

### Critérios

O CD deve:

- utilizar o workflow do GitHub Actions;
- depender da aprovação do CI;
- construir imagem Docker;
- publicar imagem em registry;
- executar deploy da versão validada;
- realizar health check após deploy;
- falhar claramente quando alguma etapa crítica falhar.

### Separação recomendada

O workflow pode ter jobs semelhantes a:

```text
ci
 ↓
image
 ↓
deploy
 ↓
smoke-test
```

O job `deploy` só deve iniciar depois do sucesso dos jobs de validação.

---

## 10.3 Item 2 — Containerização da aplicação com Docker

### Requisito

Containerizar a Task DevOps API.

### Arquivo `Dockerfile`

Criar um Dockerfile multi-stage ou, para simplificação acadêmica, um Dockerfile enxuto baseado em Node.js.

Requisitos mínimos:

- imagem base Node.js;
- instalação das dependências;
- cópia dos arquivos necessários;
- exposição da porta `3000`;
- comando de inicialização da API;
- execução preferencial com usuário sem privilégios de root.

Exemplo de referência:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY src ./src

EXPOSE 3000

USER node

CMD ["node", "src/server.js"]
```

### Arquivo `.dockerignore`

Deve excluir, no mínimo:

```text
node_modules
npm-debug.log
.git
.github
coverage
.env
*.tfvars
```

### Validações locais

```bash
docker build -t task-devops-api:local .
docker run --rm -p 3000:3000 task-devops-api:local
```

Depois:

```bash
curl http://localhost:3000/health
```

O resultado esperado é HTTP 200 e:

```json
{
  "status": "ok"
}
```

---

## 10.4 Item 2 — Scripts de deploy usando containers

### Objetivo

Automatizar o ciclo de atualização do container no ambiente de execução.

### Estratégia inicial

A aplicação será executada em uma EC2 provisionada por Terraform.

O fluxo de deploy deve:

1. Obter a nova imagem;
2. Parar/remover o container antigo;
3. Baixar/executar a imagem nova;
4. Publicar a porta `3000`;
5. Reiniciar a aplicação;
6. Executar health check;
7. Sinalizar falha se a aplicação não responder corretamente.

### Script de referência `scripts/deploy.sh`

```bash
#!/usr/bin/env bash
set -euo pipefail

IMAGE="${IMAGE:-ghcr.io/SEU-USUARIO/task-devops-api:latest}"
CONTAINER="task-devops-api"
PORT="${PORT:-3000}"

printf 'Atualizando imagem: %s\n' "$IMAGE"
docker pull "$IMAGE"

docker rm -f "$CONTAINER" 2>/dev/null || true

docker run -d \
  --name "$CONTAINER" \
  --restart unless-stopped \
  -p "${PORT}:3000" \
  "$IMAGE"

echo "Aguardando aplicação..."
sleep 5

curl --fail --silent --show-error "http://127.0.0.1:${PORT}/health" > /dev/null

echo "Deploy concluído com sucesso."
```

### Rollback

Criar `scripts/rollback.sh` para voltar à última imagem conhecida como funcional, quando aplicável.

O mecanismo de rollback deve ser simples e documentado no README.

---

# 11. Monitoramento e Logging

O enunciado informa que a Fase 2 abrange monitoramento e logging, embora os itens de entrega listados no template estejam concentrados em CD, containers e relatório.

Para reduzir o risco de cobertura insuficiente, implementar ao menos uma solução simples de observabilidade.

## 11.1 Requisitos mínimos

- Endpoint `/health`;
- logs de inicialização da aplicação;
- logs de requisições ou eventos relevantes;
- possibilidade de inspecionar logs do container;
- registro de falha durante o deploy;
- documentação de como consultar logs.

### Comandos Docker

```bash
docker logs task-devops-api
docker ps
docker inspect task-devops-api
```

## 11.2 Melhoria opcional

Adicionar uma solução de monitoramento AWS ou ferramenta equivalente para métricas da instância/container.

Exemplos de indicadores:

- disponibilidade;
- CPU;
- memória, quando disponível;
- número de reinícios do container;
- tempo de resposta do health check.

---

# 12. Segurança em DevOps

A implementação da Fase 2 deve considerar segurança no código, pipeline, containers e infraestrutura.

## 12.1 Requisitos mínimos

- Não armazenar secrets no Git;
- utilizar GitHub Secrets para credenciais necessárias ao pipeline;
- evitar credenciais AWS hardcoded;
- usar permissões mínimas necessárias no GitHub Actions;
- executar o container com usuário não-root;
- limitar portas expostas;
- restringir SSH ao IP necessário sempre que possível;
- revisar dependências do Node.js;
- não copiar arquivos `.env` ou segredos para a imagem.

## 12.2 Possíveis verificações adicionais

Adicionar ao pipeline, quando possível:

- `npm audit`;
- verificação de vulnerabilidades de imagem;
- secret scanning;
- lint;
- validação de configuração Terraform.

Essas verificações fortalecem a demonstração, mas devem ser mantidas compatíveis com o escopo acadêmico.

---

# 13. Gerenciamento de Configurações

As configurações devem ser separadas do código da aplicação sempre que necessário.

Valores como:

- porta da aplicação;
- endereço do registry;
- tag da imagem;
- ambiente (`development`, `staging`, `production`);
- parâmetros de infraestrutura;

devem ser tratados como variáveis de configuração.

Segredos nunca devem ser armazenados no repositório.

---

# 14. Testes na Fase 2

Além dos testes automatizados existentes, o projeto deve incluir pelo menos um teste de fumaça (smoke test) após o deploy.

## Fluxo

```text
Deploy
  ↓
GET /health
  ↓
HTTP 200?
 ├── Sim → Deploy aprovado
 └── Não → Deploy reprovado / rollback
```

Também devem ser executados os testes da aplicação antes da criação da imagem.

---

# 15. Orquestração

O enunciado da Fase 2 menciona **Containers e Orquestração**.

Para manter a solução compatível com o escopo de um projeto DevOps simples, a primeira implementação pode usar Docker diretamente em uma EC2 e `docker-compose.yml` para definir o serviço local/de demonstração.

Exemplo:

```yaml
services:
  api:
    build: .
    container_name: task-devops-api
    ports:
      - "3000:3000"
    restart: unless-stopped
```

Caso o professor exija uma plataforma de orquestração formal, a solução pode evoluir posteriormente para ECS, Kubernetes ou outro orquestrador. Essa decisão deve ser tomada apenas quando houver requisito explícito ou necessidade acadêmica.

---

# 16. Relatório Final e Demonstração

A Fase 2 exige um documento final em PDF conforme o modelo dos professores.

O template disponibilizado está estruturado em três seções:

### Seção 1 — Pipeline de Entrega Contínua

Deve documentar a expansão do CI para CD.

Incluir:

- descrição do pipeline;
- etapas;
- workflow;
- evidências de execução;
- resultado.

### Seção 2 — Implementação de Containers e Orquestração

O template separa:

- containerização da aplicação com Docker;
- scripts de deploy usando containers.

Incluir:

- Dockerfile;
- estrutura dos containers;
- comandos de execução;
- script de deploy;
- evidência de execução;
- link do GitHub.

### Seção 3 — Relatório Final e Demonstração

Incluir:

- resumo da Fase 1;
- resumo da Fase 2;
- demonstração prática;
- fluxograma completo;
- resultados;
- melhorias futuras;
- conclusão.

---

# 17. Fluxograma final esperado

O fluxo completo deverá representar pelo menos:

```text
                  ┌──────────────┐
                  │ Desenvolvedor│
                  └──────┬───────┘
                         │
                         ▼
                  ┌──────────────┐
                  │    GitHub    │
                  └──────┬───────┘
                         │
                         ▼
               ┌───────────────────┐
               │   GitHub Actions  │
               │      CI/CD        │
               └─────────┬─────────┘
                         │
              ┌──────────┴──────────┐
              ▼                     ▼
        ┌─────────────┐      ┌──────────────┐
        │Testes / CI  │      │Terraform     │
        │Build / Lint │      │Validate      │
        └──────┬──────┘      └──────┬───────┘
               └──────────┬─────────┘
                          ▼
                  ┌──────────────┐
                  │ Docker Build │
                  └──────┬───────┘
                         ▼
                  ┌──────────────┐
                  │    Registry  │
                  └──────┬───────┘
                         ▼
                  ┌──────────────┐
                  │   Deploy     │
                  │   para EC2   │
                  └──────┬───────┘
                         ▼
                  ┌──────────────┐
                  │ Docker       │
                  │ Container    │
                  └──────┬───────┘
                         ▼
                  ┌──────────────┐
                  │ /health      │
                  │ Smoke Test   │
                  └──────┬───────┘
                         ▼
                ┌──────────────────┐
                │Monitoramento /   │
                │Logs / Segurança  │
                └──────────────────┘
```

---

# 18. Evidências exigidas

Para comprovar que a implementação realmente foi concluída, coletar pelo menos:

1. Repositório GitHub;
2. Estrutura dos diretórios;
3. Workflow do GitHub Actions;
4. Execução bem-sucedida do CI;
5. Arquivos Terraform;
6. `terraform validate` bem-sucedido;
7. Dockerfile;
8. Imagem Docker criada;
9. Container em execução;
10. Logs do container;
11. Execução do `/health`;
12. Pipeline CD concluído;
13. Evidência do deploy;
14. Infraestrutura AWS, quando aplicável;
15. Fluxograma completo.

---

# 19. Critérios de aceite técnicos

O projeto será considerado tecnicamente pronto quando, no mínimo:

### Aplicação

- [ ] API inicia localmente;
- [ ] `/health` retorna HTTP 200;
- [ ] endpoints de tarefas funcionam;
- [ ] testes automatizados passam.

### GitHub

- [ ] repositório criado;
- [ ] estrutura de branches definida;
- [ ] README documentado.

### CI

- [ ] workflow executa automaticamente;
- [ ] dependências são instaladas;
- [ ] testes passam;
- [ ] Terraform é validado;
- [ ] execução do pipeline fica registrada.

### IaC

- [ ] `terraform init` funciona;
- [ ] `terraform fmt -check` funciona;
- [ ] `terraform validate` funciona;
- [ ] `terraform plan` funciona no ambiente configurado;
- [ ] infraestrutura pode ser criada/destruída de forma controlada.

### Docker

- [ ] imagem é criada;
- [ ] container inicia;
- [ ] `/health` funciona no container;
- [ ] aplicação gera logs.

### CD

- [ ] imagem é publicada em registry;
- [ ] deploy é automatizado;
- [ ] health check pós-deploy funciona;
- [ ] falha de deploy é identificada.

### Segurança

- [ ] nenhum secret está no repositório;
- [ ] credenciais são tratadas com secrets/variáveis;
- [ ] imagem não executa como root quando possível;
- [ ] portas estão documentadas e justificadas.

### Entrega acadêmica

- [ ] relatório final preenchido;
- [ ] fluxograma incluído;
- [ ] resultados analisados;
- [ ] melhorias futuras documentadas;
- [ ] PDF final preparado conforme o template dos professores.

---

# 20. Backlog de implementação da Fase 2

## Etapa 1 — Preparação

- [ ] Revisar implementação final da Fase 1;
- [ ] garantir que CI esteja verde;
- [ ] garantir que os testes estejam funcionando;
- [ ] garantir que Terraform esteja válido.

## Etapa 2 — Docker

- [ ] criar `Dockerfile`;
- [ ] criar `.dockerignore`;
- [ ] criar `docker-compose.yml`;
- [ ] testar build local;
- [ ] testar container local;
- [ ] validar `/health`.

## Etapa 3 — Registry

- [ ] escolher GHCR ou ECR;
- [ ] criar configuração de autenticação;
- [ ] criar secrets necessários;
- [ ] testar push da imagem.

## Etapa 4 — CD

- [ ] criar/expandir workflow `ci-cd.yml`;
- [ ] adicionar build da imagem;
- [ ] publicar a imagem;
- [ ] executar deploy;
- [ ] executar smoke test;
- [ ] documentar rollback.

## Etapa 5 — Monitoramento e logging

- [ ] revisar logs da aplicação;
- [ ] revisar logs do container;
- [ ] documentar health check;
- [ ] adicionar monitoramento simples;
- [ ] registrar falhas relevantes.

## Etapa 6 — Segurança

- [ ] revisar secrets;
- [ ] revisar permissões do GitHub Actions;
- [ ] executar auditoria de dependências;
- [ ] revisar portas do Security Group;
- [ ] revisar execução do container sem root;
- [ ] evitar segredos na imagem.

## Etapa 7 — Documentação final

- [ ] consolidar Fase 1;
- [ ] documentar Fase 2;
- [ ] gerar fluxograma;
- [ ] registrar evidências;
- [ ] analisar resultados;
- [ ] sugerir melhorias;
- [ ] preencher template da disciplina;
- [ ] gerar PDF.

---

# 21. Melhorias futuras

Após a conclusão da Fase 2, o projeto poderá evoluir com:

- banco de dados persistente;
- HTTPS e domínio;
- balanceamento de carga;
- ambiente de staging;
- rollback automático;
- infraestrutura com módulos Terraform;
- state remoto;
- ECS/Kubernetes;
- observabilidade mais completa;
- métricas e dashboards;
- alertas;
- scanning de vulnerabilidades no pipeline;
- testes de integração mais abrangentes.

Essas melhorias são posteriores ao escopo mínimo da fase e devem ser tratadas como evolução do projeto.

---

# 22. Resumo do estado do projeto

| Componente | Estado atual nesta especificação |
|---|---|
| Descrição do projeto | Definida |
| Objetivos | Definidos |
| Requisitos | Definidos |
| Estratégia de branches | Definida |
| Estrutura do repositório | Definida |
| CI GitHub Actions | Especificado; executar e validar |
| Testes automatizados | Especificados; implementar/validar |
| Terraform | Especificado; validar/provisionar |
| AWS | Arquitetura definida; validar no ambiente real |
| Docker | Próxima implementação |
| Registry | Próxima implementação |
| CD | Próxima implementação |
| Deploy automatizado | Próxima implementação |
| Monitoramento | Próxima implementação |
| Logging | Próxima implementação |
| Segurança | Próxima implementação |
| Fluxograma final | A produzir após implementação |
| Relatório final | A produzir após implementação |
| PDF conforme template | A produzir após implementação |

---

# 23. Regra de implementação

Qualquer implementação posterior deve priorizar:

1. manter o projeto simples e demonstrável;
2. cumprir explicitamente os requisitos da disciplina;
3. evitar complexidade que não gere benefício acadêmico;
4. automatizar validações e deploy sempre que possível;
5. documentar comandos, decisões e evidências;
6. não expor credenciais ou segredos;
7. manter todos os artefatos versionados no GitHub.

Este arquivo é a fonte de referência do escopo técnico do projeto para a implementação das próximas etapas.
