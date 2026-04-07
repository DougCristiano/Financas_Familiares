#!/bin/bash

# Script para sincronizar a branch atual com o upstream via rebase
# Uso: ./sync-upstream.sh [upstream-url] [base-branch]
# Exemplo: ./sync-upstream.sh git@github.com:felipegcoutinho/openmonetis.git main

set -e

UPSTREAM_URL="${1:-git@github.com:felipegcoutinho/openmonetis.git}"
BASE_BRANCH="${2:-main}"
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

echo "📦 Sincronizando '$CURRENT_BRANCH' com upstream ($BASE_BRANCH)..."
echo ""

# Verificar se upstream já existe
if ! git remote | grep -q "^upstream$"; then
  echo "➕ Adicionando remote upstream..."
  git remote add upstream "$UPSTREAM_URL"
  echo "✅ Upstream adicionado"
else
  echo "✓ Remote upstream já existe"
fi

echo ""
echo "📥 Buscando atualizações do upstream..."
git fetch upstream "$BASE_BRANCH"
echo "✅ Fetch concluído"

echo ""
echo "🔄 Fazendo rebase sobre upstream/$BASE_BRANCH..."
if git rebase "upstream/$BASE_BRANCH"; then
  echo "✅ Rebase bem-sucedido!"
else
  echo ""
  echo "⚠️  Conflitos encontrados durante o rebase."
  echo "Resolva os conflitos e execute: git rebase --continue"
  exit 1
fi

echo ""
echo "📤 Fazendo push da branch atualizada..."
git push origin "$CURRENT_BRANCH" --force-with-lease
echo "✅ Push concluído"

echo ""
echo "🎉 Sincronização completada com sucesso!"
echo ""
echo "Resumo:"
git log --oneline -5 --graph
