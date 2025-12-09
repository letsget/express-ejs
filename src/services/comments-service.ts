import { Server, Socket } from "socket.io";

const commentsByBook = new Map<string, TComment[]>();

type TComment = {
  bookId: string;
  id: number;
  socketId: string;
  text: string;
  timestamp: string;
  username?: string;
};

export class CommentService {
  private io: Server | null = null;

  // Инициализация Socket.io
  initialize(io: Server): void {
    this.io = io;
    this.setupSocketHandlers();
  }

  private setupSocketHandlers(): void {
    if (!this.io) return;

    this.io.on("connection", (socket: Socket) => {
      const { bookId } = socket.handshake.query as { bookId: string };

      socket.join(`book-${bookId}`);

      if (!commentsByBook.has(bookId)) {
        commentsByBook.set(bookId, []);
      }

      const comments: TComment[] = commentsByBook.get(bookId)!;
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
    });
  }

  private handleNewComment(
    socket: Socket,
    bookId: string,
    data: { username: string; text: string },
  ): void {
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

    comments.unshift(comment);

    // socket.broadcast.to() - отправляет всем КРОМЕ отправителя
    socket.broadcast.to(`book-${bookId}`).emit("new-comment", comment);

    // Отправителю отправляем отдельно (чтобы он тоже видел)
    socket.emit("new-comment", comment);
  }

  getComments(bookId: string): TComment[] {
    return commentsByBook.get(bookId) || [];
  }
}
export const commentService = new CommentService();
