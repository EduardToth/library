import { isNil } from "lodash";
import mongoose from "mongoose";
import { Book } from "../domain";
import { BadRequestError } from "../exceptions/BadRequestError";
import { ConflictError } from "../exceptions/ConflictError";
import { NotFoundError } from "../exceptions/NotFoundError";
import { BookShelf } from "../routes/generated";
import {
  mapBookShelfToDAO,
  mapDaoToBook,
  mapDaoToBookShelf,
} from "./daoConversions";
import { getBookRepository } from "./getBookRepository";
import { bookShelfDAOSchema } from "./schemas";

export function getBookShelfRepository(database: typeof mongoose) {
  const BOOK_SHELF_ENTITY_NAME = "BookShelf";
  const BookShelfModel = database.model(
    BOOK_SHELF_ENTITY_NAME,
    bookShelfDAOSchema
  );
  const bookRepository = getBookRepository(database);

  async function getBooksOrThrow(bookIds: string[]): Promise<Book[]> {
    const books = await Promise.all(
      bookIds.map((bookId) => bookRepository.getBook(bookId))
    );

    for (const book of books) {
      if (book instanceof Error) {
        throw book;
      }
    }

    return books as Book[];
  }

  async function createBookShelf(
    bookShelf: BookShelf
  ): Promise<BookShelf | BadRequestError> {
    const bookShelfDAO = mapBookShelfToDAO(bookShelf);
    try {
      const result = await new BookShelfModel(bookShelfDAO).save();
      const books = await getBooksOrThrow(result.bookIds);

      return mapDaoToBookShelf(result, books as Book[]);
    } catch (err) {
      console.log(err);

      return new BadRequestError();
    }
  }

  async function getBookShelf(id: string) {
    try {
      const result = await BookShelfModel.findById(id).exec();

      if (isNil(result)) {
        return new NotFoundError();
      }

      const books = await getBooksOrThrow(result.bookIds);

      return mapDaoToBookShelf(result, books);
    } catch (err) {
      console.log(err);

      return new NotFoundError();
    }
  }

  async function getAllBookShelves() {
    try {
      const bookShelves = await BookShelfModel.find({}).exec();

      return Promise.all(
        bookShelves.map(async (bookShelf) =>
          mapDaoToBookShelf(bookShelf, await getBooksOrThrow(bookShelf.bookIds))
        )
      );
    } catch (err) {
      console.log(err);

      return new NotFoundError();
    }
  }

  async function addBookIdToBookShelf(bookId: string, bookShelfId: string) {
    return BookShelfModel.updateOne(
      { _id: bookShelfId },
      { $push: { bookIds: bookId } }
    )
      .exec()
      .then((result) => result.modifiedCount === 1)
      .catch(() => false);
  }

  async function removeBookIdFromBookShelf(
    bookId: string,
    bookShelfId: string
  ) {
    return BookShelfModel.updateOne(
      { _id: bookShelfId },
      { $pull: { bookIds: bookId } }
    )
      .exec()
      .then((result) => result.modifiedCount === 1)
      .catch(() => false);
  }

  async function deleteBookShelf(id: string): Promise<NotFoundError | void> {
    try {
      const result = await BookShelfModel.findByIdAndDelete(id).exec();

      if (isNil(result)) {
        return new NotFoundError();
      }
    } catch (err) {
      console.log(err);

      return new NotFoundError();
    }
  }

  async function getBookShelvesOrThrow(
    bookShelfIds: string[]
  ): Promise<BookShelf[]> {
    const bookShelves = await Promise.all(bookShelfIds.map(getBookShelf));

    for (const bookShelf of bookShelves) {
      if (bookShelf instanceof Error) {
        throw bookShelf;
      }
    }

    return bookShelves as BookShelf[];
  }

  async function modifyBookShelf(id: string, bookShelf: BookShelf) {
    try {
      const bookShelfDAO = mapBookShelfToDAO(bookShelf);
      const result = await BookShelfModel.findByIdAndUpdate(
        id,
        bookShelfDAO
      ).exec();

      if (isNil(result)) {
        return new ConflictError();
      }

      return mapDaoToBookShelf(
        result,
        await bookRepository.getBooksOrThrow(result.bookIds)
      );
    } catch (err) {
      console.log(err);

      return new ConflictError();
    }
  }
  return {
    createBookShelf,
    getBookShelf,
    getAllBookShelves,
    addBookIdToBookShelf,
    removeBookIdFromBookShelf,
    deleteBookShelf,
    getBookShelvesOrThrow,
    modifyBookShelf,
  };
}
