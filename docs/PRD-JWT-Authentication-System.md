# 📋 PRD: Sistema de Autenticación y Autorización JWT

## 1. Resumen Ejecutivo

### 🎯 Objetivo
Implementar un sistema robusto de autenticación y autorización usando JSON Web Tokens (JWT) para proteger la API existente y gestionar usuarios de forma segura y escalable.

### 🔍 Problema a Resolver
La API actual (`dev_ia`) carece de un sistema de autenticación, lo que significa que todos los endpoints están expuestos públicamente sin control de acceso. Esto representa un riesgo de seguridad significativo y limita la capacidad de implementar funcionalidades específicas por usuario.

### 💡 Solución Propuesta
Sistema completo de autenticación y autorización con JWT que incluye registro, login, middleware de protección, gestión de roles, refresh tokens, y características avanzadas de seguridad como rate limiting y logging de seguridad.

### 📊 Estimación
**2-3 sprints** (4-6 semanas) con un equipo de 1-2 desarrolladores

## 2. Objetivos del Producto

### 🎯 Objetivos Primarios
- **Seguridad**: Proteger endpoints sensibles con autenticación robusta
- **Autorización**: Implementar sistema de roles y permisos (admin, user)
- **Gestión de Sesiones**: Manejar sesiones de usuario de forma segura y escalable
- **Experiencia de Usuario**: Proporcionar flujo de autenticación fluido y confiable

### 🎯 Objetivos Secundarios
- **Escalabilidad**: Preparar base para futuras integraciones OAuth/SSO
- **Monitoreo**: Implementar logging de seguridad completo
- **Performance**: Optimizar validación de tokens para alta concurrencia
- **Mantenibilidad**: Código modular y bien documentado

### 📈 Métricas de Éxito
- **Seguridad**: 0 vulnerabilidades críticas en auditoría
- **Performance**: Validación de tokens < 50ms
- **Disponibilidad**: 99.9% uptime del sistema de auth
- **Usabilidad**: < 3 pasos para login/registro

## 3. Especificaciones Funcionales

### 3.1 Registro de Usuarios
**Endpoint:** `POST /auth/register`

**Funcionalidad:**
- Validar email único en el sistema
- Hashear password con bcrypt (salt rounds: 12)
- Crear usuario en base de datos con rol por defecto
- Generar token JWT inicial y refresh token
- Enviar email de verificación (opcional)

**Criterios de Aceptación:**
- ✅ Email debe ser válido y único
- ✅ Password mínimo 8 caracteres, al menos 1 mayúscula, 1 número
- ✅ Respuesta incluye access token, refresh token y datos de usuario
- ✅ Error 400 si email ya existe
- ✅ Error 422 si datos de entrada son inválidos
- ✅ Rate limiting: máximo 5 intentos por IP por hora

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user",
      "createdAt": "2024-01-15T10:30:00Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
      "expiresIn": 3600
    }
  }
}
```

### 3.2 Login de Usuarios
**Endpoint:** `POST /auth/login`

**Funcionalidad:**
- Validar credenciales (email/password)
- Generar nuevo access token y refresh token
- Actualizar último login en base de datos
- Registrar intento de login en logs de seguridad

**Criterios de Aceptación:**
- ✅ Validación de credenciales correcta
- ✅ Tokens generados con expiración apropiada
- ✅ Error 401 si credenciales incorrectas
- ✅ Error 429 si se excede rate limit
- ✅ Rate limiting: máximo 10 intentos por IP por hora
- ✅ Bloqueo temporal después de 5 intentos fallidos consecutivos

### 3.3 Logout de Usuarios
**Endpoint:** `POST /auth/logout`

**Funcionalidad:**
- Invalidar refresh token actual
- Agregar access token a blacklist (opcional)
- Registrar logout en logs de seguridad

### 3.4 Refresh Token
**Endpoint:** `POST /auth/refresh`

**Funcionalidad:**
- Validar refresh token
- Generar nuevo access token
- Rotar refresh token (opcional)

### 3.5 Middleware de Autenticación
**Funcionalidad:**
- Validar access token en header Authorization
- Extraer información de usuario del token
- Inyectar datos de usuario en req.user
- Manejar tokens expirados y inválidos

### 3.6 Middleware de Autorización
**Funcionalidad:**
- Verificar roles y permisos específicos
- Proteger rutas según nivel de acceso
- Soporte para múltiples roles por usuario

## 4. Especificaciones Técnicas

### 4.1 Stack Tecnológico
- **Backend:** Node.js + Express.js (existente)
- **Base de datos:** SQLite (desarrollo), PostgreSQL (producción)
- **Autenticación:** jsonwebtoken, bcryptjs
- **Validación:** joi
- **Rate Limiting:** express-rate-limit
- **Testing:** Jest + Supertest (existente)
- **Logging:** winston (nuevo)

### 4.2 Estructura de Base de Datos

```sql
-- Tabla de usuarios
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(50) DEFAULT 'user',
  email_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME
);

-- Tabla de refresh tokens
CREATE TABLE refresh_tokens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  token_hash VARCHAR(255) NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  revoked_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla de logs de seguridad
CREATE TABLE security_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  action VARCHAR(100) NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  success BOOLEAN NOT NULL,
  details TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
```

### 4.3 Configuración JWT

```javascript
const JWT_CONFIG = {
  accessToken: {
    secret: process.env.JWT_ACCESS_SECRET,
    expiresIn: '1h',
    algorithm: 'HS256'
  },
  refreshToken: {
    secret: process.env.JWT_REFRESH_SECRET,
    expiresIn: '7d',
    algorithm: 'HS256'
  }
};
```

### 4.4 Estructura de Directorios

```
src/
├── auth/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── authenticate.js
│   │   ├── authorize.js
│   │   └── rateLimiter.js
│   ├── models/
│   │   ├── User.js
│   │   ├── RefreshToken.js
│   │   └── SecurityLog.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── userRoutes.js
│   ├── services/
│   │   ├── authService.js
│   │   ├── tokenService.js
│   │   └── securityService.js
│   └── validators/
│       ├── authValidators.js
│       └── userValidators.js
├── database/
│   ├── connection.js
│   ├── migrations/
│   └── seeds/
└── utils/
    ├── logger.js
    └── errors.js
```

## 5. Casos de Uso

### 5.1 Usuario se Registra
1. Usuario envía datos de registro
2. Sistema valida formato de email y fortaleza de password
3. Sistema verifica que email no existe
4. Sistema hashea password y crea usuario
5. Sistema genera tokens JWT
6. Sistema retorna tokens y datos de usuario

### 5.2 Usuario Inicia Sesión
1. Usuario envía credenciales
2. Sistema valida credenciales
3. Sistema genera nuevos tokens
4. Sistema actualiza último login
5. Sistema registra evento en logs de seguridad
6. Sistema retorna tokens

### 5.3 Acceso a Ruta Protegida
1. Cliente envía request con token en header
2. Middleware extrae y valida token
3. Middleware verifica permisos si es necesario
4. Request continúa a controlador o se rechaza

## 6. Seguridad

### 6.1 Medidas de Seguridad
- **Hashing de Passwords:** bcrypt con salt rounds 12
- **Tokens Seguros:** Secrets robustos, rotación periódica
- **Rate Limiting:** Protección contra ataques de fuerza bruta
- **Validación de Entrada:** Sanitización y validación estricta
- **Logging de Seguridad:** Registro de todos los eventos de auth
- **Headers de Seguridad:** Helmet.js ya implementado

### 6.2 Gestión de Tokens
- **Access Tokens:** Corta duración (1 hora)
- **Refresh Tokens:** Larga duración (7 días), almacenados en DB
- **Rotación:** Refresh tokens rotan en cada uso
- **Revocación:** Capacidad de invalidar tokens

## 7. Testing

### 7.1 Estrategia de Testing
- **Unit Tests:** Servicios, middleware, validadores
- **Integration Tests:** Endpoints completos
- **Security Tests:** Validación de vulnerabilidades
- **Performance Tests:** Carga de validación de tokens

### 7.2 Cobertura Objetivo
- **Mínimo:** 90% cobertura de código
- **Crítico:** 100% cobertura en funciones de seguridad

## 8. Deployment y Configuración

### 8.1 Variables de Entorno
```bash
# JWT Configuration
JWT_ACCESS_SECRET=your-super-secret-access-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key

# Database
DATABASE_URL=sqlite:./dev.db
DATABASE_URL_PROD=postgresql://user:pass@host:port/db

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=3600000
RATE_LIMIT_MAX_REQUESTS=100
```

### 8.2 Consideraciones de Producción
- **Secrets Management:** Usar servicios como AWS Secrets Manager
- **Database:** Migrar a PostgreSQL para producción
- **Monitoring:** Implementar alertas para eventos de seguridad
- **Backup:** Estrategia de respaldo para datos de usuarios

## 9. Roadmap de Implementación

### Sprint 1 (2 semanas)
- [ ] Setup de base de datos y modelos
- [ ] Implementación de registro y login básico
- [ ] Middleware de autenticación
- [ ] Tests unitarios básicos

### Sprint 2 (2 semanas)
- [ ] Refresh tokens y logout
- [ ] Middleware de autorización
- [ ] Rate limiting y seguridad
- [ ] Tests de integración

### Sprint 3 (2 semanas) - Opcional
- [ ] Logging de seguridad avanzado
- [ ] Optimizaciones de performance
- [ ] Documentación completa
- [ ] Tests de seguridad y carga

## 10. Riesgos y Mitigaciones

### 10.1 Riesgos Técnicos
- **Vulnerabilidades de Seguridad:** Auditorías regulares, testing exhaustivo
- **Performance:** Caching de validación, optimización de queries
- **Escalabilidad:** Diseño stateless, preparación para microservicios

### 10.2 Riesgos de Negocio
- **Tiempo de Desarrollo:** Priorización clara, MVP bien definido
- **Compatibilidad:** Testing exhaustivo con API existente
- **Adopción:** Documentación clara, ejemplos de uso

---

**Documento generado:** 2024-01-15  
**Versión:** 1.0  
**Próxima revisión:** Sprint Review 1
