# Fluxograma do Fluxo DevOps Completo

**Projeto:** Task DevOps API  
**Fase:** 2 - Entrega Contínua, Monitoramento e Segurança

---

## 1. Visão Geral do Fluxo DevOps

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          FLUXO DEVOPS COMPLETO                             │
└─────────────────────────────────────────────────────────────────────────────┘

DESENVOLVIMENTO
    │
    ├─> Escrever Código
    │   │
    │   └─> Testes Locais
    │       │
    │       └─> Git Commit
    │
    └─> Push para Branch (feature/develop)
        │
        └─> Pull Request
            │
            └─> Code Review
                │
                └─> Merge para main
                    │
                    └─> TRIGGER PIPELINE CI/CD
```

---

## 2. Pipeline CI/CD Detalhado

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      PIPELINE CI/CD - GITHUB ACTIONS                        │
└─────────────────────────────────────────────────────────────────────────────┘

                    PUSH PARA MAIN
                         │
         ┌───────────────┴───────────────┐
         │                               │
         ▼                               ▼
    ┌─────────┐                    ┌─────────┐
    │   CI    │                    │TERRAFORM│
    │  JOB    │                    │   JOB   │
    └────┬────┘                    └────┬────┘
         │                               │
         │ 1. Checkout                   │ 1. Checkout
         │ 2. Setup Node.js              │ 2. Setup Terraform
         │ 3. Install Dependencies       │ 3. Terraform Init
         │ 4. Run Tests                  │ 4. Terraform Fmt Check
         │ 5. Test Coverage              │ 5. Terraform Validate
         │ 6. Build Application          │
         │                               │
         └───────────────┬───────────────┘
                         │
                         ▼
                    ┌─────────┐
                    │  BUILD  │
                    │  IMAGE  │
                    │   JOB   │
                    └────┬────┘
                         │
                         │ 1. Setup Docker Buildx
                         │ 2. Login GHCR
                         │ 3. Build Image
                         │ 4. Push Image
                         │    - main tag
                         │    - sha tag
                         │    - latest tag
                         │
                         └───────────────┐
                                         │
                                         ▼
                                    ┌─────────┐
                                    │ DEPLOY  │
                                    │   JOB   │
                                    └────┬────┘
                                         │
                                         │ 1. Setup SSH
                                         │ 2. Copy Deploy Script
                                         │ 3. Execute Deploy
                                         │    - Pull Image
                                         │    - Remove Old Container
                                         │    - Run New Container
                                         │    - Health Check
                                         │
                                         └───────────────┐
                                                         │
                                                         ▼
                                                    ┌─────────┐
                                                    │ SMOKE   │
                                                    │  TEST   │
                                                    └────┬────┘
                                                         │
                                                         │ 1. Health Check
                                                         │ 2. Create Task Test
                                                         │ 3. List Tasks Test
                                                         │
                                                         └───────┐
                                                                 │
                                                                 ▼
                                                    ┌─────────────────────┐
                                                    │ PRODUÇÃO ATIVA      │
                                                    │ ✅ Deploy Sucesso   │
                                                    └─────────────────────┘
```

---

## 3. Fluxo de Desenvolvimento

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLUXO DE DESENVOLVIMENTO                                 │
└─────────────────────────────────────────────────────────────────────────────┘

DESENVOLVEDOR
    │
    ├─> Criar Branch Feature
    │   git checkout -b feature/nova-funcionalidade
    │
    ├─> Desenvolver Código
    │   - Escrever código TypeScript
    │   - Implementar testes
    │   - Testar localmente
    │
    ├─> Commit e Push
    │   git add .
    │   git commit -m "feat: nova funcionalidade"
    │   git push origin feature/nova-funcionalidade
    │
    └─> Abrir Pull Request
        - No GitHub: Create PR
        - Descrever mudanças
        - Solicitar review
            │
            ▼
        CODE REVIEW
            │
            ├─> Revisão do código
            ├─> Feedback
            ├─> Ajustes se necessário
            │
            └─> Aprovação
                │
                ▼
            MERGE PARA MAIN
                │
                └─> Trigger Pipeline CI/CD
```

---

## 4. Fluxo de Deploy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        FLUXO DE DEPLOY                                      │
└─────────────────────────────────────────────────────────────────────────────┘

PIPELINE CD CONCLUÍDO
    │
    ├─> Imagem Docker Pushed
    │   ghcr.io/usuario/devops-projeto:latest
    │
    └─> Trigger Deploy Job
        │
        ├─> Conectar via SSH
        │   ssh user@server-ip
        │
        ├─> Executar Script Deploy
        │   ./scripts/deploy.sh
        │
        │   SCRIPT DEPLOY:
        │   │
        │   ├─> Pull Nova Imagem
        │   │   docker pull ghcr.io/usuario/devops-projeto:latest
        │   │
        │   ├─> Parar Container Antigo
        │   │   docker rm -f devops-projeto
        │   │
        │   ├─> Iniciar Novo Container
        │   │   docker run -d --name devops-projeto \
        │   │     -p 3000:3000 \
        │   │     ghcr.io/usuario/devops-projeto:latest
        │   │
        │   ├─> Aguardar Inicialização
        │   │   sleep 5
        │   │
        │   └─> Health Check
        │       curl http://localhost:3000/health
        │
        └─> Deploy Concluído
            │
            ├─> Smoke Tests
            │   - Testar /health
            │   - Testar POST /tasks
            │   - Testar GET /tasks
            │
            └─> Aplicação em Produção
```

---

## 5. Fluxo de Rollback

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        FLUXO DE ROLLBACK                                     │
└─────────────────────────────────────────────────────────────────────────────┘

FALHA NO DETECTADA
    │
    ├─> Deploy Falhou
    │   - Health check falhou
    │   - Smoke tests falharam
    │   - Aplicação instável
    │
    └─> Iniciar Rollback
        │
        ├─> Identificar Imagem Anterior
        │   ghcr.io/usuario/devops-projeto:previous
        │
        ├─> Executar Script Rollback
        │   ./scripts/rollback.sh
        │
        │   SCRIPT ROLLBACK:
        │   │
        │   ├─> Pull Imagem Anterior
        │   │   docker pull ghcr.io/usuario/devops-projeto:previous
        │   │
        │   ├─> Parar Container Atual
        │   │   docker rm -f devops-projeto
        │   │
        │   ├─> Iniciar Container Anterior
        │   │   docker run -d --name devops-projeto \
        │   │     -p 3000:3000 \
        │   │     ghcr.io/usuario/devops-projeto:previous
        │   │
        │   └─> Health Check
        │       curl http://localhost:3000/health
        │
        └─> Rollback Concluído
            │
            └─> Sistema Estável
                - Investigar causa da falha
                - Corrigir problema
                - Novo deploy
```

---

## 6. Fluxo de Monitoramento

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      FLUXO DE MONITORAMENTO                                  │
└─────────────────────────────────────────────────────────────────────────────┘

APLICAÇÃO EM PRODUÇÃO
    │
    ├─> Logging Contínuo
    │   │
    │   ├─> Request Logs
    │   │   [timestamp] METHOD path - status (time)
    │   │
    │   ├─> Error Logs
    │   │   [timestamp] ERROR: message
    │   │   stack trace
    │   │
    │   └─> Application Logs
    │       [timestamp] Server started
    │       [timestamp] Environment: production
    │
    ├─> Health Checks
    │   │
    │   ├─> Docker Health Check
    │   │   Intervalo: 30s
    │   │   Timeout: 10s
    │   │   Retries: 3
    │   │
    │   └─> Application Health Check
    │       GET /health
    │       Response: { status, timestamp, uptime }
    │
    └─> Monitoramento de Recursos
        │
        ├─> Docker Stats
        │   docker stats devops-projeto
        │
        ├─> Container Status
        │   docker ps
        │
        └─> Logs Inspection
            docker logs -f devops-projeto
```

---

## 7. Fluxo de Testes

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        FLUXO DE TESTES                                       │
└─────────────────────────────────────────────────────────────────────────────┘

TESTES LOCAIS
    │
    ├─> Desenvolvedor Executa
    │   npm test
    │
    ├─> Testes Unitários
    │   - Modelos
    │   - Controladores
    │   - Utilitários
    │
    └─> Testes de Integração
        - API endpoints
        - Health check
        - CRUD operations

PIPELINE CI
    │
    ├─> Testes Automatizados
    │   npm test
    │
    ├─> Cobertura de Código
    │   npm run test:coverage
    │
    └─> Resultados
        - ✅ Todos os testes passam
        - 📊 Cobertura > 80%
        - 🚫 Pipeline falha se algum teste falhar

PIPELINE CD
    │
    └─> Smoke Tests
        │
        ├─> Health Check
        │   curl http://server:3000/health
        │
        ├─> Create Task
        │   curl -X POST http://server:3000/tasks \
        │     -d '{"title":"Test","description":"Test"}'
        │
        └─> List Tasks
            curl http://server:3000/tasks
```

---

## 8. Fluxo de Segurança

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        FLUXO DE SEGURANÇA                                   │
└─────────────────────────────────────────────────────────────────────────────┘

DESENVOLVIMENTO
    │
    ├─> Código Seguro
    │   - Validação de inputs
    │   - Tratamento de erros
    │   - Sem hardcoding de segredos
    │
    └─> Git Best Practices
        - .gitignore configurado
        - Arquivos sensíveis ignorados
        - Commits assinados (opcional)

PIPELINE CI
    │
    ├─> Validação de Terraform
    │   - terraform fmt -check
    │   - terraform validate
    │
    └─> Scan de Dependências (futuro)
        - npm audit
        - Snyk scan

PIPELINE CD
    │
    ├─> GitHub Secrets
    │   - SSH_PRIVATE_KEY
    │   - SERVER_IP
    │   - SERVER_USER
    │   - GITHUB_TOKEN
    │
    ├─> Autenticação GHCR
    │   - GITHUB_TOKEN automático
    │
    └─> SSH Seguro
        - Chaves privadas não versionadas
        - Conexão via chave SSH

INFRAESTRUTURA
    │
    ├─> Security Groups
    │   - Porta 22: SSH (restrito)
    │   - Porta 3000: Aplicação
    │   - Egress: Todo tráfego
    │
    ├─> Docker Security
    │   - Usuário não-root
    │   - Imagens oficiais
    │   - Scan de vulnerabilidades (futuro)
    │
    └─> AWS Security
        - IAM roles (futuro)
        - VPC isolada
        - Logs do CloudTrail (futuro)
```

---

## 9. Resumo do Fluxo Completo

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    RESUMO DO FLUXO DEVOPS                                    │
└─────────────────────────────────────────────────────────────────────────────┘

1. PLANEJAMENTO
   ├─> Definir requisitos
   ├─> Criar branch feature
   └─> Planejar implementação

2. DESENVOLVIMENTO
   ├─> Escrever código
   ├─> Implementar testes
   ├─> Testar localmente
   └─> Commit e push

3. INTEGRAÇÃO CONTÍNUA (CI)
   ├─> Pull Request
   ├─> Code Review
   ├─> Merge para main
   ├─> Pipeline CI:
   │   ├─> Testes automatizados
   │   ├─> Build da aplicação
   │   └─> Validação Terraform
   └─> ✅ CI passa

4. ENTREGA CONTÍNUA (CD)
   ├─> Pipeline CD:
   │   ├─> Build imagem Docker
   │   ├─> Push para GHCR
   │   ├─> Deploy via SSH
   │   └─> Smoke tests
   └─> ✅ CD passa

5. OPERAÇÃO
   ├─> Aplicação em produção
   ├─> Monitoramento contínuo
   ├─> Logging estruturado
   ├─> Health checks
   └─> Alertas (futuro)

6. MANUTENÇÃO
   ├─> Monitorar performance
   ├─> Coletar feedback
   ├─> Planejar melhorias
   └─> Retornar ao passo 1
```

---

## 10. Ferramentas e Tecnologias

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FERRAMENTAS POR ETAPA                                     │
└─────────────────────────────────────────────────────────────────────────────┘

DESENVOLVIMENTO:
  ├─> TypeScript/Node.js
  ├─> Express
  ├─> Jest/Supertest
  └─> VS Code / IDE

VERSIONAMENTO:
  ├─> Git
  └─> GitHub

CI/CD:
  ├─> GitHub Actions
  ├─> Docker
  ├─> GitHub Container Registry
  └─> SSH

INFRAESTRUTURA:
  ├─> Terraform
  ├─> AWS
  │   ├─> EC2
  │   ├─> VPC
  │   ├─> Security Groups
  │   └─> IAM (futuro)
  └─> Docker

MONITORAMENTO:
  ├─> Docker Logs
  ├─> Health Checks
  ├─> Docker Stats
  └─> Prometheus/Grafana (futuro)

SEGURANÇA:
  ├─> GitHub Secrets
  ├─> SSH Keys
  ├─> Security Groups
  └─> Trivy/Snyk (futuro)
```

---

**Conclusão:** Este fluxograma demonstra o ciclo completo de DevOps implementado no projeto, desde o desenvolvimento até a operação em produção, com automação, segurança e monitoramento integrados em todas as etapas.
