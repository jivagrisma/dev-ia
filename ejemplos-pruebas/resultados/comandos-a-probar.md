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
