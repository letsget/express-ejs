import { Server, Socket } from "socket.io";

// Простое хранилище в памяти
const commentsByBook = new Map<string, any[]>();

// Основной класс сервиса
export class CommentService {
  private io: Server | null = null;

  // Инициализация Socket.io
  initialize(io: Server): void {
    this.io = io;
    this.setupSocketHandlers();
  }

  // Настройка обработчиков Socket.io
  private setupSocketHandlers(): void {
    if (!this.io) return;

    this.io.on("connection", (socket: Socket) => {
      const { bookId } = socket.handshake.query as { bookId: string };
      console.log("booksId", bookId);

      if (!bookId) {
        console.log("Подключение без bookId");
        return;
      }

      console.log(`Новый клиент для книги ${bookId}:`, socket.id);

      // Присоединяем к комнате
      socket.join(`book-${bookId}`);

      // Инициализируем хранилище если нужно
      if (!commentsByBook.has(bookId)) {
        commentsByBook.set(bookId, []);
      }

      const comments = commentsByBook.get(bookId)!;
      console.log("comments", comments);

      // Отправляем текущие комментарии
      socket.emit("load-all-comments", comments);

      // Обработка нового комментария
      socket.on(
        "add-new-comment",
        (data: { username: string; text: string }) => {
          this.handleNewComment(socket, bookId, data);
        },
      );

      // Запрос комментариев
      socket.on("request-comments", () => {
        socket.emit("load-all-comments", comments);
      });

      // Отключение
      socket.on("disconnect", () => {
        console.log(`Клиент отключился: ${socket.id}`);
      });
    });
  }

  private handleNewComment(
    socket: Socket,
    bookId: string,
    data: { username: string; text: string },
  ): void {
    console.log("💬 Новый комментарий для книги", bookId);

    // Получаем комментарии
    if (!commentsByBook.has(bookId)) {
      commentsByBook.set(bookId, []);
    }

    const comments = commentsByBook.get(bookId)!;

    // Создаем комментарий
    const comment = {
      ...data,
      id: Date.now(),
      timestamp: new Date().toISOString(),
      socketId: socket.id,
      bookId: bookId,
    };

    // Сохраняем
    comments.unshift(comment);

    // ★★★ САМЫЙ ПРОСТОЙ ВАРИАНТ ★★★
    // socket.broadcast.to() - отправляет всем КРОМЕ отправителя
    socket.broadcast.to(`book-${bookId}`).emit("new-comment", comment);

    // Отправителю отправляем отдельно (чтобы он тоже видел)
    socket.emit("new-comment", comment);

    console.log(`📢 Комментарий отправлен ВСЕМ в комнате book-${bookId}`);
  }

  getComments(bookId: string): any[] {
    return commentsByBook.get(bookId) || [];
  }
}

// Создаем инстанс сервиса
export const commentService = new CommentService();
