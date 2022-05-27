import { Library } from "../domain";
import { ConflictError } from "../exceptions/ConflictError";
import { NotFoundError } from "../exceptions/NotFoundError";
import { getRepository } from "../repositories/getRepository";
import { getBookShelfService } from "./getBookShelfService";

export function getLibraryService(
  repository: ReturnType<typeof getRepository>
) {
  const libraryRepository = repository.getLibraryRepository();

  async function removeBookShelfIdFromLibrary(
    bookShelfId: string,
    libraryId: string
  ) {
    try {
      const result = await repository
        .getLibraryRepository()
        .removeBookShelfIdFromLibrary(bookShelfId, libraryId);

      if (result === false) {
        throw new Error("Unsuccessful removal");
      }
    } catch {
      throw new Error("Unsuccessful removal");
    }
  }

  async function addBookShelfIdToLibrary(
    bookShelfId: string,
    libraryId: string
  ) {
    try {
      const result = await repository
        .getLibraryRepository()
        .addBookShelfIdToLibrary(bookShelfId, libraryId);

      if (result === false) {
        throw new Error("Unsuccessful insertion");
      }
    } catch {
      throw new Error("Unsuccessful insertion");
    }
  }

  async function createLibrary(library: Library) {
    return libraryRepository.createLibrary(library);
  }

  async function getLibrary(id: string) {
    return libraryRepository.getLibrary(id);
  }

  async function getAllLibraries() {
    return libraryRepository.getAllLibraries();
  }

  async function deleteLibrary(id: string) {
    try {
      const library = await libraryRepository.getLibrary(id);

      if (library instanceof NotFoundError) {
        throw library;
      }

      const bookShelfIds = library.bookShelves.map((bookShelf) => bookShelf.id);

      await getBookShelfService(repository).deleteBookShelves(bookShelfIds);

      return libraryRepository.deleteLibrary(id);
    } catch {
      return new NotFoundError();
    }
  }

  async function modifyLibrary(id: string, newName: string) {
    const library = await libraryRepository.getLibrary(id);

    if (library instanceof NotFoundError) {
      return new ConflictError();
    }

    const newLibrary: Library = {
      ...library,
      name: newName,
    };

    return libraryRepository.modifyLibrary(id, newLibrary);
  }

  return {
    removeBookShelfIdFromLibrary,
    addBookShelfIdToLibrary,
    createLibrary,
    getLibrary,
    getAllLibraries,
    deleteLibrary,
    modifyLibrary,
  };
}
