import { Book } from "../domain";
import { getRepository } from "../repositories/getRepository";

export function getBookService(repository: ReturnType<typeof getRepository>) {
  const { getBookRepository } = repository;

  async function getBook(id: string) {
    return getBookRepository().getBook(id);
  }

  async function createBook(book: Book) {
    return getBookRepository().createBook(book);
  }

  async function getAllBooks() {
    return getBookRepository().getAllBooks();
  }

  async function updateBook(id: string, book: Book) {
    return getBookRepository().updateBook(id, book);
  }

  async function deleteBook(id: string) {
    return getBookRepository().deleteBook(id);
  }

  return { getBook, createBook, getAllBooks, updateBook, deleteBook };
}
