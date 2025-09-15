# 🤖 Configuración de Servidores MCP

## 🔒 Gestión Segura de Credenciales

### **⚠️ Importante:**
Los archivos de configuración MCP **NO soportan variables de entorno** con sintaxis `${VARIABLE}`. Las credenciales deben configurarse directamente en el archivo `mcp.json`.

## 📋 Configuración Inicial

### **Paso 1: Configurar Variables de Entorno**
```bash
# Copiar template de variables
cp .env.example .env

# Editar .env con tus credenciales reales
nano .env
```

### **Paso 2: Generar Configuración MCP**
```bash
# Ejecutar script de configuración
bash .ai-methodology/setup-mcp-credentials.sh
```

### **Paso 3: Reiniciar VS Code**
```bash
# Cerrar VS Code completamente y volver a abrir
# Esto es necesario para que tome la nueva configuración MCP
```

## 🔍 Archivos Involucrados

### **📁 Archivos Versionados (seguros):**
- `.vscode/mcp.json.template` - Template sin credenciales
- `.env.example` - Ejemplo de variables de entorno
- `.ai-methodology/setup-mcp-credentials.sh` - Script de configuración

### **🔒 Archivos NO Versionados (con credenciales):**
- `.vscode/mcp.json` - Configuración real con credenciales
- `.env` - Variables de entorno reales

## 🛡️ Seguridad

### **✅ Buenas Prácticas:**
- ✅ `.env` y `.vscode/mcp.json` están en `.gitignore`
- ✅ Solo templates y scripts se versionan
- ✅ Cada desarrollador configura sus propias credenciales
- ✅ No hay credenciales hardcodeadas en el repositorio

### **❌ Nunca Hacer:**
- ❌ Commitear archivos con credenciales reales
- ❌ Compartir tokens en chat o documentación
- ❌ Usar credenciales de producción en desarrollo

## 🔧 Comandos MCP Disponibles

Una vez configurado correctamente, tendrás acceso a:

### **GitHub Project Manager:**
- `generate_prd` - Generar PRD desde idea
- `parse_prd` - Analizar PRD existente
- `sync_specs` - Sincronizar con GitHub Projects
- `get_project_status` - Estado del proyecto

### **Task Master AI:**
- `analyze_complexity` - Analizar complejidad de tareas
- `breakdown_task` - Dividir tareas complejas
- `estimate_effort` - Estimar esfuerzo
- `generate_subtasks` - Generar subtareas

## 🚨 Solución de Problemas

### **Error: "MCP server not found"**
```bash
# Verificar que el script se ejecutó correctamente
ls -la .vscode/mcp.json

# Si no existe, ejecutar setup nuevamente
bash .ai-methodology/setup-mcp-credentials.sh
```

### **Error: "Invalid credentials"**
```bash
# Verificar variables en .env
cat .env | grep GITHUB_TOKEN

# Regenerar configuración
bash .ai-methodology/setup-mcp-credentials.sh
```

### **Error: "Commands not working"**
1. Verificar que VS Code está completamente cerrado
2. Ejecutar setup script
3. Abrir VS Code nuevamente
4. Esperar unos segundos para que MCP se inicialice

## 📝 Para Nuevos Desarrolladores

### **Setup Rápido:**
```bash
# 1. Clonar repositorio
git clone https://github.com/usuario/proyecto.git
cd proyecto

# 2. Configurar credenciales
cp .env.example .env
# Editar .env con tus credenciales

# 3. Configurar MCP
bash .ai-methodology/setup-mcp-credentials.sh

# 4. Reiniciar VS Code
```

## 🎯 Resultado Esperado

Después de la configuración correcta:
- ✅ Comandos MCP funcionan en VS Code
- ✅ No hay credenciales en el repositorio
- ✅ Cada desarrollador tiene su configuración local
- ✅ Metodología AI completamente funcional
