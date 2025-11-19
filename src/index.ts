import express from "express";
import booksRouter from "./routes/routes";
import indexRouter from "./routes";
import path from "path";
const PORT = 8000;
const app = express();

const projectRoot = process.cwd();
console.log('projectRoot', projectRoot);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', indexRouter);
app.use('/books', booksRouter);

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views')); // важно указать полный путь
app.use(express.static(path.join(__dirname)));

console.log(`Server is running on port ${PORT}`);
app.listen(PORT);
