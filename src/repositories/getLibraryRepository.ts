import { isNil } from "lodash";
import mongoose from "mongoose";
import { Library } from "../domain";
import { BadRequestError } from "../exceptions/BadRequestError";
import { ConflictError } from "../exceptions/ConflictError";
import { NotFoundError } from "../exceptions/NotFoundError";
import { BookShelf } from "../routes/generated";
import { mapDaoToLibrary, mapLibraryToDAO } from "./daoConversions";
import { getBookShelfRepository } from "./getBookShelfRepository";
import { libraryDAOSchema } from "./schemas";

const LIBRARY_ENTITY_NAME = "Book";

export function getLibraryRepository(database: typeof mongoose) {
  const LibraryModel = database.model(LIBRARY_ENTITY_NAME, libraryDAOSchema);
  const bookShelfRepository = getBookShelfRepository(database);

  async function createLibrary(library: Library) {
    const libraryDAO = mapLibraryToDAO(library);
    try {
      const result = await new LibraryModel(libraryDAO).save();
      const bookShelves = await bookShelfRepository.getBookShelvesOrThrow(
        result.bookShelfIds
      );

      return mapDaoToLibrary(result, bookShelves);
    } catch (err) {
      console.log(err);

      return new BadRequestError();
    }
  }

  async function getLibrary(id: string): Promise<Library | NotFoundError> {
    try {
      const result = await LibraryModel.findById(id);

      if (isNil(result)) {
        return new NotFoundError();
      }

      return mapDaoToLibrary(
        result,
        await bookShelfRepository.getBookShelvesOrThrow(result.bookShelfIds)
      );
    } catch (err) {
      console.log(err);

      return new NotFoundError();
    }
  }
  async function addBookShelfIdToLibrary(
    bookShelfId: string,
    libraryId: string
  ) {
    return LibraryModel.updateOne(
      { _id: libraryId },
      { $push: { bookShelfIds: bookShelfId } }
    )
      .exec()
      .then((result) => result.modifiedCount === 1)
      .catch(() => false);
  }

  async function removeBookShelfIdFromLibrary(
    bookShelfId: string,
    libraryId: string
  ) {
    return LibraryModel.updateOne(
      { _id: libraryId },
      { $pull: { bookShelfIds: bookShelfId } }
    )
      .exec()
      .then((result) => result.modifiedCount === 1)
      .catch(() => false);
  }

  async function getAllLibraries(): Promise<Library[] | NotFoundError> {
    try {
      const libraries = await LibraryModel.find({});

      const libraryPromises = libraries.map(async (library) =>
        mapDaoToLibrary(
          library,
          await bookShelfRepository.getBookShelvesOrThrow(library.bookShelfIds)
        )
      );

      return Promise.all(libraryPromises);
    } catch (err) {
      console.log(err);

      return new NotFoundError();
    }
  }

  async function deleteLibrary(id: string): Promise<NotFoundError | void> {
    try {
      const result = await LibraryModel.findByIdAndDelete(id);
      if (isNil(result)) {
        return new NotFoundError();
      }
    } catch (err) {
      console.log(err);

      return new NotFoundError();
    }
  }

  async function modifyLibrary(id: string, library: Library) {
    try {
      const libraryDAO = mapLibraryToDAO(library);
      const result = await LibraryModel.findByIdAndUpdate(id, libraryDAO, {
        new: true,
      });

      if (isNil(result)) {
        return new ConflictError();
      }

      const bookShelves = await bookShelfRepository.getBookShelvesOrThrow(
        result.bookShelfIds
      );

      return mapDaoToLibrary(result, bookShelves);
    } catch (err) {
      return new ConflictError();
    }
  }
  return {
    createLibrary,
    getLibrary,
    getAllLibraries,
    addBookShelfIdToLibrary,
    removeBookShelfIdFromLibrary,
    deleteLibrary,
    modifyLibrary,
  };
}
