#!/usr/bin/env bash
set -euo pipefail

IMAGE="${IMAGE:-ghcr.io/thomas-prates/devops-projeto:latest}"
CONTAINER="devops-projeto"
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
echo "A aplicação está disponível em: http://18.231.121.90:3000"
