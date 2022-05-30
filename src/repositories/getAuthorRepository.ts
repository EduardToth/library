import mongoose from "mongoose";
import { Author, Book } from "../domain";
import { ConflictError } from "../exceptions/ConflictError";
import { mapAuthorToDAO, mapDaoToAuthor } from "./daoConversions";
import { AuthorDAO, authorDAOSchema } from "./schemas";
import { getBookRepository } from "./getBookRepository";
import { NotFoundError } from "../exceptions/NotFoundError";
import { isNil } from "lodash";
import { BadRequestError } from "../exceptions/BadRequestError";
export function getAuthorRepository(database: typeof mongoose) {
  const AUTHOR_ENTITY_NAME = "authors";
  const { getBook } = getBookRepository(database);

  const AuthorModel = database.model(AUTHOR_ENTITY_NAME, authorDAOSchema);

  async function getBooksAfterIds(bookIds: string[]): Promise<Book[]> {
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

  async function createAuthor(
    author: Author
  ): Promise<Author | BadRequestError> {
    const authorDAO = mapAuthorToDAO(author);

    try {
      const result = await new AuthorModel(authorDAO).save();
      const resultedAuthorDAO = result as AuthorDAO;

      return getAuthorFromDAO(resultedAuthorDAO);
    } catch (err) {
      console.log(err);

      return new BadRequestError();
    }
  }

  async function getAuthorFromDAO(authorDAO: AuthorDAO): Promise<Author> {
    const booksWrittenByThisAuthor = await getBooksAfterIds(authorDAO.bookIds);

    return mapDaoToAuthor(authorDAO, booksWrittenByThisAuthor);
  }

  async function getAllAuthors(): Promise<Author[] | NotFoundError> {
    try {
      const authorDAOs = await AuthorModel.find({}).exec();
      const authors = authorDAOs.map((authorDAO) =>
        getAuthorFromDAO(authorDAO)
      );

      return Promise.all(authors);
    } catch (err) {
      console.log(err);

      return new NotFoundError();
    }
  }

  async function getAuthor(id: string): Promise<Author | NotFoundError> {
    try {
      const result = await AuthorModel.findById(id).exec();

      if (result === null) {
        return new NotFoundError();
      }

      return getAuthorFromDAO(result);
    } catch (err) {
      console.log(err);

      return new NotFoundError();
    }
  }

  async function deleteAuthor(id: string): Promise<NotFoundError | Author> {
    try {
      const result = await AuthorModel.findByIdAndDelete(id).exec();

      if (isNil(result)) {
        return new NotFoundError();
      }

      return getAuthorFromDAO(result);
    } catch (err) {
      console.log(err);

      return new NotFoundError();
    }
  }

  async function modifyAuthor(
    id: string,
    author: Author
  ): Promise<Author | ConflictError> {
    const authorDAO = mapAuthorToDAO(author);
    try {
      const result = await AuthorModel.findByIdAndUpdate(id, authorDAO, {
        new: true,
      }).exec();

      if (isNil(result)) {
        return new ConflictError();
      }

      return getAuthorFromDAO(result);
    } catch (err) {
      console.log(err);

      return new ConflictError();
    }
  }

  async function addBookIdToAuthor(
    authorId: string,
    bookId: string
  ): Promise<boolean> {
    return AuthorModel.updateOne(
      { _id: authorId },
      { $push: { bookIds: bookId } }
    )
      .exec()
      .then((result) => result.modifiedCount === 1)
      .catch(() => false);
  }

  async function removeBookIdFromAuthor(
    authorId: string,
    bookId: string
  ): Promise<boolean> {
    return AuthorModel.updateOne(
      { _id: authorId },
      { $pull: { bookIds: bookId } }
    )
      .exec()
      .then((result) => result.modifiedCount === 1)
      .catch(() => false);
  }

  return {
    createAuthor,
    getAllAuthors,
    getAuthor,
    deleteAuthor,
    modifyAuthor,
    addBookIdToAuthor,
    removeBookIdFromAuthor,
  };
}
