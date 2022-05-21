import { AuthorDAO, BookDAO } from "./schemas";
import { Author, Book } from "../domain";
export function mapDaoToBook(bookDAO: BookDAO): Book {
  return {
    id: bookDAO._id,
    authorId: bookDAO.authorId,
    bookShelfId: bookDAO.bookShelfId,
    numberOfPages: bookDAO.numberOfPages,
    title: bookDAO.title,
  };
}

export function mapBookToDAO(book: Book): BookDAO {
  return {
    _id: book.id,
    authorId: book.authorId,
    bookShelfId: book.bookShelfId,
    numberOfPages: book.numberOfPages,
    title: book.title,
  };
}

export function mapAuthorToDAO(author: Author): AuthorDAO {
  return {
    _id: author.id,
    bookIds: author.booksWritten.map((book) => book.id),
    name: author.name,
  };
}

export function mapDaoToAuthor(
  authorDAO: AuthorDAO,
  booksWritten: Book[]
): Author {
  return {
    booksWritten,
    id: authorDAO._id,
    name: authorDAO.name,
  };
}
