# Architecture

This project implements a 3-layered architecture (3-tier architecture), where each layer has a specific responsibility. It is also influenced by Clean Architecture due to its unidirectional dependency flow (Dependency Rule).

Clear separation of concerns:

- Presentation (Routes/Controllers)
- Business Logic (Services)
- Data Access (Repositories)

Dependencias unidireccionales:

Unidirectional dependencies:

- Controllers depend on Services
- Services depend on Repositories
- Each layer only knows the one directly below it

## Table of Contents

  * [Table of Contents](#table-of-contents)
  * [Estructura de Archivos](#estructura-de-archivos)
  * [Architecture Layers](#architecture-layers)
    + [Http Layer](#http-layer)
    + [Business Logic Layer](#business-logic-layer)
    + [Data Acess Layer](#data-acess-layer)
    + [Other Files: Which Layer Do They Belong To?](#other-files-which-layer-do-they-belong-to)
  * [Flujo de datos](#flujo-de-datos)
  * [About Dependency Injection](#about-dependency-injection)
    + [DI Container](#di-container)
  * [Real Example of How to Implement a Functionality Using This Architecture](#real-example-of-how-to-implement-a-functionality-using-this-architecture)
    + [1. Capa HTTP](#1-capa-http)
    + [2. Write the Service](#2-write-the-service)
    + [3. 3. Repositories](#3-3-repositories)
    + [4. Register the Dependencies in the Container](#4-register-the-dependencies-in-the-container)
  * [Summary: Main Principles and Design Patterns Used](#summary-main-principles-and-design-patterns-used)
  * [Conventions](#conventions)
  * [Recursos](#recursos)

<!-- TOC end -->

## Estructura de Archivos

```
src/
├── api/                   # HTTP Presentation Layer
│   ├── auth/               # Authentication Module
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── routes/          # Route definitions
│   │   ├── controllers/     # HTTP Controllers
│   │   └── services/        # Business logic
├── config/                # Configuration files
├── helpers/               # Utilities
├── middlewares/           # Express Middlewares
└── repositories/          # Data Access Layer
storage/                   # Static files
db/                        # Database scripts and diagrams
docs/                      # Internal project documentation
```

## Architecture Layers

### Http Layer

- **Location**: `api/{module}/{module}.{version}.routes.js`, `api/{module}/{module}.{version}.controller.js`, `api/{module}/dto/{name}.{version}.dto.js`
- **Responsibility**: Handles HTTP requests and responses
- **Components**:
  - Routes: Defines endpoints, Swagger documentation, and middleware pipeline
  - Controllers: Translates HTTP requests into use cases
  - DTOs: Validates and transforms input data

> [!IMPORTANT]
> any object property that its name contains `Id` or starts with `id` will be encoded if is a request object or decode if is a response object by a middleware. for this we are using [sqids](https://sqids.org/)

### Business Logic Layer

- **Location**: `api/{module}/{module}.{version}.service.js`
- **Responsability**: Implements business logic
- **Characteristics**:
  - Independent from frameworks
  - Orchestrates operations
  - Manages transactions
  - Handles business validations

### Data Acess Layer

- **Location**: `repositories/{tableName}.repository.js`
- **Responsibility**: Interacts with the database; each repository defines methods that implement database queries.
- **Características**:
  - Implements the Repository Pattern
  - Typically one repository per database table (not a strict rule)
  - Handles database-level transactions
  - Promotes query reuse, especially via the BaseRepository superclass, which abstracts common CRUD operations to avoid repetitive SQL statements

### Other Files: Which Layer Do They Belong To?

Other project files could be grouped into an "Infrastructure" layer:

- `config/`
- `middlewares/`
- `helpers/`
- `api/router.js`
- `app.js`

## Flujo de datos

1. HTTP requests enter through the routes
2. They pass through the middleware pipeline (validation, authentication, etc.)
3. They reach the corresponding controller
4. The controller delegates the task to the service
5. The service implements the business logic using repositories
6. The response follows the reverse path

[![Diagrama del flujo de datos, hecho con mermaid :'D](https://mermaid.ink/img/pako:eNplkUFzgjAQhf9KZk92igiIgDl40UMvHZ1qe-hwycBWM0JCk2BrHf57A6LWaU7Z5Htv3-yeIJM5AgWNnzWKDBecbRUrU0HsmRcchRnOZo8vsjaoKVkt1xsyYhUfHfyRwi3XBtUZPiMt_MzzvMAvppCSN1bwnCmy2CzP2O2zRedSGCWLAhUlC2akJodOkEvdR7gCLb5GdeCZtb20HtQalRWyhzPeA11krKTmRqojJUYxoVlmuBQD13V7-EYMrWB4NX_VNVNckkyhDXJv3IJ_Q5_aAA4xco-i-Re5pS-je9psVralrqTQeDeyzrMbNSWB55O57WswBwdKVCXjud3PqVWkYHZYYgrUXu1U9ymkorEcq41cH0UG1KgaHVCy3u6AfrBC26qucuvXb_b6WjHxLmV5kdgS6Am-gQ6nbhTHwSSaJKEfxWHiwBGo70_csZd44yjxQn86DYLGgZ_OwHe9OEnicBxMwnjseVHc_AJCecIH?type=png)](https://mermaid.live/edit#pako:eNplkUFzgjAQhf9KZk92igiIgDl40UMvHZ1qe-hwycBWM0JCk2BrHf57A6LWaU7Z5Htv3-yeIJM5AgWNnzWKDBecbRUrU0HsmRcchRnOZo8vsjaoKVkt1xsyYhUfHfyRwi3XBtUZPiMt_MzzvMAvppCSN1bwnCmy2CzP2O2zRedSGCWLAhUlC2akJodOkEvdR7gCLb5GdeCZtb20HtQalRWyhzPeA11krKTmRqojJUYxoVlmuBQD13V7-EYMrWB4NX_VNVNckkyhDXJv3IJ_Q5_aAA4xco-i-Re5pS-je9psVralrqTQeDeyzrMbNSWB55O57WswBwdKVCXjud3PqVWkYHZYYgrUXu1U9ymkorEcq41cH0UG1KgaHVCy3u6AfrBC26qucuvXb_b6WjHxLmV5kdgS6Am-gQ6nbhTHwSSaJKEfxWHiwBGo70_csZd44yjxQn86DYLGgZ_OwHe9OEnicBxMwnjseVHc_AJCecIH)

## About Dependency Injection

To implement services, controllers, and repositories, we use the Dependency Injection (DI) pattern because:

- It makes unit testing easier, cleaner, and more maintainable. We can mock the dependency we need and inject it into the test.
- Low coupling between components.
- Easy to change implementations.
- More modular development.
- Code reuse.

### DI Container

- Centralized instance management.
- Automatic dependency resolution.
- Lifecycle management.
- Located in the file `config/di-container.js`

> [!NOTE]
> o delve deeper into these concepts, go to the Resources section. [Resources](architecture.md#Resources)

## Real Example of How to Implement a Functionality Using This Architecture

### 1. Capa HTTP

1. Create the DTO that validates the request data, in this case:

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

2. Create a new component (service, controller, or repository)

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
> Note that we use # in the name of the dependencies. This is important because it allows us to implement private properties in JavaScript classes

> [!WARNING]
> It is important to use `this.<method> = this.<method>.bind(this)` for each method defined in the controllers. If this is not done, it will fail because JavaScript will take `this` not as a reference to the class itself but to the express app, as express calls the controller directly.

> [!IMPORTANT]
> Note that we do not use `res.json(<object>)` to send the response from the controller but `res.formatResponse(<object>, <HTTP_CODE>)`. We should always use this as it automatically formats the response, ensuring consistency across the API.

> [!IMPORTANT]
> Note that we do not write the HTTP response code directly but import it from `helpers/httpCodes`.js and pass it to `formatResponse()` as HTTP_CODES.CREATED (use the appropriate code). If no code is passed to the `formatResponse()` method, it will automatically send a `200`.

3. Call the controller methos in `.routes` file of each module, the middlewares to use (do not forget to write the jsdoc / swagger comment with the endpoint documentation at the top definition of each `route`)

```js
import { Router } from "express";
import container from "../../config/di-container.js";
import errorHandler from "../../middlewares/errorHandler.js";
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
  errorHandler(authController.register)
);
```

### 2. Write the Service

+ Contains the business logic.
+ Here we call database operations defined in the repository.
+ Here we throw `throw new <AppError, ValidationError, NotFoundError>` errors defined in `helpers/exceptions.js`
+ Return the data to the controller.
+ It is no longer necessary to bind `this` to the methods of the service (or the repository).

```js
export default class AuthService {
  #userRepository;
  #bookListsRepository;

  constructor({ userRepository, bookListsRepository }) {
    this.#userRepository = userRepository;
    this.#bookListsRepository = bookListsRepository;
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
      await this.#bookListsRepository.createDefaultList(newUser.id, client);
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

### 3. 3. Repositories

> [!NOTA]
> Check in `repositories/` if the table or tables you want to interact with already have `respositories/{nombreTabla}.repository.js` classes. If they do not exist, create them. Otherwise, work on an existing one by defining methods that interact with the database.

### 4. Register the Dependencies in the Container

Every class that uses the DI mechanism, such as controllers, services, and repositories, must be registered in the DI container.

In `config/di-container.js`

```js
// import dependencies
// + repositories
import UserRepository from "../repositories/user.repository.js";
import bookListsRepository from "../repositories/bookList.repository.js";
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
    bookListsRepository: asClass(bookListsRepository),
  });
}
```

## Summary: Main Principles and Design Patterns Used

+ SOLID Principles:
  + Single Responsibility Principle in each class (_The most important_)
  + Dependency Inversion through the DI container.
  + Interface Segregation through specific repositories.

---

+ Dependency Injection (DI)
+ Repository Pattern
+ DTO (Data Transfer Object) Pattern for request validations


## Conventions
+ File names in kebab-case.
+ Classes in PascalCase.
+ Methods and variables in camelCase.
+ Use of ES6 modules.

## Recursos

**Dependency Inyection**

- https://youtu.be/TxxdqfhMUnI?si=C2BMCwrWNplNByqW - Highly recommended, used as a basis for implementing DI in this project, 1st video in a series of 4 videos of about 10 minutes each Dependency Injection in Node with awilix
