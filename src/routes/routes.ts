import { Router, Request, Response } from "express";
import { library } from "../library";
const router = Router();
import { ROUTER_PATHS, BOOK_VIEW } from "../constants";
import { v4 as uuid } from "uuid";
import {
  errorPageMiddleware,
  resolveBookByIndex,
  handleAddNewBookMiddleware,
} from "../middleware";

router.get(ROUTER_PATHS.MAIN, (request: Request, response: Response) => {
  response.render(BOOK_VIEW.HOME, {
    title: "Библиотека",
    books: library,
  });
});
router.get(ROUTER_PATHS.CREATE, (request: Request, response: Response) => {
  response.render(BOOK_VIEW.CREATE, {
    title: "Добавить новую книгу",
    book: request.body,
  });
});

router.post(
  ROUTER_PATHS.CREATE,
  handleAddNewBookMiddleware,
  (request: Request, response: Response) => {
    const {
      locals: { newBook },
    } = response;

    const bookToAdd = {
      id: uuid(),
      ...newBook,
    };

    library.push(bookToAdd);
    response.redirect(ROUTER_PATHS.MAIN);
  },
);

router.get(
  `${ROUTER_PATHS.MAIN}:id`,
  [errorPageMiddleware, resolveBookByIndex],
  (request: Request, response: Response) => {
    const {
      locals: { bookIndex },
    } = response;

    response.render(BOOK_VIEW.VIEW, {
      title: library[bookIndex].title,
      book: library[bookIndex],
    });
  },
);

router.get(
  `${ROUTER_PATHS.UPDATE}/:id`,
  [errorPageMiddleware, resolveBookByIndex],
  (request: Request, response: Response) => {
    const {
      locals: { bookIndex },
    } = response;

    response.render(BOOK_VIEW.UPDATE, {
      title: `Редактирование: ${library[bookIndex].title}`,
      book: library[bookIndex],
    });
  },
);

router.post(
  `${ROUTER_PATHS.UPDATE}/:id`,
  resolveBookByIndex,
  handleAddNewBookMiddleware,
  (request: Request, response: Response) => {
    const { id } = request.params;
    const {
      locals: { bookIndex, newBook },
    } = response;
    library[bookIndex] = { id, ...newBook };
    response.redirect(`${BOOK_VIEW.BOOKS}/${id}`);
  },
);

router.post(
  `${ROUTER_PATHS.DELETE}/:id`,
  resolveBookByIndex,
  (request: Request, response: Response) => {
    library.splice(response.locals.bookIndex, 1);

    response.redirect(ROUTER_PATHS.MAIN);
  },
);

export default router;
