# DevOps Projeto — Fase 2: Entrega Contínua, Monitoramento e Segurança

Projeto acadêmico desenvolvido para a disciplina de DevOps do curso de Análise e Desenvolvimento de Sistemas da PUCRS.

O projeto tem como objetivo aplicar conceitos de Integração Contínua (CI), Entrega Contínua (CD), Containerização, Monitoramento e Segurança utilizando GitHub Actions, Docker, Terraform e AWS.

---

##  Sobre o projeto

Este projeto representa a implementação completa de DevOps, abrangendo **Fase 1 (Configuração e Automação Inicial)** e **Fase 2 (Entrega Contínua, Monitoramento e Segurança)**.

### Fase 1 — Configuração e Automação Inicial

- Estrutura de uma API REST em TypeScript/Node.js;
- Testes automatizados utilizando Jest e Supertest;
- Pipeline de Integração Contínua utilizando GitHub Actions;
- Scripts de Infraestrutura como Código utilizando Terraform;
- Validação automática da configuração Terraform;

### Fase 2 — Entrega Contínua, Monitoramento e Segurança

- Expansão do pipeline CI para incluir Entrega Contínua (CD);
- Containerização da aplicação com Docker;
- Automação de deploy com scripts;
- Monitoramento e logging da aplicação;
- Health checks automatizados;
- Rollback automatizado;

---

##  Objetivos

### Objetivo geral

Implementar um fluxo DevOps completo capaz de automatizar desde a validação do código até o deploy em produção, com monitoramento e segurança integrados.

### Objetivos específicos

- Implementar uma API REST de tarefas;
- Versionar o código no GitHub;
- Implementar testes automatizados;
- Criar um pipeline de CI/CD completo;
- Containerizar a aplicação com Docker;
- Automatizar o deploy em produção;
- Implementar monitoramento e logging;
- Implementar Infraestrutura como Código;
- Garantir segurança no pipeline e na infraestrutura;
- Documentar todas as etapas;

---

##  Tecnologias utilizadas

|| Tecnologia | Finalidade |
||---|---|
|| TypeScript/Node.js | Desenvolvimento da API REST |
|| Express | Framework web |
|| Jest/Supertest | Testes automatizados |
|| Git | Controle de versão |
|| GitHub | Hospedagem do código |
|| GitHub Actions | Pipeline CI/CD |
|| Docker | Containerização |
|| Terraform | Infraestrutura como Código |
|| AWS | Provedor de infraestrutura |
|| GitHub Container Registry | Registry de imagens Docker |

---

## 📁 Estrutura do projeto

```text
devops-projeto/
│
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── ci-cd.yml
│
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── controllers/
│   │   └── taskController.ts
│   ├── models/
│   │   └── task.ts
│   └── routes/
│       └── tasks.ts
│
├── tests/
│   ├── health.test.ts
│   └── controllers/
│       └── taskController.test.ts
│
├── terraform/
│   ├── main.tf
│   ├── outputs.tf
│   ├── provider.tf
│   └── variable.tf
│
├── scripts/
│   ├── deploy.sh
│   └── rollback.sh
│
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
├── .gitignore
├── jest.config.js
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

---

## 🚀 Como executar o projeto

### Pré-requisitos

- Node.js 20+
- Docker
- Docker Compose
- Git
- Conta no GitHub
- Conta na AWS (para deploy em produção)

### Instalação

```bash
# Clonar o repositório
git clone https://github.com/SEU-USUARIO/devops-projeto.git
cd devops-projeto

# Instalar dependências
npm install
```

### Executar localmente

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Produção
npm start
```

### Executar com Docker

```bash
# Build da imagem
docker build -t devops-projeto:local .

# Executar o container
docker run -p 3000:3000 devops-projeto:local

# Ou usar docker-compose
docker-compose up -d
```

### Executar testes

```bash
# Testes normais
npm test

# Testes com cobertura
npm run test:coverage
```

---

## 📡 API Endpoints

### Health Check
```bash
GET /health
```

### Tarefas
```bash
POST   /tasks          # Criar tarefa
GET    /tasks          # Listar tarefas
GET    /tasks/:id      # Buscar tarefa por ID
PUT    /tasks/:id      # Atualizar tarefa
DELETE /tasks/:id      # Deletar tarefa
```

### Exemplo de uso

```bash
# Criar tarefa
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Minha tarefa","description":"Descrição da tarefa","status":"pending"}'

# Listar tarefas
curl http://localhost:3000/tasks

# Buscar tarefa por ID
curl http://localhost:3000/tasks/ID_DA_TAREFA

# Atualizar tarefa
curl -X PUT http://localhost:3000/tasks/ID_DA_TAREFA \
  -H "Content-Type: application/json" \
  -d '{"status":"completed"}'

# Deletar tarefa
curl -X DELETE http://localhost:3000/tasks/ID_DA_TAREFA
```

---

## 🔧 Pipeline CI/CD

### CI (Integração Contínua)

O pipeline CI é executado em:
- Push para branches `main` e `develop`
- Pull Requests para `main` e `develop`

Etapas:
1. Checkout do código
2. Configuração do Node.js
3. Instalação de dependências
4. Execução de testes
5. Geração de cobertura
6. Build da aplicação
7. Validação do Terraform

### CD (Entrega Contínua)

O pipeline CD é executado apenas em:
- Push para branch `main`

Etapas:
1. Build da imagem Docker
2. Push para GitHub Container Registry
3. Deploy no servidor de produção
4. Health check
5. Smoke tests

---

## 🐳 Docker

### Build e execução local

```bash
# Build
docker build -t devops-projeto:local .

# Executar
docker run -p 3000:3000 devops-projeto:local

# Ver logs
docker logs -f devops-projeto
```

### Docker Compose

```bash
# Subir containers
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar containers
docker-compose down
```

---

## 📊 Monitoramento e Logging

### Health Check

```bash
curl http://localhost:3000/health
```

### Logs

```bash
# Logs do container
docker logs -f devops-projeto

# Logs do docker-compose
docker-compose logs -f app
```

Para mais detalhes, consulte `knowledge/monitoramento-logging.md`

---

## 🚀 Deploy em Produção

### Pré-requisitos

- Configurar secrets no GitHub:
  - `SSH_PRIVATE_KEY`: Chave SSH para acesso ao servidor
  - `SERVER_IP`: IP do servidor de produção
  - `SERVER_USER`: Usuário do servidor

### Deploy automatizado

O deploy é automático ao fazer push para a branch `main`. O pipeline:
1. Build da imagem Docker
2. Push para GitHub Container Registry
3. Deploy no servidor via SSH
4. Execução de health checks
5. Smoke tests

### Deploy manual

```bash
# No servidor de produção
cd /path/to/scripts
./deploy.sh
```

### Rollback

```bash
# No servidor de produção
./rollback.sh
```

---

## 🏗️ Infraestrutura como Código

### Terraform

```bash
cd terraform

# Inicializar
terraform init

# Planejar
terraform plan

# Aplicar
terraform apply

# Destruir
terraform destroy
```

### Recursos provisionados

- VPC
- Subnet pública
- Internet Gateway
- Route Table
- Security Group
- Instância EC2 com Docker instalado

---

##  Segurança

### Boas práticas implementadas

- Segredos armazenados em GitHub Secrets
- Chaves SSH não versionadas
- Imagens Docker com usuário sem privilégios de root
- Security Groups restritivos na AWS
- Validação de código de infraestrutura

### Melhorias futuras

- Implementar scanning de vulnerabilidades em imagens Docker
- Adicionar SAST/DAST no pipeline
- Implementar RBAC no Kubernetes (se aplicável)
- Configurar WAF

---

## 📈 Melhorias Futuras

1. **Observabilidade**: Implementar Prometheus + Grafana
2. **Logs Centralizados**: Implementar ELK Stack ou CloudWatch Logs
3. **Tracing**: Implementar Jaeger ou Zipkin
4. **Kubernetes**: Migrar de EC2 para Kubernetes
5. **Blue-Green Deploy**: Implementar estratégia de blue-green deployment
6. **Canary Deploy**: Implementar deploy canary
7. **Backup e Disaster Recovery**: Implementar estratégias de backup

---

## 👥 Contribuição

Este é um projeto acadêmico, mas contribuições são bem-vindas através de Pull Requests.

---

## 📄 Licença

ISC
