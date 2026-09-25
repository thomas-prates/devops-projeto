# Monitoramento e Logging

## Visão Geral

O projeto implementa monitoramento e logging básicos para garantir a observabilidade da aplicação em produção.

## Logging

### Estrutura de Logs

A aplicação utiliza logging estruturado com timestamp ISO para facilitar a análise:

```javascript
[2026-09-08T22:15:30.123Z] GET /health
[2026-09-08T22:15:30.125Z] GET /health - 200 (2ms)
```

### Tipos de Logs

1. **Request Logging**: Registra todas as requisições HTTP com método, path e timestamp
2. **Response Logging**: Registra status code e tempo de resposta
3. **Error Logging**: Registra erros com stack trace completo
4. **Application Logging**: Registra eventos importantes da aplicação (startup, shutdown)

### Como Visualizar Logs

#### Localmente (Docker)
```bash
# Ver logs em tempo real
docker logs -f devops-projeto

# Ver últimos 100 linhas
docker logs --tail 100 devops-projeto

# Ver logs com timestamp
docker logs -t devops-projeto
```

#### Docker Compose
```bash
docker-compose logs -f app
```

#### Produção (EC2)
```bash
# SSH no servidor
ssh user@server-ip

# Ver logs do container
docker logs -f devops-projeto

# Ver logs do Docker daemon
journalctl -u docker
```

## Monitoramento

### Health Check

O endpoint `/health` fornece informações sobre o status da aplicação:

```bash
curl http://localhost:3000/health
```

Resposta:
```json
{
  "status": "ok",
  "timestamp": "2026-09-08T22:15:30.123Z",
  "uptime": 123.456
}
```

### Docker Health Check

O container inclui health check automático configurado no docker-compose.yml:

```yaml
healthcheck:
  test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

### Verificar Health Status do Container
```bash
docker inspect --format='{{.State.Health.Status}}' devops-projeto
```

## Métricas Disponíveis

### Métricas da Aplicação
- **Uptime**: Tempo de execução da aplicação (via /health)
- **Response Time**: Tempo de resposta de cada requisição (via logs)
- **Status Codes**: Distribuição de códigos HTTP (via logs)

### Métricas do Sistema (Docker)
```bash
# Ver uso de recursos do container
docker stats devops-projeto

# Ver informações detalhadas do container
docker inspect devops-projeto
```

## Melhorias Futuras

1. **Sistema de Logs Centralizado**: Implementar ELK Stack (Elasticsearch, Logstash, Kibana) ou CloudWatch Logs
2. **Métricas Avançadas**: Implementar Prometheus + Grafana para métricas detalhadas
3. **Tracing Distribuído**: Implementar Jaeger ou Zipkin para tracing de requisições
4. **Alerting**: Configurar alertas baseados em métricas e logs
5. **Dashboard**: Criar dashboard visual para monitoramento em tempo real

## Comandos Úteis

### Docker
```bash
# Ver containers em execução
docker ps

# Ver logs de múltiplos containers
docker logs $(docker ps -q)

# Limpar logs antigos
docker system prune -a
```

### Testes de Monitoramento
```bash
# Teste de carga simples
for i in {1..100}; do curl http://localhost:3000/health; done

# Teste de carga com Apache Bench
ab -n 1000 -c 10 http://localhost:3000/health
```

## Troubleshooting

### Logs não aparecem
- Verificar se o container está em execução: `docker ps`
- Verificar se o logging está configurado corretamente
- Verificar permissões de escrita nos logs

### Health check falhando
- Verificar se a aplicação está respondendo: `curl http://localhost:3000/health`
- Verificar se a porta 3000 está acessível
- Verificar logs do container para erros: `docker logs devops-projeto`

### Container reiniciando constantemente
- Verificar logs para identificar o erro
- Verificar recursos disponíveis (memória, CPU)
- Verificar configuração do health check
