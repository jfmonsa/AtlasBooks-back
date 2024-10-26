/**
 * @file Handles de config of a Dependency Injection Container to automatically
 * load all services, controllers and repositories  across the whole app
 *
 */
import { createContainer, asClass, asFunction } from "awilix";

// import dependencies
// + repositories
import UserRepository from "../repositories/user.repository.js";
import BookListRepository from "../repositories/bookList.repository.js";
// + services
import AuthService from "../api/auth/auth.v1.service.js";
// + controllers
import AuthController from "../api/auth/auth.v1.controller.js";
// + other dependencies
import { createAccessToken, verifyToken } from "../helpers/handleJWT.js";

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
    // other dependencies
    createAccessToken: asFunction(() => createAccessToken),
    verifyToken: asFunction(() => verifyToken),
  });

  console.log(
    "Registered dependencies in global DI container:",
    Object.keys(container.registrations),
    "\n + Learn more in /docs/architecture.md \n"
  );
}

export default container;
