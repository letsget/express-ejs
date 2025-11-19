import { Router } from "express";
import { library } from "../library";
const router = Router();
import { v4 as uuid } from "uuid";
import {
  errorPageMiddleware,
  resolveBookByIndex,
  handleAddNewBookMiddleware,
} from "../middleware";
router.get("/", (req, res) => {
  res.render("index", {
    title: "Библиотека",
    books: library,
  });
});
router.get("/create", (request, response) => {
  response.render("books/create", {
    title: "Добавить новую книгу",
    book: request.body,
  });
});

router.post("/create", handleAddNewBookMiddleware, (request: any, response) => {
  const newBook = {
    id: uuid(),
    ...request.newBook,
  };

  library.push(newBook);
  response.redirect("/");
});

router.get(
  "/:id",
  [errorPageMiddleware, resolveBookByIndex],
  (request: any, response: any) => {
    response.render("books/view", {
      title: library[request.bookIndex].title,
      book: library[request.bookIndex],
    });
  },
);

router.get(
  "/update/:id",
  [errorPageMiddleware, resolveBookByIndex],
  (request: any, response: any) => {
    response.render("books/update", {
      title: `Редактирование: ${library[request.bookIndex].title}`,
      book: library[request.bookIndex],
    });
  },
);

router.post(
  "/update/:id",
  resolveBookByIndex,
  handleAddNewBookMiddleware,
  (request: any, response: any) => {
    const { id } = request.params;
    library[request.bookIndex] = { id, ...request.newBook };
    console.log("we need it", library[request.bookIndex]);
    response.redirect(`/books/${id}`);
  },
);

router.post("/delete/:id", resolveBookByIndex, (request: any, response) => {
  library.splice(request.bookIndex, 1);

  response.redirect("/");
});

export default router;
