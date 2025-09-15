# 🎯 Guía: Aplicar Metodología AI a Proyecto Existente

## 📋 Paso a Paso Detallado

### **Fase 1: Preparación y Backup**

#### **Paso 1: Backup del Proyecto Existente**
```bash
# Ir a tu proyecto existente
cd /ruta/a/tu/proyecto-existente

# Crear backup de seguridad
git branch backup-before-ai-methodology
git add .
git commit -m "🔒 Backup antes de integrar metodología AI"

# Verificar estado limpio
git status
```

#### **Paso 2: Análisis de Estructura Existente**
```bash
# Documentar estructura actual
tree -I 'node_modules|.git' > estructura-actual.txt

# Verificar archivos que podrían tener conflictos
ls -la | grep -E "(package\.json|\.vscode|specs|docs)"
```

---

### **Fase 2: Integración de Metodología**

#### **Paso 3: Copiar Estructura de Metodología**
```bash
# Crear directorios de metodología
mkdir -p .ai-methodology
mkdir -p .ai-methodology/sync
mkdir -p .ai-methodology/prompts
mkdir -p .ai-methodology/config
mkdir -p .ai-methodology/mappings
mkdir -p specs docs ejemplos-pruebas

# Copiar archivos de metodología (desde dev_ia)
cp -r /home/jivagrisma/Escritorio/dev_ia/.ai-methodology/* .ai-methodology/

# Copiar configuración MCP
mkdir -p .vscode
cp /home/jivagrisma/Escritorio/dev_ia/.vscode/mcp.json .vscode/
```

#### **Paso 4: Configurar Variables de Entorno**
```bash
# Crear archivo .env para el proyecto
cat > .env << 'EOF'
# Configuración GitHub para Metodología AI
GITHUB_TOKEN=tu_token_aqui
GITHUB_OWNER=tu_usuario_github
GITHUB_REPO=tu_proyecto_existente
GITHUB_PROJECT_ID=tu_project_id

# Variables específicas del proyecto
NODE_ENV=development
EOF

# Agregar .env al .gitignore si no está
echo ".env" >> .gitignore
```

#### **Paso 5: Extender package.json (Sin Sobrescribir)**
```bash
# Backup del package.json actual
cp package.json package.json.backup

# Instalar dependencias de metodología (solo las necesarias)
npm install --save-dev jest supertest eslint prettier

# Agregar scripts de metodología manualmente o con script
```

**Script para extender package.json:**
```javascript
// extend-package.js
const fs = require('fs');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

// Scripts de metodología a agregar
const methodologyScripts = {
  'ai:sync': 'cd .ai-methodology/sync && npm run sync',
  'ai:dashboard': 'cd .ai-methodology/sync && npm run dashboard',
  'ai:setup': 'bash ./.ai-methodology/ai-setup.sh',
  'ai:test': 'npm test && cd .ai-methodology/sync && npm test'
};

// Agregar scripts sin sobrescribir existentes
packageJson.scripts = { ...packageJson.scripts, ...methodologyScripts };

fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
console.log('✅ package.json extendido con scripts de metodología');
```

---

### **Fase 3: Configuración Específica**

#### **Paso 6: Configurar Sync Module**
```bash
# Ir al directorio de sync
cd .ai-methodology/sync

# Instalar dependencias
npm install

# Configurar para tu proyecto específico
# Editar setup.js con tus datos:
```

**Configuración en setup.js:**
```javascript
const config = {
  github: {
    owner: 'TU_USUARIO',           // ← Cambiar
    repo: 'TU_PROYECTO',           // ← Cambiar  
    projectId: 'TU_PROJECT_ID',    // ← Cambiar
    token: process.env.GITHUB_TOKEN
  }
};
```

#### **Paso 7: Configurar MCP para tu Proyecto**
```bash
# Editar .vscode/mcp.json con datos de tu proyecto
```

**Configuración MCP:**
```json
{
  "mcpServers": {
    "github-project-manager": {
      "command": "npx",
      "args": ["mcp-github-project-manager"],
      "env": {
        "GITHUB_TOKEN": "tu_token",
        "GITHUB_OWNER": "tu_usuario",
        "GITHUB_REPO": "tu_proyecto"
      }
    }
  }
}
```

---

### **Fase 4: Validación y Testing**

#### **Paso 8: Probar Integración**
```bash
# Volver al directorio raíz del proyecto
cd ../..

# Probar scripts de metodología
npm run ai:setup
npm run ai:dashboard

# Verificar que el proyecto original sigue funcionando
npm start  # o tu comando de inicio
npm test   # si tienes tests existentes
```

#### **Paso 9: Crear Primera Spec**
```bash
# Crear spec de ejemplo para tu proyecto
cat > specs/PROJ-1.yaml << 'EOF'
id: PROJ-1
title: "Integración de Metodología AI"
description: "Validar que la metodología AI se integró correctamente"
objectives:
  - Verificar funcionamiento de comandos MCP
  - Confirmar sincronización con GitHub
tasks:
  - name: "Probar generate_prd"
    description: "Ejecutar comando MCP generate_prd"
    priority: "alta"
  - name: "Verificar sync"
    description: "Confirmar sincronización con GitHub Projects"
    priority: "alta"
acceptance_criteria:
  - Comandos MCP funcionan correctamente
  - GitHub Projects se sincroniza
  - Proyecto original no se ve afectado
EOF
```

#### **Paso 10: Sincronizar con GitHub**
```bash
# Probar sincronización
npm run ai:sync

# Verificar en GitHub que se crearon los issues
```

---

### **Fase 5: Commit y Documentación**

#### **Paso 11: Commit de Integración**
```bash
# Agregar archivos de metodología
git add .ai-methodology/
git add .vscode/mcp.json
git add specs/
git add docs/
git add .env.example  # Crear ejemplo sin credenciales
git add package.json

# Commit de integración
git commit -m "🤖 Integrar metodología AI de desarrollo

✨ Características agregadas:
- Comandos MCP para gestión de proyectos
- Sincronización automática con GitHub Projects
- Dashboard de métricas y progreso
- Estructura de especificaciones
- Scripts de automatización

🔧 Archivos modificados:
- package.json: Scripts de metodología agregados
- .vscode/mcp.json: Configuración MCP
- Estructura .ai-methodology/ completa

🚀 Uso:
- npm run ai:sync: Sincronizar con GitHub
- npm run ai:dashboard: Ver métricas
- Comandos MCP en VS Code con Augment Code"
```

---

## **🎯 Estructura Final del Proyecto**

```
tu-proyecto-existente/
├── 📁 src/                          # Tu código existente (sin cambios)
├── 📁 public/                       # Tus assets existentes (sin cambios)
├── 📁 components/                   # Tus componentes (sin cambios)
├── 📁 .ai-methodology/              # ← NUEVO: Metodología AI
│   ├── 📁 sync/                     # Módulo de sincronización
│   ├── 📁 prompts/                  # Prompts para AI
│   ├── 📁 config/                   # Configuraciones
│   └── 📄 ai-setup.sh              # Script de setup
├── 📁 specs/                        # ← NUEVO: Especificaciones
├── 📁 docs/                         # ← NUEVO: Documentación generada
├── 📁 .vscode/                      # Configuración VS Code
│   └── 📄 mcp.json                  # ← NUEVO: Configuración MCP
├── 📄 package.json                  # ← EXTENDIDO: Scripts agregados
├── 📄 .env                          # ← NUEVO: Variables de entorno
└── 📄 .gitignore                    # ← ACTUALIZADO: Excluir .env
```

---

## **🔄 Flujo de Trabajo Diario**

### **Para Desarrollo Normal:**
```bash
# Tu flujo existente no cambia
npm start
npm test
git add . && git commit -m "feat: nueva funcionalidad"
```

### **Para Usar Metodología AI:**
```bash
# Generar PRD para nueva feature
# En VS Code con Augment Code:
generate_prd "Nueva funcionalidad que quiero implementar"

# Sincronizar con GitHub Projects
npm run ai:sync

# Ver dashboard de progreso
npm run ai:dashboard
```

---

## **⚠️ Consideraciones Importantes**

### **✅ Ventajas de esta Aproximación:**
- **No interfiere** con tu código existente
- **Mantiene** tu flujo de trabajo actual
- **Agrega** capacidades AI sin conflictos
- **Preserva** toda tu configuración existente

### **🔍 Archivos que NO se Modifican:**
- Tu código fuente (`src/`, `components/`, etc.)
- Tus configuraciones existentes
- Tu `package.json` (solo se extiende)
- Tus tests existentes
- Tu documentación existente

### **📝 Archivos Nuevos Agregados:**
- `.ai-methodology/` (metodología completa)
- `specs/` (especificaciones del proyecto)
- `docs/metrics.md` (métricas generadas)
- `.vscode/mcp.json` (configuración MCP)

**¡Esta integración es completamente segura y reversible!** 🛡️
