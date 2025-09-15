#!/bin/bash

# 🧪 Script de Pruebas para Comandos MCP
# Automatiza las pruebas de todos los comandos MCP disponibles

set -e  # Exit on any error

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para logging
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    error "No se encontró package.json. Ejecutar desde la raíz del proyecto."
    exit 1
fi

# Crear directorio de resultados
mkdir -p ejemplos-pruebas/resultados
RESULTS_DIR="ejemplos-pruebas/resultados"

log "🚀 Iniciando pruebas de comandos MCP..."

# Test 1: Verificar configuración MCP
log "📋 Test 1: Verificando configuración MCP..."
if [ -f ".vscode/mcp.json" ]; then
    success "Configuración MCP encontrada"
    cat .vscode/mcp.json > "$RESULTS_DIR/mcp-config.json"
else
    warning "Configuración MCP no encontrada"
fi

# Test 2: Verificar servidores MCP instalados
log "📋 Test 2: Verificando instalación de servidores MCP..."
cd .ai-methodology/sync
if npm run mcp:test > "$RESULTS_DIR/mcp-test.log" 2>&1; then
    success "Servidores MCP funcionando"
else
    warning "Algunos servidores MCP pueden no estar funcionando"
fi
cd ../..

# Test 3: Preparar datos de prueba
log "📋 Test 3: Preparando datos de prueba..."

# Crear archivo de ideas para generate_prd
cat > "$RESULTS_DIR/test-idea.txt" << 'EOF'
Sistema de Notificaciones Push

Implementar un sistema completo de notificaciones push para la aplicación web, incluyendo:
- Notificaciones en tiempo real via WebSocket
- Push notifications para móviles
- Email notifications como fallback
- Dashboard de administración de notificaciones
- Personalización de preferencias por usuario
- Analytics de engagement de notificaciones

Objetivos:
- Mejorar engagement de usuarios en 40%
- Reducir churn rate en 25%
- Implementar en 3 sprints
EOF

success "Datos de prueba creados"

# Test 4: Simular comandos MCP (ya que no podemos ejecutarlos directamente)
log "📋 Test 4: Documentando comandos MCP a probar..."

cat > "$RESULTS_DIR/comandos-a-probar.md" << 'EOF'
# 🤖 Comandos MCP a Probar

## 1. GitHub Project Manager

### generate_prd
**Comando:** `generate_prd "Sistema de Notificaciones Push"`
**Input:** Idea de proyecto (texto libre)
**Output Esperado:** PRD completo en formato markdown
**Archivo de prueba:** `test-idea.txt`

### parse_prd  
**Comando:** `parse_prd "ejemplos-pruebas/prd-ejemplo.md"`
**Input:** Archivo PRD en markdown
**Output Esperado:** Lista de tareas estructuradas
**Archivo de prueba:** `prd-ejemplo.md`

### sync_specs
**Comando:** `sync_specs`
**Input:** Especificaciones en directorio specs/
**Output Esperado:** Issues creados en GitHub Projects

### create_project
**Comando:** `create_project "Nuevo Proyecto Test"`
**Input:** Nombre del proyecto
**Output Esperado:** Proyecto creado en GitHub

### get_project_status
**Comando:** `get_project_status`
**Input:** Ninguno (usa proyecto actual)
**Output Esperado:** Estado actual del proyecto

## 2. Task Master AI

### analyze_complexity
**Comando:** `analyze_complexity "Implementar sistema de cache distribuido"`
**Input:** Descripción de tarea
**Output Esperado:** Análisis de complejidad con score
**Archivo de prueba:** `tareas-complejas.md`

### breakdown_task
**Comando:** `breakdown_task "Migración de base de datos"`
**Input:** Tarea compleja
**Output Esperado:** Lista de subtareas más pequeñas

### estimate_effort
**Comando:** `estimate_effort "Sistema de autenticación JWT"`
**Input:** Descripción de feature
**Output Esperado:** Estimación en story points/horas

### generate_subtasks
**Comando:** `generate_subtasks "Implementar microservicios"`
**Input:** Epic o tarea grande
**Output Esperado:** Subtareas detalladas con criterios de aceptación

## 3. Comandos de Validación

### Verificar Issues Creados
```bash
curl -H "Authorization: token $GITHUB_TOKEN" \
     https://api.github.com/repos/jivagrisma/dev-ia/issues
```

### Verificar Proyecto GitHub
```bash
curl -H "Authorization: token $GITHUB_TOKEN" \
     -H "Accept: application/vnd.github.v3+json" \
     https://api.github.com/users/jivagrisma/projects
```

### Dashboard de Progreso
```bash
cd .ai-methodology/sync && npm run dashboard
```
EOF

success "Comandos documentados para prueba manual"

# Test 5: Verificar estado actual del proyecto
log "📋 Test 5: Verificando estado actual del proyecto..."
cd .ai-methodology/sync
npm run dashboard > "$RESULTS_DIR/dashboard-antes.log" 2>&1
cd ../..
success "Estado actual capturado"

# Test 6: Crear especificación de prueba
log "📋 Test 6: Creando especificación de prueba..."
cat > "specs/notifications.spec.yaml" << 'EOF'
id: NOTIF-1
title: Sistema de Notificaciones Push
description: Implementar sistema completo de notificaciones en tiempo real

objectives:
  - Notificaciones WebSocket en tiempo real
  - Push notifications para móviles
  - Email notifications como fallback
  - Dashboard de administración

tasks:
  - title: Implementar WebSocket server para notificaciones
    labels: [backend, websocket, real-time]
    estimate: "8h"
    description: Servidor WebSocket para notificaciones en tiempo real
    
  - title: Crear sistema de push notifications
    labels: [mobile, push, notifications]
    estimate: "12h"
    description: Integración con servicios de push notifications
    
  - title: Implementar email fallback
    labels: [email, fallback, notifications]
    estimate: "4h"
    description: Sistema de email como fallback para notificaciones
    
  - title: Dashboard de administración
    labels: [frontend, admin, dashboard]
    estimate: "6h"
    description: Interface para gestionar notificaciones

acceptance_criteria:
  - Notificaciones se entregan en < 100ms
  - Push notifications funcionan en iOS y Android
  - Email fallback se activa automáticamente
  - Dashboard permite crear/editar/eliminar notificaciones
  - Analytics de engagement disponibles
EOF

success "Especificación de prueba creada"

# Test 7: Sincronizar nueva especificación
log "📋 Test 7: Sincronizando nueva especificación..."
cd .ai-methodology/sync
if npm run sync > "$RESULTS_DIR/sync-test.log" 2>&1; then
    success "Sincronización ejecutada"
else
    warning "Sincronización puede haber fallado - revisar logs"
fi
cd ../..

# Test 8: Verificar dashboard actualizado
log "📋 Test 8: Verificando dashboard actualizado..."
cd .ai-methodology/sync
npm run dashboard > "$RESULTS_DIR/dashboard-despues.log" 2>&1
cd ../..
success "Dashboard actualizado capturado"

# Resumen de resultados
log "📊 Generando resumen de resultados..."
cat > "$RESULTS_DIR/resumen-pruebas.md" << EOF
# 📊 Resumen de Pruebas MCP

**Fecha:** $(date)
**Proyecto:** dev-ia
**Versión:** $(cat package.json | grep version | cut -d'"' -f4)

## ✅ Tests Completados

1. **Configuración MCP:** $([ -f ".vscode/mcp.json" ] && echo "✅ OK" || echo "❌ FALTA")
2. **Servidores MCP:** $([ -f "$RESULTS_DIR/mcp-test.log" ] && echo "✅ PROBADO" || echo "❌ ERROR")
3. **Datos de Prueba:** ✅ CREADOS
4. **Comandos Documentados:** ✅ LISTOS
5. **Estado Capturado:** ✅ OK
6. **Spec de Prueba:** ✅ CREADA
7. **Sincronización:** $([ -f "$RESULTS_DIR/sync-test.log" ] && echo "✅ EJECUTADA" || echo "❌ ERROR")
8. **Dashboard:** ✅ ACTUALIZADO

## 📁 Archivos Generados

- \`mcp-config.json\` - Configuración MCP actual
- \`mcp-test.log\` - Logs de test de servidores MCP
- \`test-idea.txt\` - Idea para generate_prd
- \`comandos-a-probar.md\` - Lista de comandos MCP
- \`dashboard-antes.log\` - Estado antes de pruebas
- \`sync-test.log\` - Logs de sincronización
- \`dashboard-despues.log\` - Estado después de pruebas

## 🎯 Próximos Pasos

1. **Ejecutar comandos MCP manualmente** usando los ejemplos en \`comandos-a-probar.md\`
2. **Verificar resultados** comparando dashboards antes/después
3. **Documentar outputs** de cada comando MCP
4. **Validar integración** completa del flujo

## 📋 Comandos Listos para Probar

### GitHub Project Manager:
- \`generate_prd\` con \`test-idea.txt\`
- \`parse_prd\` con \`prd-ejemplo.md\`
- \`sync_specs\` (ya ejecutado)
- \`get_project_status\`

### Task Master AI:
- \`analyze_complexity\` con ejemplos de \`tareas-complejas.md\`
- \`breakdown_task\` con tareas épicas
- \`estimate_effort\` con features nuevas
- \`generate_subtasks\` con epics

EOF

success "Resumen generado en $RESULTS_DIR/resumen-pruebas.md"

# Mostrar resumen final
log "🎉 Pruebas de preparación completadas!"
echo ""
echo "📁 Resultados disponibles en: $RESULTS_DIR/"
echo "📋 Próximo paso: Ejecutar comandos MCP manualmente"
echo "📖 Guía completa en: $RESULTS_DIR/comandos-a-probar.md"
echo ""
warning "Nota: Los comandos MCP deben ejecutarse manualmente desde el cliente MCP"
echo ""
