# 🧪 Guía Completa de Pruebas MCP

*Guía paso a paso para probar todos los comandos MCP de la metodología*

## 🚀 Preparación Inicial

### 1. Ejecutar Script de Preparación
```bash
# Hacer ejecutable el script
chmod +x ejemplos-pruebas/test-mcp-commands.sh

# Ejecutar preparación automática
./ejemplos-pruebas/test-mcp-commands.sh
```

### 2. Verificar Configuración MCP
```bash
# Verificar que MCP está configurado
cat .vscode/mcp.json

# Verificar servidores instalados
cd .ai-methodology/sync
npm run mcp:test
```

---

## 🤖 Pruebas de GitHub Project Manager

### **Comando 1: generate_prd**

#### **Objetivo:** Generar PRD desde una idea
#### **Input:** Idea de proyecto en texto libre
#### **Ejecución:**

1. **Abrir cliente MCP** (VS Code con Augment Code o Cursor)
2. **Ejecutar comando:**
   ```
   generate_prd "Sistema de Notificaciones Push: Implementar notificaciones en tiempo real via WebSocket, push notifications para móviles, email fallback, dashboard de administración, personalización por usuario y analytics de engagement. Objetivos: mejorar engagement 40%, reducir churn 25%, implementar en 3 sprints."
   ```

#### **Output Esperado:**
- PRD completo en formato markdown
- Secciones: Resumen, objetivos, especificaciones, criterios de aceptación
- Timeline y estimaciones
- Riesgos y mitigaciones

#### **Validación:**
- [ ] PRD generado es coherente y completo
- [ ] Incluye objetivos de negocio claros
- [ ] Tiene criterios de aceptación específicos
- [ ] Timeline es realista

---

### **Comando 2: parse_prd**

#### **Objetivo:** Convertir PRD en tareas ejecutables
#### **Input:** Archivo PRD existente
#### **Ejecución:**

1. **Usar PRD de ejemplo:**
   ```
   parse_prd "ejemplos-pruebas/prd-ejemplo.md"
   ```

#### **Output Esperado:**
- Lista de tareas estructuradas
- Estimaciones de esfuerzo
- Dependencias entre tareas
- Criterios de aceptación por tarea

#### **Validación:**
- [ ] Tareas son específicas y ejecutables
- [ ] Estimaciones son razonables
- [ ] Dependencias están identificadas
- [ ] Criterios de aceptación son testeable

---

### **Comando 3: sync_specs**

#### **Objetivo:** Sincronizar especificaciones con GitHub
#### **Input:** Especificaciones en directorio specs/
#### **Ejecución:**

1. **Verificar specs existentes:**
   ```bash
   ls specs/
   ```

2. **Ejecutar sincronización:**
   ```
   sync_specs
   ```

#### **Output Esperado:**
- Issues creados en GitHub Projects
- Labels aplicados correctamente
- Estimaciones transferidas

#### **Validación:**
```bash
# Verificar issues creados
curl -H "Authorization: token $GITHUB_TOKEN" \
     https://api.github.com/repos/jivagrisma/dev-ia/issues

# Ver dashboard actualizado
cd .ai-methodology/sync && npm run dashboard
```

---

### **Comando 4: get_project_status**

#### **Objetivo:** Obtener estado actual del proyecto
#### **Input:** Ninguno (usa proyecto configurado)
#### **Ejecución:**

```
get_project_status
```

#### **Output Esperado:**
- Resumen de progreso
- Tareas abiertas/cerradas
- Métricas de velocidad
- Próximos milestones

#### **Validación:**
- [ ] Datos coinciden con dashboard local
- [ ] Métricas son precisas
- [ ] Estado refleja realidad del proyecto

---

## 🧠 Pruebas de Task Master AI

### **Comando 5: analyze_complexity**

#### **Objetivo:** Analizar complejidad de tareas
#### **Input:** Descripción de tarea compleja
#### **Ejecución:**

1. **Tarea simple:**
   ```
   analyze_complexity "Agregar logging estructurado con Winston, diferentes niveles (debug, info, warn, error) y rotación automática de logs"
   ```

2. **Tarea compleja:**
   ```
   analyze_complexity "Implementar sistema de cache distribuido usando Redis cluster con invalidación inteligente, estrategias de clustering, monitoreo en tiempo real y fallback automático"
   ```

3. **Tarea épica:**
   ```
   analyze_complexity "Migrar arquitectura monolítica a microservicios con comunicación asíncrona, service discovery, circuit breakers, distributed tracing y deployment automatizado"
   ```

#### **Output Esperado:**
- Score de complejidad (1-10 o story points)
- Factores de complejidad identificados
- Recomendaciones de división
- Estimación de tiempo

#### **Validación:**
- [ ] Scores son consistentes con complejidad real
- [ ] Factores identificados son relevantes
- [ ] Recomendaciones son útiles

---

### **Comando 6: breakdown_task**

#### **Objetivo:** Dividir tareas complejas en subtareas
#### **Input:** Tarea grande o épica
#### **Ejecución:**

```
breakdown_task "Implementar sistema completo de autenticación JWT incluyendo registro, login, middleware de protección, refresh tokens, roles y permisos, rate limiting y logging de seguridad"
```

#### **Output Esperado:**
- Lista de subtareas específicas
- Orden de implementación sugerido
- Dependencias entre subtareas
- Criterios de aceptación por subtarea

#### **Validación:**
- [ ] Subtareas cubren toda la funcionalidad
- [ ] Son independientes y ejecutables
- [ ] Orden de implementación es lógico
- [ ] Tamaño de subtareas es manejable

---

### **Comando 7: estimate_effort**

#### **Objetivo:** Estimar esfuerzo requerido
#### **Input:** Descripción de feature o proyecto
#### **Ejecución:**

1. **Feature pequeña:**
   ```
   estimate_effort "Agregar endpoint GET /users para listar usuarios con paginación y filtros básicos"
   ```

2. **Feature mediana:**
   ```
   estimate_effort "Sistema de notificaciones push con WebSocket, email fallback y dashboard de administración"
   ```

3. **Proyecto grande:**
   ```
   estimate_effort "Plataforma completa de e-commerce con catálogo de productos, carrito de compras, procesamiento de pagos, gestión de inventario y panel de administración"
   ```

#### **Output Esperado:**
- Estimación en story points y/o horas
- Desglose por componentes
- Factores que afectan la estimación
- Rango de confianza

#### **Validación:**
- [ ] Estimaciones son realistas
- [ ] Desglose es detallado
- [ ] Factores de riesgo considerados
- [ ] Rangos de confianza apropiados

---

### **Comando 8: generate_subtasks**

#### **Objetivo:** Generar subtareas detalladas para épicas
#### **Input:** Epic o historia de usuario grande
#### **Ejecución:**

```
generate_subtasks "Como administrador del sistema, quiero implementar un dashboard completo de analytics que me permita ver métricas de usuarios, performance de la aplicación, errores en tiempo real, y generar reportes personalizados para tomar decisiones informadas sobre el producto"
```

#### **Output Esperado:**
- Subtareas con formato de historia de usuario
- Criterios de aceptación específicos
- Tasks técnicas de implementación
- Tests de aceptación

#### **Validación:**
- [ ] Subtareas siguen formato estándar
- [ ] Criterios son específicos y testeable
- [ ] Cobertura completa del epic
- [ ] Tareas técnicas incluidas

---

## 📊 Validación de Resultados

### **Dashboard de Progreso**
```bash
cd .ai-methodology/sync
npm run dashboard
```

### **Verificar Issues en GitHub**
```bash
# Ver issues abiertos
curl -H "Authorization: token $GITHUB_TOKEN" \
     https://api.github.com/repos/jivagrisma/dev-ia/issues?state=open

# Ver proyecto GitHub
curl -H "Authorization: token $GITHUB_TOKEN" \
     https://api.github.com/users/jivagrisma/projects
```

### **Métricas Actualizadas**
```bash
cat docs/metrics.md
```

---

## 📝 Documentar Resultados

### **Template de Resultados**
Para cada comando probado, documentar:

```markdown
## Comando: [nombre_comando]

### Input:
[descripción del input usado]

### Output:
[resultado obtenido]

### Tiempo de Ejecución:
[tiempo que tomó]

### Calidad del Output:
- Precisión: [1-10]
- Completitud: [1-10]
- Utilidad: [1-10]

### Observaciones:
[notas adicionales]

### Recomendaciones:
[mejoras sugeridas]
```

---

## 🎯 Criterios de Éxito

### **Para GitHub Project Manager:**
- [ ] PRDs generados son completos y útiles
- [ ] Parsing de PRDs produce tareas ejecutables
- [ ] Sincronización crea issues correctamente
- [ ] Status del proyecto es preciso

### **Para Task Master AI:**
- [ ] Análisis de complejidad es consistente
- [ ] Breakdown de tareas es útil
- [ ] Estimaciones son realistas
- [ ] Subtareas generadas son específicas

### **Para Integración:**
- [ ] Comandos funcionan sin errores
- [ ] Outputs se integran con flujo existente
- [ ] Dashboard refleja cambios automáticamente
- [ ] Metodología completa funciona end-to-end

---

## 🚀 Próximos Pasos

1. **Ejecutar todas las pruebas** siguiendo esta guía
2. **Documentar resultados** usando el template
3. **Identificar mejoras** en la integración
4. **Optimizar configuración** MCP si es necesario
5. **Crear casos de uso** adicionales
6. **Entrenar al equipo** en el uso de comandos MCP

---

*Guía creada para validar la metodología completa de desarrollo con IA*
