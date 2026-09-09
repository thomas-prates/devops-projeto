#!/usr/bin/env bash
set -euo pipefail

PREVIOUS_IMAGE="${PREVIOUS_IMAGE:-ghcr.io/SEU-USUARIO/devops-projeto:previous}"
CONTAINER="devops-projeto"
PORT="${PORT:-3000}"

printf 'Realizando rollback para imagem: %s\n' "$PREVIOUS_IMAGE"
docker pull "$PREVIOUS_IMAGE"

docker rm -f "$CONTAINER" 2>/dev/null || true

docker run -d \
  --name "$CONTAINER" \
  --restart unless-stopped \
  -p "${PORT}:3000" \
  "$PREVIOUS_IMAGE"

echo "Aguardando aplicação..."
sleep 5

curl --fail --silent --show-error "http://127.0.0.1:${PORT}/health" > /dev/null

echo "Rollback concluído com sucesso."
