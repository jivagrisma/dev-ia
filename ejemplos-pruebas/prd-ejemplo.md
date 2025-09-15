# 📋 PRD: Sistema de Autenticación JWT

## 1. Resumen Ejecutivo

### Objetivo
Implementar un sistema robusto de autenticación y autorización usando JWT para proteger la API y gestionar usuarios de forma segura.

### Problema a Resolver
La API actual carece de un sistema de autenticación, lo que significa que todos los endpoints están expuestos públicamente sin control de acceso.

### Solución Propuesta
Sistema completo de auth con JWT que incluye registro, login, middleware de protección y gestión de roles.

## 2. Objetivos del Producto

### Objetivos Primarios
- Proteger endpoints sensibles con autenticación
- Implementar sistema de roles y permisos
- Gestionar sesiones de usuario de forma segura

### Objetivos Secundarios
- Mejorar la experiencia de usuario con tokens persistentes
- Implementar logging de seguridad
- Preparar base para futuras integraciones OAuth

## 3. Especificaciones Funcionales

### 3.1 Registro de Usuarios
**Endpoint:** `POST /auth/register`
**Funcionalidad:**
- Validar email único
- Hashear password con bcrypt
- Crear usuario en base de datos
- Retornar token JWT inicial

**Criterios de Aceptación:**
- Email debe ser válido y único
- Password mínimo 8 caracteres
- Respuesta incluye token y datos de usuario
- Error 400 si email ya existe

### 3.2 Login de Usuarios
**Endpoint:** `POST /auth/login`
**Funcionalidad:**
- Validar credenciales
- Generar token JWT
- Crear refresh token
- Actualizar último login

**Criterios de Aceptación:**
- Validar email y password
- Token expira en 1 hora
- Refresh token expira en 7 días
- Rate limiting: 5 intentos por minuto

### 3.3 Middleware de Autenticación
**Funcionalidad:**
- Validar token JWT en headers
- Extraer información de usuario
- Proteger rutas específicas
- Manejar tokens expirados

**Criterios de Aceptación:**
- Header Authorization requerido
- Token válido permite acceso
- Token inválido retorna 401
- Token expirado retorna 401

### 3.4 Refresh Token
**Endpoint:** `POST /auth/refresh`
**Funcionalidad:**
- Validar refresh token
- Generar nuevo access token
- Mantener sesión activa

### 3.5 Logout
**Endpoint:** `POST /auth/logout`
**Funcionalidad:**
- Invalidar tokens actuales
- Limpiar sesión del usuario

## 4. Especificaciones Técnicas

### 4.1 Stack Tecnológico
- **Backend:** Node.js + Express.js
- **Base de datos:** SQLite (desarrollo), PostgreSQL (producción)
- **Autenticación:** jsonwebtoken, bcryptjs
- **Validación:** joi o express-validator
- **Testing:** Jest + Supertest

### 4.2 Estructura de Base de Datos
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME
);

CREATE TABLE refresh_tokens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER REFERENCES users(id),
  token VARCHAR(255) NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 4.3 Estructura de JWT
```json
{
  "payload": {
    "userId": 123,
    "email": "user@example.com",
    "role": "user",
    "iat": 1234567890,
    "exp": 1234571490
  }
}
```

## 5. Casos de Uso

### 5.1 Usuario Nuevo se Registra
1. Usuario envía email y password
2. Sistema valida datos
3. Sistema crea cuenta
4. Sistema retorna token
5. Usuario puede acceder a rutas protegidas

### 5.2 Usuario Existente Hace Login
1. Usuario envía credenciales
2. Sistema valida credenciales
3. Sistema genera tokens
4. Usuario recibe acceso

### 5.3 Acceso a Ruta Protegida
1. Usuario envía request con token
2. Middleware valida token
3. Si válido, permite acceso
4. Si inválido, retorna error

## 6. Criterios de Aceptación Globales

### Seguridad
- Passwords hasheados con salt rounds >= 12
- Tokens firmados con secret seguro
- Rate limiting en endpoints de auth
- Validación de input en todos los endpoints

### Performance
- Login/register < 200ms
- Validación de token < 50ms
- Base de datos optimizada con índices

### Usabilidad
- Mensajes de error claros
- Documentación de API completa
- Logs de seguridad detallados

## 7. Definición de Terminado

### Desarrollo
- [ ] Todos los endpoints implementados
- [ ] Middleware de auth funcionando
- [ ] Base de datos configurada
- [ ] Validaciones implementadas

### Testing
- [ ] Tests unitarios > 90% cobertura
- [ ] Tests de integración completos
- [ ] Tests de seguridad
- [ ] Tests de performance

### Documentación
- [ ] API documentada
- [ ] README actualizado
- [ ] Guía de deployment
- [ ] Troubleshooting guide

## 8. Riesgos y Mitigaciones

### Riesgos Técnicos
- **Riesgo:** Vulnerabilidades de seguridad
- **Mitigación:** Code review, security testing, dependencias actualizadas

### Riesgos de Negocio
- **Riesgo:** Impacto en usuarios existentes
- **Mitigación:** Migración gradual, backward compatibility

## 9. Timeline y Milestones

### Sprint 1 (2 semanas)
- Setup de base de datos
- Endpoints de registro y login
- Tests básicos

### Sprint 2 (2 semanas)
- Middleware de autenticación
- Refresh tokens
- Tests de seguridad

### Sprint 3 (1 semana)
- Roles y permisos
- Documentación
- Deployment

## 10. Métricas de Éxito

### Métricas Técnicas
- Tiempo de respuesta < 200ms
- Uptime > 99.9%
- Zero vulnerabilidades críticas

### Métricas de Negocio
- Adopción de usuarios > 80%
- Reducción de incidentes de seguridad
- Satisfacción del equipo de desarrollo
