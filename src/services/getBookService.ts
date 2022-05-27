import { Book } from "../domain";
import { BadRequestError } from "../exceptions/BadRequestError";
import { ConflictError } from "../exceptions/ConflictError";
import { NotFoundError } from "../exceptions/NotFoundError";
import { getRepository } from "../repositories/getRepository";
import { getAuthorService } from "./getAuthorService";
import { getBookShelfService } from "./getBookShelfService";

export function getBookService(repository: ReturnType<typeof getRepository>) {
  const bookRepository = repository.getBookRepository();
  async function getBook(id: string) {
    return bookRepository.getBook(id);
  }

  async function createBook(book: Book) {
    try {
      const { authorId, id, bookShelfId } = book;

      await Promise.all([
        getAuthorService(repository).addBookIdToAuthor(authorId, id),
        getBookShelfService(repository).addBookIdToBookShelf(id, bookShelfId),
      ]);

      return bookRepository.createBook(book);
    } catch {
      return new BadRequestError();
    }
  }

  async function getAllBooks() {
    return bookRepository.getAllBooks();
  }

  async function updateBook(id: string, book: Book) {
    const { authorId, bookShelfId } = book;

    try {
      const oldBook = await bookRepository.getBook(id);

      if (oldBook instanceof Error) {
        throw new Error();
      }

      const oldAuthorId = oldBook.authorId;
      const oldBookShelfId = oldBook.bookShelfId;

      await Promise.all([
        getAuthorService(repository).removeBookIdFromAuthor(oldAuthorId, id),
        getAuthorService(repository).addBookIdToAuthor(authorId, id),
        getBookShelfService(repository).removeBookIdFromBookShelf(
          id,
          oldBookShelfId
        ),
        getBookShelfService(repository).addBookIdToBookShelf(id, bookShelfId),
      ]);

      return bookRepository.updateBook(id, book);
    } catch {
      return new ConflictError();
    }
  }

  async function deleteBook(id: string) {
    try {
      const book = await bookRepository.getBook(id);

      if (book instanceof Error) {
        throw new Error();
      }

      const { authorId, bookShelfId } = book;
      await Promise.all([
        getAuthorService(repository).removeBookIdFromAuthor(authorId, id),
        getBookShelfService(repository).removeBookIdFromBookShelf(
          id,
          bookShelfId
        ),
      ]);

      return bookRepository.deleteBook(id);
    } catch {
      return new NotFoundError();
    }
  }

  async function deleteBooks(bookIds: string[]) {
    const deletionResults = await Promise.all(bookIds.map(deleteBook));

    for (const deletionResult of deletionResults) {
      if (deletionResult instanceof NotFoundError) {
        throw deletionResult;
      }
    }
  }

  return {
    getBook,
    createBook,
    getAllBooks,
    updateBook,
    deleteBook,
    deleteBooks,
  };
}
