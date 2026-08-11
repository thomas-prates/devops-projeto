# DevOps Projeto — Configuração e Automação Inicial

Projeto acadêmico desenvolvido para a disciplina de DevOps do curso de Análise e Desenvolvimento de Sistemas da PUCRS.

O projeto tem como objetivo aplicar conceitos de Integração Contínua (CI) e Infraestrutura como Código (IaC), utilizando GitHub Actions e Terraform.

---

## 📋 Sobre o projeto

Este projeto representa a primeira fase de uma implementação DevOps, denominada **Configuração e Automação Inicial**.

Nesta etapa foram desenvolvidos:

- Estrutura inicial de uma aplicação em TypeScript;
- Testes automatizados utilizando Jest;
- Pipeline de Integração Contínua utilizando GitHub Actions;
- Processo automatizado de build da aplicação;
- Scripts de Infraestrutura como Código utilizando Terraform;
- Validação automática da configuração Terraform através do GitHub Actions.

O objetivo é demonstrar a aplicação prática dos conceitos de DevOps, principalmente integração contínua, automação e infraestrutura como código.

---

## 🎯 Objetivos

### Objetivo geral

Implementar uma estrutura inicial de DevOps capaz de automatizar a validação, os testes e o processo de build de uma aplicação, além de definir sua infraestrutura utilizando código.

### Objetivos específicos

- Configurar um repositório Git utilizando GitHub;
- Desenvolver uma aplicação simples em TypeScript;
- Implementar testes automatizados;
- Criar um pipeline de Integração Contínua;
- Automatizar a execução dos testes;
- Automatizar o processo de build;
- Implementar Infraestrutura como Código utilizando Terraform;
- Validar automaticamente os arquivos Terraform;
- Organizar o projeto seguindo boas práticas de versionamento e automação.

---

## 🛠️ Tecnologias utilizadas

| Tecnologia | Finalidade |
|---|---|
| TypeScript | Desenvolvimento da aplicação |
| Node.js | Ambiente de execução |
| Jest | Testes automatizados |
| Git | Controle de versão |
| GitHub | Hospedagem do código |
| GitHub Actions | Pipeline de Integração Contínua |
| Terraform | Infraestrutura como Código |
| AWS | Provedor de infraestrutura |

---

# 📁 Estrutura do projeto

```text
devops-projeto/
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── src/
│   └── index.ts
│
├── tests/
│   └── index.test.ts
│
├── terraform/
│   ├── main.tf
│   ├── outputs.tf
│   ├── provider.tf
│   └── variable.tf
│
├── .gitignore
├── jest.config.js
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md