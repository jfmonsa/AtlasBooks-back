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
import BookFilesRepository from "../repositories/bookFiles.repository.js";
import BookAuthorsRepository from "../repositories/bookAuthors.repository.js";
import BookLanguagesRepository from "../repositories/bookLanguages.repository.js";
// + services
import AuthService from "../api/auth/auth.v1.service.js";
import BookService from "../api/book/book.v1.service.js";
import BookCommentsService from "../api/book-comments/book-comments.v1.service.js";
// + controllers
import AuthController from "../api/auth/auth.v1.controller.js";
import BookController from "../api/book/book.v1.controller.js";
import BookCommentsController from "../api/book-comments/book-comments.v1.controller.js";
// + other dependencies
import { createAccessToken, verifyToken } from "../helpers/handleJWT.js";
import authRequired from "../middlewares/authRequired.js";

const container = createContainer({
  strict: true,
});

export function setupDIContainer() {
  container.register({
    // controllers
    authController: asClass(AuthController),
    bookController: asClass(BookController),
    bookCommentsController: asClass(BookCommentsController),
    // services
    authService: asClass(AuthService),
    bookService: asClass(BookService),
    bookCommentsService: asClass(BookCommentsService),
    // repositories
    userRepository: asClass(UserRepository),
    bookListRepository: asClass(BookListRepository),
    bookRepository: asClass(BookRepository),
    bookRateRepository: asClass(BookRateRepository),
    bookCommentsRepository: asClass(BookCommentsRepository),
    bookCategoriesRepository: asClass(BookCategoriesRepository),
    bookFilesRepository: asClass(BookFilesRepository),
    bookAuthorsRepository: asClass(BookAuthorsRepository),
    bookLanguagesRepository: asClass(BookLanguagesRepository),
    // other dependencies
    createAccessToken: asFunction(() => createAccessToken),
    verifyToken: asFunction(() => verifyToken),
    authRequired: asFunction(({ authService }) =>
      authRequired({ authService })
    ),
  });

  console.log(
    "Registered dependencies in global DI container:",
    Object.keys(container.registrations),
    "\n + Learn more in /docs/architecture.md \n"
  );
}

export default container;
