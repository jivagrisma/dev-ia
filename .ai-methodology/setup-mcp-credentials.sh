#!/bin/bash

# Script para configurar credenciales MCP de forma segura
# Uso: bash .ai-methodology/setup-mcp-credentials.sh

echo "🔧 Configurando credenciales MCP..."

# Verificar que existe .env
if [ ! -f ".env" ]; then
    echo "❌ Error: Archivo .env no encontrado"
    echo "💡 Copia .env.example a .env y configura tus credenciales"
    exit 1
fi

# Cargar variables de entorno
source .env

# Verificar credenciales mínimas
if [ -z "$GITHUB_TOKEN" ] || [ "$GITHUB_TOKEN" = "your_github_token_here" ]; then
    echo "❌ Error: GITHUB_TOKEN no configurado en .env"
    exit 1
fi

if [ -z "$GITHUB_OWNER" ] || [ "$GITHUB_OWNER" = "your_github_username" ]; then
    echo "❌ Error: GITHUB_OWNER no configurado en .env"
    exit 1
fi

if [ -z "$GITHUB_REPO" ] || [ "$GITHUB_REPO" = "your_repository_name" ]; then
    echo "❌ Error: GITHUB_REPO no configurado en .env"
    exit 1
fi

# Crear directorio .vscode si no existe
mkdir -p .vscode

# Generar mcp.json con credenciales reales
cat > .vscode/mcp.json << EOF
{
  "servers": {
    "mcp-github-project-manager": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-github-project-manager"
      ],
      "env": {
        "GITHUB_TOKEN": "$GITHUB_TOKEN",
        "GITHUB_OWNER": "$GITHUB_OWNER",
        "GITHUB_REPO": "$GITHUB_REPO",
        "ANTHROPIC_API_KEY": "$ANTHROPIC_API_KEY",
        "OPENAI_API_KEY": "$OPENAI_API_KEY",
        "GOOGLE_API_KEY": "$GOOGLE_API_KEY",
        "PERPLEXITY_API_KEY": "$PERPLEXITY_API_KEY",
        "XAI_API_KEY": "$XAI_API_KEY",
        "GROQ_API_KEY": "$GROQ_API_KEY",
        "OPENROUTER_API_KEY": "$OPENROUTER_API_KEY"
      },
      "type": "stdio"
    },
    "task-master-ai": {
      "command": "npx",
      "args": [
        "-y",
        "--package=task-master-ai",
        "task-master-ai"
      ],
      "env": {
        "ANTHROPIC_API_KEY": "$ANTHROPIC_API_KEY",
        "OPENAI_API_KEY": "$OPENAI_API_KEY",
        "GOOGLE_API_KEY": "$GOOGLE_API_KEY",
        "PERPLEXITY_API_KEY": "$PERPLEXITY_API_KEY"
      },
      "type": "stdio"
    }
  }
}
EOF

echo "✅ Archivo .vscode/mcp.json generado con credenciales"
echo "🔒 Recuerda: Este archivo contiene credenciales y NO debe versionarse"
echo "💡 Reinicia VS Code para que tome la nueva configuración MCP"
