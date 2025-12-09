import express from "express";
import booksRouter from "./routes/routes";
import { BOOK_VIEW, ROUTER_PATHS } from "./constants";
import { createServer } from "http";
import { Server } from "socket.io";
import { commentService } from "./services/comments-service";

import indexRouter from "./routes";
import path from "path";
const PORT = 8000;
const app = express();

const server = createServer(app);
// Правильная настройка Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:8000", // или "*" для разработки
    methods: ["GET", "POST"],
  },
});

// Инициализируем сервис комментариев
commentService.initialize(io);

const projectRoot = process.cwd();
console.log("projectRoot", projectRoot);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(ROUTER_PATHS.MAIN, indexRouter);
app.use(BOOK_VIEW.BOOKS, booksRouter);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname)));

console.log(`Server is running on port ${PORT}`);
server.listen(PORT, () => {
  console.log(`✅ Сервер запущен на порту ${PORT}`);
  console.log(
    `📡 Socket.io endpoint: http://localhost:${PORT}/socket.io/socket.io.js`,
  );
  console.log(`🌐 WebSocket endpoint: ws://localhost:${PORT}`);
});
