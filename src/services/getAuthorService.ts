import { Author } from "../domain";
import { ConflictError } from "../exceptions/ConflictError";
import { NotFoundError } from "../exceptions/NotFoundError";
import { getRepository } from "../repositories/getRepository";

export function getAuthorService(repository: ReturnType<typeof getRepository>) {
  const authorRepository = repository.getAuthorRepository();

  async function getAllAuthors() {
    return authorRepository.getAllAuthors();
  }

  async function getAuthor(id: string) {
    return authorRepository.getAuthor(id);
  }

  async function createAuthor(author: Author) {
    return authorRepository.createAuthor(author);
  }

  async function deleteAuthor(id: string): Promise<NotFoundError | void> {
    const bookRepository = repository.getBookRepository();

    const author = await authorRepository.getAuthor(id);

    if (author instanceof NotFoundError) {
      return author;
    }

    const deletionPromiseResults = author.booksWritten
      .map((book) => book.id)
      .map((id) => bookRepository.deleteBook(id));

    const deletionResults = await Promise.all(deletionPromiseResults);

    const notFoundError = deletionResults.find(
      (deletionResult) => deletionResult instanceof NotFoundError
    );

    if (notFoundError instanceof NotFoundError) {
      return notFoundError;
    }
    const result = await authorRepository.deleteAuthor(id);

    if (result instanceof NotFoundError) {
      return result;
    }
  }

  async function modifyAuthor(id: string, newName: string) {
    const author = await authorRepository.getAuthor(id);
    if (author instanceof Error) {
      return new ConflictError();
    }

    const newAuthor: Author = {
      ...author,
      name: newName,
    };

    return authorRepository.modifyAuthor(id, newAuthor);
  }

  return { getAllAuthors, getAuthor, createAuthor, deleteAuthor, modifyAuthor };
}
