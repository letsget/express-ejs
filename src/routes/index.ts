import { Router } from "express";
import { library } from "../library";

const indexRouter = Router();

indexRouter.get('/', (req, res) => {
    res.render('index', {
        title: 'Библиотека',
        books: library,
    })
});

export default indexRouter;

