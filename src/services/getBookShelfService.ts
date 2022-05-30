import { BadRequestError } from "../exceptions/BadRequestError";
import { ConflictError } from "../exceptions/ConflictError";
import { NotFoundError } from "../exceptions/NotFoundError";
import { getRepository } from "../repositories/getRepository";
import { BookShelf } from "../routes/generated";
import { getBookService } from "./getBookService";
import { getLibraryService } from "./getLibraryService";

export function getBookShelfService(
  repository: ReturnType<typeof getRepository>
) {
  const bookShelfRepository = repository.getBookShelfRepository();
  const libraryService = getLibraryService(repository);

  async function createBookShelf(bookShelf: BookShelf) {
    try {
      const library = await getLibraryService(repository).getLibrary(
        bookShelf.libraryId
      );

      if (library instanceof Error) {
        throw library;
      }

      await getLibraryService(repository).addBookShelfIdToLibrary(
        bookShelf.id,
        bookShelf.libraryId
      );

      return bookShelfRepository.createBookShelf(bookShelf);
    } catch {
      return new BadRequestError();
    }
  }

  async function getBookShelf(id: string) {
    return bookShelfRepository.getBookShelf(id);
  }

  async function getAllBookShelves() {
    return bookShelfRepository.getAllBookShelves();
  }

  async function removeBookIdFromBookShelf(
    bookId: string,
    bookShelfId: string
  ) {
    try {
      const result = await bookShelfRepository.removeBookIdFromBookShelf(
        bookId,
        bookShelfId
      );

      if (result === false) {
        throw new Error("Unsuccessful removal");
      }
    } catch {
      throw new Error("Unsuccessful removal");
    }
  }

  async function addBookIdToBookShelf(bookId: string, bookShelfId: string) {
    try {
      const result = await repository
        .getBookShelfRepository()
        .addBookIdToBookShelf(bookId, bookShelfId);

      if (result === false) {
        throw new Error("Unsuccessful insertion");
      }
    } catch {
      throw new Error("Unsuccessful insertion");
    }
  }

  async function deleteBookShelf(id: string) {
    try {
      const bookShelf = await getBookShelf(id);

      if (bookShelf instanceof NotFoundError) {
        return bookShelf;
      }

      await getBookService(repository).deleteBooks(
        bookShelf.books.map((book) => book.id)
      );
      await getLibraryService(repository).removeBookShelfIdFromLibrary(
        bookShelf.id,
        bookShelf.libraryId
      );
      return bookShelfRepository.deleteBookShelf(id);
    } catch {
      return new NotFoundError();
    }
  }

  async function deleteBookShelves(bookShelfIds: string[]): Promise<void> {
    const deletionResults = await Promise.all(
      bookShelfIds.map(deleteBookShelf)
    );

    for (const deletionResult of deletionResults) {
      if (deletionResult instanceof Error) {
        throw deletionResult;
      }
    }
  }

  async function modifyBookShelf(id: string, bookShelf: BookShelf) {
    try {
      const oldBookShelf = await getBookShelf(id);

      if (oldBookShelf instanceof Error) {
        throw oldBookShelf;
      }

      const oldLibraryId = oldBookShelf.libraryId;
      await Promise.all([
        libraryService.removeBookShelfIdFromLibrary(id, oldLibraryId),
        libraryService.addBookShelfIdToLibrary(id, bookShelf.libraryId),
      ]);

      return bookShelfRepository.modifyBookShelf(id, bookShelf);
    } catch {
      return new ConflictError();
    }
  }

  return {
    createBookShelf,
    getBookShelf,
    getAllBookShelves,
    removeBookIdFromBookShelf,
    addBookIdToBookShelf,
    deleteBookShelf,
    deleteBookShelves,
    modifyBookShelf,
  };
}
