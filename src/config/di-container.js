/**
 * @file Handles de config of a Dependency Injection Container to automatically
 * load all services, controllers and repositories  across the whole app
 *
 */
import { createContainer, asClass, asFunction } from "awilix";

// import dependencies
// + repositories
import UserRepository from "../repositories/user.repository.js";
import BookListsRepository from "../repositories/bookLists.repository.js";
import BookRepository from "../repositories/book.repository.js";
import BookRateRepository from "../repositories/bookRate.repository.js";
import BookCommentsRepository from "../repositories/bookComments.repository.js";
import BookCategoriesRepository from "../repositories/bookCategories.repository.js";
import BookFilesRepository from "../repositories/bookFiles.repository.js";
import BookAuthorsRepository from "../repositories/bookAuthors.repository.js";
import BookLanguagesRepository from "../repositories/bookLanguages.repository.js";
import FeedRecommendedRepository from "../repositories/feedRecommended.repository.js";
import SearchFiltersRepository from "../repositories/searchFilters.repository.js";
import BookReportsRepository from "../repositories/bookReports.repository.js";
// + services
import AuthService from "../api/auth/auth.v1.service.js";
import BookService from "../api/book/book.v1.service.js";
import BookCommentsService from "../api/book-comments/book-comments.v1.service.js";
import FeedRecommenedService from "../api/feed-recommended/feed-recommended.v1.service.js";
import BookCategoriesService from "../api/book-categories/book-categories.v1.service.js";
import UserService from "../api/user/user.v1.service.js";
import BookListsService from "../api/book-lists/book-lists.v1.service.js";
import SearchFiltersService from "../api/search-filters/search-filters.service.js";
import ReportsService from "../api/reports/reports.v1.service.js";
// + controllers
import AuthController from "../api/auth/auth.v1.controller.js";
import BookController from "../api/book/book.v1.controller.js";
import BookCommentsController from "../api/book-comments/book-comments.v1.controller.js";
import FeedRecommendedController from "../api/feed-recommended/feed-recommended.v1.controller.js";
import BookCategoriesController from "../api/book-categories/book-categories.v1.controller.js";
import UserController from "../api/user/user.v1.controller.js";
import BookListsController from "../api/book-lists/book-lists.v1.controller.js";
import SearchFiltersController from "../api/search-filters/search-filters.controller.js";
import ReportsController from "../api/reports/reports.v1.controller.js";
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
    feedRecommendedController: asClass(FeedRecommendedController),
    bookCategoriesController: asClass(BookCategoriesController),
    userController: asClass(UserController),
    bookListsController: asClass(BookListsController),
    searchFiltersController: asClass(SearchFiltersController),
    reportsController: asClass(ReportsController),
    // services
    authService: asClass(AuthService),
    bookService: asClass(BookService),
    bookCommentsService: asClass(BookCommentsService),
    feedRecommendedService: asClass(FeedRecommenedService),
    bookCategoriesService: asClass(BookCategoriesService),
    userService: asClass(UserService),
    bookListsService: asClass(BookListsService),
    searchFiltersService: asClass(SearchFiltersService),
    reportsService: asClass(ReportsService),
    // repositories
    userRepository: asClass(UserRepository),
    bookListsRepository: asClass(BookListsRepository),
    bookRepository: asClass(BookRepository),
    bookRateRepository: asClass(BookRateRepository),
    bookCommentsRepository: asClass(BookCommentsRepository),
    bookCategoriesRepository: asClass(BookCategoriesRepository),
    bookFilesRepository: asClass(BookFilesRepository),
    bookAuthorsRepository: asClass(BookAuthorsRepository),
    bookLanguagesRepository: asClass(BookLanguagesRepository),
    feedRecommendedRepository: asClass(FeedRecommendedRepository),
    searchFiltersRepository: asClass(SearchFiltersRepository),
    bookReportsRepository: asClass(BookReportsRepository),
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
