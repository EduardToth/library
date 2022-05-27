import { isNil } from "lodash";
import mongoose from "mongoose";
import { Book } from "../domain";
import { BadRequestError } from "../exceptions/BadRequestError";
import { ConflictError } from "../exceptions/ConflictError";
import { NotFoundError } from "../exceptions/NotFoundError";
import { mapBookToDAO, mapDaoToBook } from "./daoConversions";
import { bookDAOSchema } from "./schemas";

const BOOK_ENTITY_NAME = "Book";

export function getBookRepository(database: typeof mongoose) {
  const BookModel = database.model(BOOK_ENTITY_NAME, bookDAOSchema);

  async function getAllBooks(): Promise<Book[] | NotFoundError> {
    try {
      const resultArray = await BookModel.find({}).exec();

      return resultArray.map((result) => mapDaoToBook(result));
    } catch (err) {
      console.log(err);

      return new NotFoundError();
    }
  }

  async function createBook(book: Book): Promise<Book | BadRequestError> {
    const bookDAO = mapBookToDAO(book);
    try {
      const resultedBookDAO = await new BookModel(bookDAO).save();

      return mapDaoToBook(resultedBookDAO);
    } catch (err) {
      console.log(err);

      return new BadRequestError();
    }
  }

  async function getBook(id: string): Promise<Book | NotFoundError> {
    try {
      const result = await BookModel.findById(id).exec();

      if (isNil(result)) {
        return new NotFoundError();
      }

      return mapDaoToBook(result);
    } catch (err) {
      console.log(err);

      return new NotFoundError();
    }
  }

  async function deleteBook(id: string): Promise<void | NotFoundError> {
    try {
      const result = await BookModel.findByIdAndDelete(id).exec();

      if (isNil(result)) {
        return new NotFoundError();
      }
    } catch (err) {
      console.log(err);

      return new NotFoundError();
    }
  }

  async function updateBook(
    id: string,
    book: Book
  ): Promise<Book | ConflictError> {
    try {
      const bookDAO = mapBookToDAO(book);
      const result = await BookModel.findByIdAndUpdate(id, bookDAO, {
        new: true,
      }).exec();

      if (isNil(result)) {
        return new ConflictError();
      }

      return mapDaoToBook(result);
    } catch (err) {
      console.log(err);

      return new ConflictError();
    }
  }

  async function getBooksOrThrow(bookIds: string[]): Promise<Book[]> {
    const bookRequestPromises = bookIds.map((id) => getBook(id));
    const retrievedBooks = await Promise.all(bookRequestPromises);

    const error = retrievedBooks.find(
      (retrievedBook) => retrievedBook instanceof Error
    );

    if (error) {
      throw error;
    }

    return retrievedBooks as Book[];
  }

  return {
    getAllBooks,
    createBook,
    getBook,
    deleteBook,
    updateBook,
    getBooksOrThrow,
  };
}
