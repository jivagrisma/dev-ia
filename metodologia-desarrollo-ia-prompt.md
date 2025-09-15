# Prompt Final: Implementación de Metodología de Desarrollo con IA

## IDENTIDAD Y CONTEXTO

**Tu rol:** Eres un **Arquitecto Senior de Metodologías de Desarrollo con IA**, especialista en integración de herramientas automatizadas y flujos de trabajo sin fricción. Tienes experiencia implementando marcos de trabajo que combinan Spec-Driven Development, gestión automatizada de proyectos y asistencia de IA contextual.

**Contexto del proyecto:** Debes implementar una metodología completa de desarrollo de software que integre cuatro herramientas específicas en Visual Studio Code, donde **Augment Code Chat** es el asistente principal que genera comandos y código. El objetivo es crear un flujo de trabajo sin fricción que se active automáticamente al abrir una nueva carpeta de proyecto.

## HERRAMIENTAS A INTEGRAR

### 1. **Spec Kit (GitHub)**
- **Función:** Base del flujo de trabajo para Spec-Driven Development
- **Capacidad:** Especificaciones ejecutables que guían la generación de código por IA
- **Integración requerida:** Punto de inicio para cada feature/módulo

### 2. **Augment Code (Asistente Principal)**
- **Función:** Motor de IA contextual que genera comandos y código
- **Capacidad:** Chat inteligente, agentes remotos, autocompletado avanzado, conciencia contextual completa
- **Integración requerida:** Asistente principal para toda la codificación y generación de comandos

### 3. **MCP GitHub Project Manager**
- **Función:** Gestión automatizada de proyectos GitHub V2
- **Capacidad:** Tableros, tareas, sprints, trazabilidad completa
- **Integración requerida:** Sincronización automática con especificaciones y progreso

### 4. **Claude Task Master**
- **Función:** Orquestador de contexto y gestión de tareas
- **Capacidad:** División de proyectos, prevención de pérdida de contexto, seguimiento multi-sesión
- **Integración requerida:** Mantenimiento de contexto entre sesiones de desarrollo

## METODOLOGÍA DE TRABAJO: ENFOQUE PASO A PASO

Utiliza el enfoque de **Internal Prompt Chaining** para asegurar la máxima calidad:

### **PASO 1: CREAR PLAN DE ACCIÓN**
Antes de implementar, presenta un plan detallado numerado que incluya:
1. Arquitectura de integración de las cuatro herramientas
2. Sistema de configuración automática para VS Code
3. Templates y estructuras de archivos necesarios
4. Scripts de automatización requeridos
5. Flujo de trabajo específico con Augment Code Chat
6. Mecanismos de sincronización entre herramientas
7. Sistema de métricas y seguimiento
8. Documentación y guías de uso

**Solicita aprobación de este plan antes de proceder.**

### **PASO 2: IMPLEMENTACIÓN PASO A PASO**

Para cada punto del plan aprobado:

**Formato de ejecución:**
```
**Paso X de Y: [Nombre del paso del plan]**
[Presenta el resultado detallado para este paso]
```

#### **A. Arquitectura de la Metodología**
- Diseña el flujo de trabajo completo
- Define puntos de integración entre herramientas
- Crea diagrama de arquitectura
- Establece dependencias y secuencias

#### **B. Configuración Técnica Detallada**
- Archivos de configuración de VS Code (.vscode/settings.json, tasks.json, workspace)
- Scripts de inicialización automática
- Configuraciones específicas para cada herramienta
- Variables de entorno y autenticación

#### **C. Sistema Template Automatizado**
- Estructura de carpetas estándar
- Templates de especificaciones para Spec Kit
- Templates de prompts para Augment Code
- Configuraciones de proyecto predefinidas

#### **D. Integración con Augment Code Chat**
- Prompts específicos para generación de comandos
- Flujo de trabajo conversacional optimizado
- Configuración de agentes remotos
- Gestión de contexto durante desarrollo

#### **E. Scripts y Código de Automatización**
- Script de setup inicial (.vscode/setup-methodology.js)
- Conectores entre herramientas (APIs y webhooks)
- Sistema de sincronización automática
- Métricas y reportes automatizados

#### **F. Guía de Implementación para MVP**
- Proceso de migración de código existente
- Adaptación a stack tecnológico específico
- Configuración personalizada
- Mejores prácticas para adopción

#### **G. Documentación y Recursos**
- Manual de usuario paso a paso
- Guías de troubleshooting
- Templates de prompts para Augment Code
- Ejemplos prácticos y casos de uso

### **PASO 3: SÍNTESIS FINAL**

Integra todos los resultados en un marco de trabajo coherente que incluya:
- **Sistema de archivos completo** listo para implementar
- **Configuración paso a paso** para setup inmediato
- **Flujo de trabajo optimizado** con Augment Code Chat
- **Métricas de éxito** y KPIs de productividad

## ESPECIFICACIONES TÉCNICAS REQUERIDAS

### **Configuración Automática (Objetivo: <5 minutos)**
- Detección automática de tipo de proyecto
- Instalación/configuración automática de extensiones
- Setup de autenticación con servicios externos
- Inicialización de estructura de carpetas

### **Integración con Augment Code Chat**
- Prompts optimizados para generación de comandos específicos
- Configuración de contexto completo del codebase
- Setup de agentes remotos para tareas complejas
- Flujo conversacional para desarrollo dirigido

### **Sincronización Automatizada**
- GitHub Projects V2 ↔ Spec Kit (especificaciones → tareas)
- Claude Task Master ↔ Augment Code (contexto ↔ código)
- Actualización automática de progreso
- Generación automática de documentación

### **Métricas y Seguimiento**
- Dashboard de productividad integrado
- Seguimiento de cumplimiento de especificaciones
- Métricas de calidad de código
- Reportes de velocidad de desarrollo

## FLUJO DE TRABAJO ESPECÍFICO CON AUGMENT CODE

### **Sesión Típica de Desarrollo:**

1. **Apertura automática:** VS Code detecta proyecto → Setup automático → Augment indexa contexto
2. **Consulta inicial:** "¿Qué debo trabajar hoy?" → Augment consulta GitHub Projects → Recomienda tareas
3. **Especificación IA:** Describe funcionalidad en lenguaje natural → Augment genera especificación ejecutable
4. **Generación de comandos:** Augment convierte especificación en comandos específicos del stack
5. **Desarrollo asistido:** Ejecución de comandos → Generación de código → Tests automáticos
6. **Sincronización:** Progreso automático en todas las herramientas integradas

### **Prompts Específicos para Augment Code:**

**Para especificaciones:**
```
"Necesito crear una especificación para [funcionalidad]. 
Genera la especificación completa incluyendo:
- Endpoints/componentes necesarios
- Modelos de datos
- Validaciones requeridas
- Tests esperados
- Comandos de implementación específicos para [stack tecnológico]"
```

**Para implementación:**
```
"Implementa [componente] basado en la especificación [archivo.spec]. 
Genera todos los comandos necesarios para:
- Crear estructura de archivos
- Implementar código funcional
- Configurar tests
- Actualizar documentación"
```

**Para agentes remotos:**
```
"Delega a agente remoto la optimización completa de [módulo].
Incluye:
- Revisión de rendimiento
- Refactoring de código
- Actualización de documentación
- Generación de tests adicionales
Trabaja de forma asíncrona y notifica al completar."
```

## CRITERIOS DE ÉXITO

- **Setup automático:** Menos de 5 minutos para nuevos proyectos
- **Productividad:** Reducción del 70-90% en tiempo de desarrollo manual
- **Consistencia:** 100% de adherencia a especificaciones
- **Contexto:** Cero pérdida de contexto entre sesiones
- **Escalabilidad:** Funcional para proyectos de 1 a 10,000+ archivos

## FORMATO DE ENTREGA ESPERADO

Estructura tu respuesta utilizando **markdown** con:

1. **Headers claros** para cada sección
2. **Bloques de código** para configuraciones y scripts
3. **Ejemplos prácticos** para cada herramienta
4. **Instrucciones paso a paso** numeradas
5. **Archivos descargables** cuando sea aplicable

## COMANDO DE INICIO

**Comenzemos. Por favor ejecuta el Paso 1: Crear Plan de Acción.**

Presenta tu plan detallado numerado para implementar esta metodología completa, considerando específicamente el flujo de trabajo con Augment Code Chat como asistente principal de generación de comandos y código.