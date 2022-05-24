import { Book } from "../domain";
import { ConflictError } from "../exceptions/ConflictError";
import { NotFoundError } from "../exceptions/NotFoundError";
import { getRepository } from "../repositories/getRepository";
import { executeIfNoErrorOccured } from "./helpers";

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
      return new ConflictError();
    }

    return bookRepository.createBook(book);
  }

  async function getAllBooks() {
    return bookRepository.getAllBooks();
  }

  function removeBookIdFromAuthor(authorId: string, bookId: string) {
    repository
      .getAuthorRepository()
      .removeBookIdFromAuthor(authorId, bookId)
      .then((result) => (result ? result : new Error()))
      .then((result) =>
        executeIfNoErrorOccured<boolean, boolean>(result, (data) => data)
      );
  }

  function addBookIdToAuthor(authorId: string, bookId: string) {
    repository
      .getAuthorRepository()
      .addBookIdToAuthor(authorId, bookId)
      .then((result) => (result ? result : new Error()))
      .then((result) =>
        executeIfNoErrorOccured<boolean, boolean>(result, (data) => data)
      );
  }

  async function updateBook(id: string, book: Book) {
    // move references to new bookShelf if necessary
    const { authorId } = book;
    return bookRepository
      .getBook(id)
      .then((result) =>
        executeIfNoErrorOccured<Book, string>(result, (data) => data.authorId)
      )
      .then((oldAuthorId) => removeBookIdFromAuthor(oldAuthorId, id))
      .then(() => addBookIdToAuthor(authorId, id))
      .then(() => bookRepository.updateBook(id, book))
      .catch(() => new ConflictError());
  }

  async function deleteBook(id: string) {
    //delete reference from bookshelf
    return bookRepository
      .getBook(id)
      .then((result) =>
        executeIfNoErrorOccured<Book, string>(result, (data) => data.authorId)
      )
      .then((authorId) => removeBookIdFromAuthor(authorId, id))
      .then(() => bookRepository.deleteBook(id))
      .catch(() => new NotFoundError());
  }

  return { getBook, createBook, getAllBooks, updateBook, deleteBook };
}
