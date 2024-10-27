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
import BookRepository from "../repositories/book.repository.js";
import BookRateRepository from "../repositories/bookRate.repository.js";
import BookCommentsRepository from "../repositories/bookComments.repository.js";
import BookCategoriesRepository from "../repositories/bookCategories.repository.js";
// + services
import AuthService from "../api/auth/auth.v1.service.js";
import BookService from "../api/book/book.v1.service.js";
// + controllers
import AuthController from "../api/auth/auth.v1.controller.js";
import { BookController } from "../api/book/book.v1.controller.js";
// + other dependencies
import { createAccessToken, verifyToken } from "../helpers/handleJWT.js";

const container = createContainer({
  strict: true,
});

export function setupDIContainer() {
  container.register({
    // controllers
    authController: asClass(AuthController),
    bookController: asClass(BookController),
    // services
    authService: asClass(AuthService),
    bookService: asClass(BookService),
    // repositories
    userRepository: asClass(UserRepository),
    bookListRepository: asClass(BookListRepository),
    bookRepository: asClass(BookRepository),
    bookRateRepository: asClass(BookRateRepository),
    bookCommentsRepository: asClass(BookCommentsRepository),
    bookCategoriesRepository: asClass(BookCategoriesRepository),
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
