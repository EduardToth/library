import { AuthorDAO, BookDAO, BookShelfDAO, LibraryDAO } from "./schemas";
import { Author, Book, Library } from "../domain";
import { BookShelf } from "../routes/generated";
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

export function mapLibraryToDAO(library: Library): LibraryDAO {
  return {
    _id: library.id,
    bookShelfIds: library.bookShelves.map((bookShelf) => bookShelf.id),
    name: library.name,
  };
}

export function mapBookShelfToDAO(bookShelf: BookShelf): BookShelfDAO {
  return {
    _id: bookShelf.id,
    bookIds: bookShelf.books.map((book) => book.id),
    libraryId: bookShelf.libraryId,
  };
}

export function mapDaoToBookShelf(dao: BookShelfDAO, books: Book[]): BookShelf {
  return {
    books,
    id: dao._id,
    libraryId: dao.libraryId,
  };
}

export function mapDaoToLibrary(
  dao: LibraryDAO,
  bookShelves: BookShelf[]
): Library {
  return {
    id: dao._id,
    name: dao.name,
    bookShelves,
  };
}
