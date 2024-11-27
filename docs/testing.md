# Tests

<!-- TOC start (generated with https://github.com/derlin/bitdowntoc) -->

- [Tests](#tests)
  - [Los Niveles de Testing](#los-niveles-de-testing)
    - [Unitarios](#unitarios)
    - [Integración](#integración)
    - [e2e](#e2e)
    - [Diferencias Principales](#diferencias-principales)
    - [Recomendaciones](#recomendaciones)
  - [Testing Strategy](#testing-strategy)
    - [1. Services (Prioridad Alta)](#1-services-prioridad-alta)
    - [2. Controllers (Prioridad media)](#2-controllers-prioridad-media)
    - [3. Respositories (Prioridad Baja)](#3-respositories-prioridad-baja)
    - [Herramientas usadas](#herramientas-usadas)

<!-- TOC end -->

## Los Niveles de Testing

<p align="center">
    <img src="https://www.codurance.com/hs-fs/hubfs/Pir%C3%A1mide%20de%20testing.png?width=650&height=422&name=Pir%C3%A1mide%20de%20testing.png" alt="Piramide de tests">
</p>

### Unitarios

- **Objectivo**: Testear piezas pequeñas del app
- **Mock**: Todas las dependencias externas, aprovechar el mecanismo de DI que usamos en la [arquitectura](./architecture.md), si estamos probando un controller -> mock del servicio (dependencia); si estamos probando un servicio -> mock repositories y servicios inyectados. Todo se traduce en hacer mock de cualquier dependencia inyectada.

> always mock your dependcies (db functions, services, helpers, etc)

### Integración

- **Objetivo**: Probar la interacción entre múltiples componentes del sistema
- **Alcance**: Múltiples capas pero sin servicios externos
- **Base de datos**: Usa una base de datos de test real
- **Mock**: Solo servicios externos (email, S3, etc.)

### e2e

- **Objetivo**: Probar el sistema completo en un entorno real
- **Alcance**: Todo el sistema incluyendo servicios externos
- **Base de datos**: Usa una base de datos de staging
- **Mock**: Nada, usa servicios reales

### Diferencias Principales

1. Alcance:

   - Unitarios: Una función/método aislado
   - Integración: Múltiples componentes internos
   - E2E: Sistema completo con interfaces reales

2. Velocidad:

   - Unitarios: Muy rápidos
   - Integración: Moderadamente rápidos
   - E2E: Lentos

3. Mantenimiento:

   - Unitarios: Fácil mantenimiento
   - Integración: Mantenimiento moderado
   - E2E: Más difíciles de mantener

4. Confiabilidad:
   - Unitarios: Alta para lógica específica
   - Integración: Alta para flujos internos
   - E2E: Alta para flujos completos de usuario

### Recomendaciones

1. Pirámide de Testing:

   - 70% Tests Unitarios
   - 20% Tests de Integración
   - 10% Tests E2E

2. Priorización:

   - Comenzar con tests unitarios de Services
   - Agregar tests de integración para flujos críticos
   - Implementar E2E para happy paths principales

3. Automatización:
   - Configurar CI/CD para ejecutar todos los niveles
   - Tests unitarios y de integración en cada PR
   - E2E en deploys a staging

## Testing Strategy

¿Que testear en cada capa?

### 1. Services (Prioridad Alta)

- **Tests**: Test Unitarios, Integración y e2e
- Contienen la lógica del negocio principal
- Son los más importantes de testear
- Mayor retorno de inversión en testing
- Mas fáciles de aislar con mocks

### 2. Controllers (Prioridad media)

- **Tests**: Integración y e2e
- Suelen tener muy poca lógica

### 3. Respositories (Prioridad Baja)

- **Tests**: Integración

### Herramientas usadas

- Jest (todos los niveles)
- Supertest (Integración)
- playwright (e2e)
