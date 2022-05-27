import { Author } from "../domain";
import { ConflictError } from "../exceptions/ConflictError";
import { NotFoundError } from "../exceptions/NotFoundError";
import { getRepository } from "../repositories/getRepository";
import { getBookService } from "./getBookService";

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
    try {
      const author = await authorRepository.getAuthor(id);

      if (author instanceof NotFoundError) {
        return author;
      }

      await getBookService(repository).deleteBooks(
        author.booksWritten.map((book) => book.id)
      );

      return authorRepository.deleteAuthor(id);
    } catch {
      return new NotFoundError();
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

  return {
    getAllAuthors,
    getAuthor,
    createAuthor,
    deleteAuthor,
    modifyAuthor,
    addBookIdToAuthor,
    removeBookIdFromAuthor,
  };
}
