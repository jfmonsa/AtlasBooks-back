# Architecture

Este proyecto implementa una arquitectura de 3 capas (3-Layered / 3-tier architecture) cada una con una responsabilidad específica. También tiene algunas influencias de la Arquitectura Clean (Por el uso de dependencias unidireacionales / Regla de dependencias)


Separación clara de responsabilidades:
+ Presentación (Routes/Controllers)
+ Lógica de negocio (Services)
+ Acceso a datos (Repositories)


Dependencias unidireccionales:
+ Controllers dependen de Services
+ Services dependen de Repositories
+ Cada capa solo conoce la inmediatamente inferior

## Tabla de Contenidos
<!-- TOC start (generated with https://github.com/derlin/bitdowntoc) -->

  * [Estructura de Archivos](#estructura-de-archivos)
  * [Capas de la Arquictectura](#capas-de-la-arquictectura)
    + [Http Layer](#http-layer)
    + [Business Logic Layer](#business-logic-layer)
    + [Data Acess Layer](#data-acess-layer)
    + [Otros Archivos ¿En que capa los ubicamos?](#otros-archivos-en-que-capa-los-ubicamos)
  * [Flujo de datos](#flujo-de-datos)
  * [Sobre La Inyección de dependencias](#sobre-la-inyección-de-dependencias)
    + [DI Container](#di-container)
  * [Ejemplo real de como implementar una funcionalidad usando esta arquitectura](#ejemplo-real-de-como-implementar-una-funcionalidad-usando-esta-arquitectura)
    + [1. Capa HTTP](#1-capa-http)
    + [2. Escribir el Servicio](#2-escribir-el-servicio)
    + [3. Repositories](#3-repositories)
    + [4. Registar las dependencias en el container](#4-registar-las-dependencias-en-el-container)
  * [Resumen: Principales Principios y Patrones de diseño Usados](#resumen-principales-principios-y-patrones-de-diseño-usados)
  * [Convenciones](#convenciones)
  * [Recursos](#recursos)

<!-- TOC end -->

<!-- TOC --><a name="architecture"></a>

## Estructura de Archivos
```
src/
├── api/                   # Capa de presentación HTTP
│   ├── auth/               # Módulo de autenticación
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── routes/          # Definición de rutas
│   │   ├── controllers/     # Controladores HTTP
│   │   └── services/        # Lógica de negocio
├── config/                # Configuraciones
├── helpers/               # Utilidades
├── middlewares/           # Middlewares de Express
└── repositories/          # Capa de acceso a datos
storage/                  # archivos estaticos
db/                       # scripts y diagramas de la db
docs/                     # documentacion interna del proyecto

```

## Capas de la Arquictectura

### Http Layer

- **Ubicación**: `api/{module}/{module}.{version}.routes.js`, `api/{module}/{module}.{version}.controller.js`, `api/{module}/dto/{name}.{version}.dto.js`
- **Responsabilidad**: Manejo de peticiones HTTP y respuestas
- **Componentes**:
  - Routes: Definición de endpoints, jsdoc para swagger y middleware pipeline
  - Controllers: Traducción de peticiones HTTP a casos de uso
  - DTOs: Validación y transformación de datos de entrada

### Business Logic Layer

- **Ubiación**: `api/{module}/{module}.{version}.service.js`
- **Responsabilidad**: Implementación de la lógica de negocio
- **Características**:
  - Independiente de frameworks
  - Orquestación de operaciones
  - Manejo de transacciones
  - Validaciones de negocio

### Data Acess Layer

- **Ubicación**: `repositories/{tableName}.repository.js`
- **Responsabilidad**: Interactuar con la base de datos, cada respository define metodos que implementan consultas a la bd.
- **Características**:
  - Patrón Repository
  - Generalmente un repository para cada tabla de la bd (Aunque no es regla de oro)
  - Manejo de transacciones a nivel de base de datos
  - Promueve la reutilización de consultas sql especialmente de los metodos de la super-clase `BaseRepository` que abstraen las principales operaciones del CRUD, evitando repetir y repetir sentencias sql en lo posible

### Otros Archivos ¿En que capa los ubicamos?
Los demás archivos del proyecto los podríamos ubicar en una "capa" de infraestructura:
+ `config/`
+ `middlewares/`
+ `helpers/`
+ `api/router.js`
+ `app.js`



## Flujo de datos

1. Las peticiones HTTP entran por los routes
2. Pasan por el pipeline de middlewares (validación, autenticación, etc.)
3. Llegan al controller correspondiente
4. El controller delega al service
5. El service implementa la lógica de negocio usando los repositories
6. La respuesta sigue el camino inverso

[![Diagrama del flujo de datos, hecho con mermaid :'D](https://mermaid.ink/img/pako:eNplkUFzgjAQhf9KZk92igiIgDl40UMvHZ1qe-hwycBWM0JCk2BrHf57A6LWaU7Z5Htv3-yeIJM5AgWNnzWKDBecbRUrU0HsmRcchRnOZo8vsjaoKVkt1xsyYhUfHfyRwi3XBtUZPiMt_MzzvMAvppCSN1bwnCmy2CzP2O2zRedSGCWLAhUlC2akJodOkEvdR7gCLb5GdeCZtb20HtQalRWyhzPeA11krKTmRqojJUYxoVlmuBQD13V7-EYMrWB4NX_VNVNckkyhDXJv3IJ_Q5_aAA4xco-i-Re5pS-je9psVralrqTQeDeyzrMbNSWB55O57WswBwdKVCXjud3PqVWkYHZYYgrUXu1U9ymkorEcq41cH0UG1KgaHVCy3u6AfrBC26qucuvXb_b6WjHxLmV5kdgS6Am-gQ6nbhTHwSSaJKEfxWHiwBGo70_csZd44yjxQn86DYLGgZ_OwHe9OEnicBxMwnjseVHc_AJCecIH?type=png)](https://mermaid.live/edit#pako:eNplkUFzgjAQhf9KZk92igiIgDl40UMvHZ1qe-hwycBWM0JCk2BrHf57A6LWaU7Z5Htv3-yeIJM5AgWNnzWKDBecbRUrU0HsmRcchRnOZo8vsjaoKVkt1xsyYhUfHfyRwi3XBtUZPiMt_MzzvMAvppCSN1bwnCmy2CzP2O2zRedSGCWLAhUlC2akJodOkEvdR7gCLb5GdeCZtb20HtQalRWyhzPeA11krKTmRqojJUYxoVlmuBQD13V7-EYMrWB4NX_VNVNckkyhDXJv3IJ_Q5_aAA4xco-i-Re5pS-je9psVralrqTQeDeyzrMbNSWB55O57WswBwdKVCXjud3PqVWkYHZYYgrUXu1U9ymkorEcq41cH0UG1KgaHVCy3u6AfrBC26qucuvXb_b6WjHxLmV5kdgS6Am-gQ6nbhTHwSSaJKEfxWHiwBGo70_csZd44yjxQn86DYLGgZ_OwHe9OEnicBxMwnjseVHc_AJCecIH)

## Sobre La Inyección de dependencias
Para implementar servicies, constrollers y repositories hacemos uso del patrón de inyección de dependencias (DI). Ya que:

+ Facilidad para hacer tes unitarios, más limpios y mantenibles. hacemos un mock  de la dependencia que necesitamos e inyectarla en el test.
+ Bajo acoplamiento entre compnentes
+ Facil cambio de implmentaciones
+ Desarrollo más modular
+ Reutilizaciónd el Código

### DI Container
+ Gestión centralizada de instancias
+ Resolución automática de dependencias
+ Lifecycle management
+ En el archivo `config/di-container.js`

> [!NOTE]
> Para profundizar en estos conceptos, ir a la sección de [Recursos](architecture.md#Recursos)


## Ejemplo real de como implementar una funcionalidad usando esta arquitectura

### 1. Capa HTTP
1. Crear el dto que valide los datos de la request, en este caso:
```js
import { Joi, passwordField } from "../../../helpers/validations.js";

const registerDTO = {
  name: Joi.string().min(4).max(20).required().trim(),
  email: Joi.string().email().required().trim(),
  password: passwordField,
  nickname: Joi.string().min(4).max(20).required().trim(),
  country: Joi.string().country().required().trim(),
};

export default registerDTO;

```

2. Crear un nuevo componente (service, controller o repository)
```js
export default class AuthController {
  #authService
  #dep2
  //etc ...

  constructor({ authService, dep2, /* etc ... */ }) {
    this.#authService = authService;
    this.#dep2 = dep2;
  }

  // Muy importante Para los metodos de la clase en el controller
  this.register = this.register.bind(this);
  this.login = this.login.bind(this);
  // etc...

  async register(req, res){
    const { newUser, token } = this.#authService(req.body) //pasar datos al servicio

    res
      .cookie("token", token, COOKIE_SETTINGS)
      .formatResponse(
        { user: newUser },
        "User created successfully",
        HTTP_CODES.CREATED
      );
    
  }

  async login(req, res){
    //etc.
  }

  // etc.
}
```

> [!IMPORTANT]
> Notese que usamos `#` en el nombre de las dependencias, esto es importante porque de esta manera implementamos propiedades `private` de las clase en javascript

> [!DANGER]
> Importante el uso de `this.<method> = this.<method>.bind(this)` para cada metodo definido en los controllers, si esto no se hace fallará, ya que javascript tomara `this` no como referencia a la clase misma sino a el app de express, ya que express se encarga de llamar directamente al controller

> [!IMPORTANT]
> Notese que no usamos `res.json(<object>)` para enviar la response del controller sino `res.formatResponse(<object>,<HTTP_CODE>)` deebemos usar este siempre ya que automaticamente formatea la response, esto para que las responses sean consistente en toda el api.

> [!IMPORTANT]
> Notese que no escribimos el código HTTP de respuesta directamente sino que lo importamos de `helpers/httpCodes.js` y lo pasamos a `formatResponse()` como `HTTP_CODES.CREATED` (Usar el codigo que corresponda) esto es una practica aconsejable. sino le pasamos un codigo a el metodo `formatResponse()` automaticamente enviará un `200`

3. llamar el controller en el router, los middlewares a usar (no ovidar escribir el comentario jsdoc con la documentación del endpoint al final)

```js
import { Router } from "express";
import container from "../../config/di-container.js";
import asyncErrorHandler from "../../middlewares/asyncErrorHandler.js";
import { apiVersionMiddleware } from "../../middlewares/apiVersionMiddleware.js";
import validateDTO from "../../middlewares/validateDTO.js";
import registerDTO from "./dto/register.v1.dto.js";

const router = Router({ mergeParams: true });
const authController = container.resolve("authController");

/* @swagger ... (comentario jsdoc documentando el endpoint) */
router.post(
  "/register",
  apiVersionMiddleware(1),
  validateDTO(registerDTO),
  asyncErrorHandler(authController.register)
);
```

### 2. Escribir el Servicio
+ Contiene la lógica del negocio
+ Aqui llamamos operaciones de la bd definidas en el respository
+ Aquí lanzamos `throw new <AppError, ValidationError, NotFoundError>` errores definidos en `helpers/exceptions.js`
+ retornar los datos al controller
+ Ya no es necesario hacer `.bind(this)` a los metodos del servicio (ni del repository)

```js
export default class AuthService {
  #userRepository;
  #bookListRepository;

  constructor({ userRepository, bookListRepository }) {
    this.#userRepository = userRepository;
    this.#bookListRepository = bookListRepository;
  }

  async register({ name, email, password, nickname, country }) {
    // check if user already exists
    if (
      (await this.#userRepository.getUserByEmail(email)) ||
      (await this.#userRepository.getUserByNickname(nickname))
    ) {
      throw new AppError("User already exists", 400);
    }

    const passwordHash = await bycript.hash(password, 10);
    let newUser;

    // insert data with transaction (safety for multiple insertions)
    await this.#userRepository.transaction(async client => {
      newUser = await this.#userRepository.createUser(
        {
          name,
          email,
          password: passwordHash,
          nickname,
          country,
        },
        client
      );
      await this.#bookListRepository.createDefaultList(newUser.id, client);
    });

    // 3 - return new user
    const token = createAccessToken(newUser);
    return {
      newUser,
      token,
    };
  }

  // Otros metodos del servicio etc..
}

```
### 3. Repositories

> [!NOTA]
> Revisar en `repositories/` si con la tabla o tablas con las que se quiere interactuar ya existen las clases `respositories/{nombreTabla}.repository.js` en caso de no existir crearla. De lo contrario, trabajar sobre una ya creada definiendo metodos que interactuen con la bd

### 4. Registar las dependencias en el container
Toda clase que use el mecanismo de DI como: controllers, services y repositories deben ser registradas en el cotainer de DI

En `config/di-container.js`

```js

// import dependencies
// + repositories
import UserRepository from "../repositories/user.repository.js";
import BookListRepository from "../repositories/bookList.repository.js";
// + services
import AuthService from "../api/auth/auth.v1.service.js";
// + controllers
import AuthController from "../api/auth/auth.v1.controller.js";

const container = createContainer({
  strict: true,
});

export function setupDIContainer() {
  container.register({
    // controllers
    authController: asClass(AuthController),
    // services
    authService: asClass(AuthService),
    // repositories
    userRepository: asClass(UserRepository),
    bookListRepository: asClass(BookListRepository),
  });
}
```


## Resumen: Principales Principios y Patrones de diseño Usados
+ Principios SOLID:
  + Single Responsibility Principle en cada clase (***De hecho el más importante***)
  + Dependency Inversion mediante el contenedor DI
  + Interface Segregation mediante repositories específicos
---
+ Dependency Injection (DI)
+ Repository Pattern
+ DTO (Data Trasnfer Object) Pattern para las validaciones de las requests

## Convenciones
+ Nombres de archivos en kebab-case
+ Clases en PascalCase
+ Métodos y variables en camelCase
+ Uso de módulos ES6

## Recursos
**Dependency Inyection**
+ https://youtu.be/TxxdqfhMUnI?si=C2BMCwrWNplNByqW - (*Super Recomendado, tomado como base para implementar la DI en este proyecto, 1er video de una seríe de 4 videos de +-10min*) Dependency Injection in Node with awilix


