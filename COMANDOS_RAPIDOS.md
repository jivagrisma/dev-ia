# ⚡ Comandos Rápidos - Metodología de Desarrollo con IA

*Referencia rápida de comandos para la metodología implementada*

## 🚀 Setup Inicial

```bash
# Bootstrap completo de la metodología
bash ./.ai-methodology/ai-setup.sh

# Instalar dependencias del proyecto
npm install

# Configurar servidores MCP
cd .ai-methodology/sync
npm run mcp:install
```

## 🔄 Desarrollo Diario

### **Iniciar Desarrollo:**
```bash
# Servidor en modo desarrollo
npm run dev

# Tests en modo watch
npm run test:watch

# Dashboard de progreso
cd .ai-methodology/sync && npm run dashboard
```

### **Crear Nueva Feature:**
```bash
# 1. Crear especificación
vim specs/nueva-feature.spec.yaml

# 2. Sincronizar con GitHub
cd .ai-methodology/sync && npm run sync

# 3. Ver issues creados
npm run dashboard

# 4. Implementar y testear
npm run dev
npm run test:coverage

# 5. Commit con cierre automático
git add .
git commit -m "feat: Nueva feature (Closes #X)"
git push origin main
```

## 🧪 Testing y Calidad

```bash
# Ejecutar todos los tests
npm test

# Tests con cobertura
npm run test:coverage

# Solo tests de integración
npm run test:integration

# Solo tests unitarios
npm run test:unit

# Linting y formato
npm run lint
npm run lint:fix
npm run format
```

## 📊 Monitoreo y Métricas

```bash
# Dashboard de progreso
cd .ai-methodology/sync && npm run dashboard

# Sincronizar specs con GitHub
cd .ai-methodology/sync && npm run sync

# Verificar estado del servidor
npm run health
curl http://localhost:3000/health

# Ver métricas detalladas
cat docs/metrics.md
```

## 🤖 Comandos MCP (Próximos)

```bash
# GitHub Project Manager
generate_prd "Idea de nueva feature"
parse_prd "archivo-prd.md"
sync_specs
get_project_status

# Task Master AI
analyze_complexity "tarea compleja"
breakdown_task "tarea grande"
estimate_effort "nueva feature"
generate_subtasks "epic de usuario"
```

## 🔧 Troubleshooting

### **Problemas Comunes:**

```bash
# Servidor no inicia
npm run health
lsof -i :3000  # Verificar puerto ocupado

# Tests fallan
npm run test:unit  # Probar tests unitarios primero
npm run test:integration  # Luego integración

# MCP no funciona
cd .ai-methodology/sync
npm run mcp:install  # Reinstalar configuración

# Sincronización falla
cd .ai-methodology/sync
npm run sync  # Verificar logs de error
```

### **Logs y Debug:**

```bash
# Ver logs del servidor
npm run dev  # Logs en tiempo real

# Debug de tests
npm run test -- --verbose

# Verificar configuración MCP
cat .vscode/mcp.json

# Estado de GitHub Issues
curl -H "Authorization: token $GITHUB_TOKEN" \
     https://api.github.com/repos/jivagrisma/dev-ia/issues
```

## 📁 Archivos Importantes

```bash
# Configuración principal
package.json              # Dependencias y scripts
jest.config.js           # Configuración de tests
.vscode/mcp.json         # Configuración MCP

# Código fuente
src/app.js               # Aplicación Express
src/routes/health.js     # Endpoint de salud
tests/integration/       # Tests de integración

# Metodología
.ai-methodology/sync/    # Módulo de sincronización
specs/                   # Especificaciones YAML
docs/metrics.md          # Métricas automáticas
```

## 🎯 Flujo de Trabajo Recomendado

### **Para Nueva Feature:**

1. **📝 Especificar**
   ```bash
   vim specs/feature-name.spec.yaml
   ```

2. **🔄 Sincronizar**
   ```bash
   cd .ai-methodology/sync && npm run sync
   ```

3. **💻 Implementar**
   ```bash
   npm run dev  # Terminal 1
   npm run test:watch  # Terminal 2
   ```

4. **🧪 Validar**
   ```bash
   npm run test:coverage
   npm run lint
   ```

5. **📤 Entregar**
   ```bash
   git add .
   git commit -m "feat: Description (Closes #N)"
   git push origin main
   ```

6. **📊 Verificar**
   ```bash
   cd .ai-methodology/sync && npm run dashboard
   ```

## 🔗 Enlaces Útiles

- **Repositorio**: https://github.com/jivagrisma/dev-ia
- **Proyecto GitHub**: https://github.com/users/jivagrisma/projects/1
- **API Local**: http://localhost:3000
- **Health Check**: http://localhost:3000/health

---

*Comandos actualizados automáticamente - 15 de septiembre de 2025*
