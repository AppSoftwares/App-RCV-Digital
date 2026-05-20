# Guía de Arquitectura Escalable - RCV Digital

Este proyecto ha sido reorganizado siguiendo patrones de arquitectura limpia y seguridad de grado empresarial.

## 🏗️ Estructura de Capas (Clean Architecture)

- `src/core/`: **Capa de Dominio**. Contiene las entidades (`entities/`), interfaces de repositorios y lógica de negocio pura (`services/`). No depende de ninguna librería externa (Vite, React, etc).
- `src/data/`: **Capa de Datos**. Implementaciones concretas de acceso a datos. Aquí es donde se conectan `Supabase` o `Spacetimedb`.
- `src/infrastructure/`: **Capa de Infraestructura**. Lógica transversal como el `CircuitBreaker`, clientes de red, configuraciones de caché y rate limiting.
- `src/presentation/`: **Capa de UI**. Componentes de React y hooks que consumen los servicios del `core`.
- `src/shared/`: **Utilidades Compartidas**. Validadores de seguridad, sanitizadores de texto y constantes.

## 🔒 Seguridad Implementada

1. **Protección SQL Injection**: 
   - Se utiliza `sanitizeInput` en `src/shared/security.ts`.
   - Se emplean consultas parametrizadas a través del SDK de Supabase (y próximamente Spacetimedb).
2. **Circuit Breaker**: 
   - Las llamadas a la API están envueltas en `apiBreaker` para evitar que la app se cuelgue si el servidor falla o está bajo ataque.
3. **Validación Fiscal**: 
   - Inputs obligatorios de RIF/Cédula y Email validados antes de procesar cualquier transacción.

## 🚀 Próximos Pasos para Escalabilidad Total

### 1. Spacetimedb 2.0 (Backend Rust)
Para migrar a Spacetimedb:
- Crea un nuevo repositorio en `src/data/repositories/SpacetimeUserRepository.ts`.
- Implementa los "Reducers" en Rust en el servidor de Spacetimedb para manejar la lógica de facturación en tiempo real.

### 2. Colas y Procesos Pesados
- **Worker Externo**: Utiliza un servicio de colas (ej. BullMQ o RabbitMQ) para procesar la generación de PDFs fiscales y el envío de correos sin bloquear la UI del usuario.

### 3. DDoS y CDN
- Configura **Cloudflare** delante de tu dominio para manejar el tráfico basura y aplicar Rate Limiting a nivel de borde (Edge).
- Asegúrate de habilitar **CORS** en el dashboard de Supabase/Spacetimedb permitiendo únicamente el dominio de producción de tu app.

---
*Mantenida por el Asistente de IA para app-rcv-digital*
