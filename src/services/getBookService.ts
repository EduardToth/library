import { Book } from "../domain";
import { BadRequestError } from "../exceptions/BadRequestError";
import { ConflictError } from "../exceptions/ConflictError";
import { NotFoundError } from "../exceptions/NotFoundError";
import { getRepository } from "../repositories/getRepository";

export function getBookService(repository: ReturnType<typeof getRepository>) {
  const bookRepository = repository.getBookRepository();
  async function getBook(id: string) {
    return bookRepository.getBook(id);
  }

  async function createBook(book: Book) {
    // add reference to bookShelf
    const { authorId, id } = book;
    const success = await repository
      .getAuthorRepository()
      .addBookIdToAuthor(authorId, id);

    if (success === false) {
      return new BadRequestError();
    }

    return bookRepository.createBook(book);
  }

  async function getAllBooks() {
    return bookRepository.getAllBooks();
  }

  async function removeBookIdFromAuthor(authorId: string, bookId: string) {
    try {
      const result = await repository
        .getAuthorRepository()
        .removeBookIdFromAuthor(authorId, bookId);

      if (result === false) {
        throw new Error("Unsuccessful removal");
      }
    } catch {
      throw new Error("Unsuccessful removal");
    }
  }

  async function addBookIdToAuthor(authorId: string, bookId: string) {
    try {
      const result = await repository
        .getAuthorRepository()
        .addBookIdToAuthor(authorId, bookId);

      if (result === false) {
        throw new Error("Unsuccessful insertion");
      }
    } catch {
      throw new Error("Unsuccessful insertion");
    }
  }

  async function updateBook(id: string, book: Book) {
    // move references to new bookShelf if necessary
    const { authorId } = book;

    try {
      const oldBook = await bookRepository.getBook(id);
      if (oldBook instanceof Error) {
        throw new Error();
      }
      const oldAuthorId = oldBook.authorId;

      await removeBookIdFromAuthor(oldAuthorId, id);
      await addBookIdToAuthor(authorId, id);

      return bookRepository.updateBook(id, book);
    } catch {
      return new ConflictError();
    }
  }

  async function deleteBook(id: string) {
    //delete reference from bookshelf
    try {
      const book = await bookRepository.getBook(id);

      if (book instanceof Error) {
        throw new Error();
      }

      const { authorId } = book;
      await removeBookIdFromAuthor(authorId, id);

      return bookRepository.deleteBook(id);
    } catch {
      return new NotFoundError();
    }
  }

  return { getBook, createBook, getAllBooks, updateBook, deleteBook };
}
