import { Book } from "../domain";
import { getRepository } from "../repositories/getRepository";

export function getBookService(repository: ReturnType<typeof getRepository>) {
  async function getBook(id: string) {
    return repository.getBookRepository().getBook(id);
  }

  async function createBook(book: Book) {
    return repository.getBookRepository().createBook(book);
  }

  async function getAllBooks() {
    return repository.getBookRepository().getAllBooks();
  }

  async function updateBook(id: string, book: Book) {
    return repository.getBookRepository().updateBook(id, book);
  }

  async function deleteBook(id: string) {
    return repository.getBookRepository().deleteBook(id);
  }

  return { getBook, createBook, getAllBooks, updateBook, deleteBook };
}
