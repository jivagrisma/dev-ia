#!/usr/bin/env bash
set -euo pipefail

ROOT="$(pwd)"

# Create base folders
mkdir -p .vscode
mkdir -p .ai-methodology/{prompts,config,mappings,context,sync}
mkdir -p specs docs src tests

# .env.example
if [ ! -f ".env.example" ]; then
  cat > .env.example << 'EOF'
# GitHub Configuration (Required)
GITHUB_TOKEN=ghp_your_github_token_here
GITHUB_OWNER=your_github_username_or_organization
GITHUB_REPO=your_repository_name
GITHUB_PROJECT_NUMBER=1

# AI Provider Keys (At least one required for enhanced features)
ANTHROPIC_API_KEY=sk-ant-your_anthropic_key_here
OPENAI_API_KEY=sk-your_openai_key_here
GOOGLE_API_KEY=your_google_ai_key_here
PERPLEXITY_API_KEY=pplx-your_perplexity_key_here
XAI_API_KEY=xai-your_xai_key_here
GROQ_API_KEY=gsk_your_groq_key_here
OPENROUTER_API_KEY=sk-or-your_openrouter_key_here

# AI Model Configuration (Optional)
AI_MAIN_MODEL=claude-3-5-sonnet-20241022
AI_RESEARCH_MODEL=perplexity-llama-3.1-sonar-large-128k-online
AI_FALLBACK_MODEL=gpt-4o

# Methodology Configuration
ENHANCED_TASK_GENERATION=true
AUTO_CREATE_TRACEABILITY=true
AUTO_GENERATE_USE_CASES=true
VISUAL_TRACKING_ENABLED=true

# MCP Configuration
MCP_GITHUB_PROJECT_MANAGER=mcp-github-project-manager
MCP_TASK_MASTER=task-master-ai
MCP_SPEC_KIT_ENABLED=true

# Spec Kit Configuration
SPECKIT_REPO_URL=https://github.com/github/spec-kit.git
EOF
  echo "Created .env.example"
fi

# Example spec
if [ ! -f "specs/example.spec.yaml" ]; then
  cat > specs/example.spec.yaml << 'EOF'
id: EX-1
title: Ejemplo - Endpoint de salud
objectives:
  - Exponer GET /health para verificar estado
acceptance_criteria:
  - Responder 200 con {"status":"ok"}
artifacts:
  code:
    - src/health/handler.(ts|py|go|rb)
  tests:
    - tests/health.test.(ts|py|go|rb)
tasks:
  - title: Crear handler GET /health
    labels: [backend, healthcheck]
    estimate: "1h"
  - title: Crear test de integración /health
    labels: [test]
    estimate: "1h"
EOF
  echo "Created specs/example.spec.yaml"
fi

# Mapping example
if [ ! -f ".ai-methodology/mappings/spec-to-project.example.json" ]; then
  cat > .ai-methodology/mappings/spec-to-project.example.json << 'EOF'
{
  "spec_fields_to_project": {
    "id": "TitlePrefix",
    "title": "Title",
    "tasks[].title": "Item.Title",
    "tasks[].labels": "Item.Labels",
    "tasks[].estimate": "Item.Estimate"
  },
  "status_mapping": {
    "todo": "Todo",
    "in_progress": "In Progress",
    "done": "Done"
  }
}
EOF
  echo "Created .ai-methodology/mappings/spec-to-project.example.json"
fi

# Context state
if [ ! -f ".ai-methodology/context/state.json" ]; then
  cat > .ai-methodology/context/state.json << 'EOF'
{
  "lastSetupAt": null,
  "project": {
    "owner": null,
    "repo": null,
    "projectNumber": null
  },
  "specsIndexed": [],
  "sync": {
    "lastRun": null,
    "direction": "spec_to_project"
  }
}
EOF
  echo "Created .ai-methodology/context/state.json"
fi

# Prompts templates helpers
create_if_missing() {
  local path="$1"
  local content="$2"
  if [ ! -f "$path" ]; then
    printf "%s" "$content" > "$path"
    echo "Created $path"
  fi
}

read -r -d '' SPEC_PROMPT << 'EOF'
# Prompt: Generar especificación
Contexto:
- Repositorio: {{repo}}
- Stack: {{stack}}
- Alcance: {{alcance}}

Instrucciones:
- Genera especificación ejecutable (YAML) con:
  - id, title, objectives, acceptance_criteria, artifacts, tasks
- Asegura trazabilidad con etiquetas y estimates
Salida:
- Un archivo YAML válido listo para sync
EOF

read -r -d '' IMPLEMENT_PROMPT << 'EOF'
# Prompt: Implementación basada en spec
Entrada:
- Spec: {{spec_path}}

Objetivo:
- Generar comandos y archivos mínimos para cumplir la spec

Entrega:
- Estructura de carpetas
- Código base
- Tests
- Actualización de docs
EOF

read -r -d '' AGENT_PROMPT << 'EOF'
# Prompt: Agente remoto para optimización
Módulo: {{modulo}}
Tareas:
- Revisión de rendimiento
- Refactor
- Documentación
- Tests adicionales
Criterio de finalización:
- PR con cambios + reporte
EOF

create_if_missing ".ai-methodology/prompts/spec.md" "$SPEC_PROMPT"
create_if_missing ".ai-methodology/prompts/implement.md" "$IMPLEMENT_PROMPT"
create_if_missing ".ai-methodology/prompts/agent.md" "$AGENT_PROMPT"

# Quickstart
if [ ! -f "docs/QUICKSTART.md" ]; then
  cat > docs/QUICKSTART.md << 'EOF'
# Quick Start - Metodología IA

1) Copia .env.example a .env y completa variables (GITHUB_TOKEN, OWNER, REPO, PROJECT_NUMBER).
2) En VS Code, ejecuta la tarea: "AI: Setup Methodology".
3) Revisa specs/example.spec.yaml y ajusta a tu necesidad.
4) Usa los prompts en /.ai-methodology/prompts con Augment Code Chat.
5) Próximo paso (opcional): habilitar sincronización con GitHub Projects.

Comando manual:
bash ./.ai-methodology/ai-setup.sh
EOF
  echo "Created docs/QUICKSTART.md"
fi

# .gitignore
if [ ! -f ".gitignore" ]; then
  cat > .gitignore << 'EOF'
.env
.ai-methodology/context/state.json
node_modules/
dist/
.DS_Store
EOF
  echo "Created .gitignore"
fi

# Crear script de instalación del módulo de sincronización
if [ ! -f ".ai-methodology/install-sync.sh" ]; then
  cat > .ai-methodology/install-sync.sh << 'EOF'
#!/usr/bin/env bash
set -euo pipefail

echo "🔧 Instalando módulo de sincronización..."

cd .ai-methodology/sync

# Instalar dependencias
npm install

echo "✅ Módulo de sincronización instalado"
echo ""
echo "Comandos disponibles:"
echo "  cd .ai-methodology/sync"
echo "  npm run setup     - Configuración inicial"
echo "  npm run sync      - Sincronizar con GitHub Projects"
echo "  npm run dashboard - Ver dashboard de progreso"
echo "  npm run mcp:install - Configurar servidores MCP"
EOF
  chmod +x .ai-methodology/install-sync.sh
  echo "Created .ai-methodology/install-sync.sh"
fi

# Final message
echo ""
echo "🎉 AI methodology bootstrap complete!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Copia .env.example a .env y completa las variables"
echo "2. Ejecuta: bash .ai-methodology/install-sync.sh"
echo "3. Configura: cd .ai-methodology/sync && npm run setup"
echo "4. Sincroniza: npm run sync"
echo ""
echo "🚀 Comandos VS Code:"
echo "- 'Tasks: Run Task' -> 'AI: Setup Methodology'"
echo "- 'Tasks: Run Task' -> 'AI: Install Sync Module'"
echo "- 'Tasks: Run Task' -> 'AI: Sync with GitHub'"
echo ""

