import { library } from "./library";
import { NextFunction, Request, Response } from "express";

export const errorPageMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const {
    params: { id },
  } = request;
  const foundBook = library.find((book) => book.id == id);

  if (!foundBook) {
    return response.render("errors/404", {
      title: "Страницы с такой книгой не существует",
    });
  }
  response.locals.foundBook = foundBook;
  next();
};

export const handleAddNewBookMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { body } = request;
  const {
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName,
    fileBook,
  } = body;
  response.locals.newBook = {
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName,
    fileBook,
  };
  next();
};

export const resolveBookByIndex = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const {
    params: { id },
  } = request;

  const bookIndex = library.findIndex((book) => book.id === id);

  if (bookIndex === -1) {
    return response
      .status(404)
      .json({ error: `Книга с id ${id} не найдена в библиотеке` });
  }

  response.locals.bookIndex = bookIndex;
  next();
};
