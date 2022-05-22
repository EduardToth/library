import { Author, Book, BookShelf } from "../domain";
import {
  Author as AuthorDTO,
  Book as BookDTO,
  BookShelf as BookShelfDTO,
  Library,
  Library as LibraryDTO,
} from "./generated";

export function mapBookToDTO(book: Book): BookDTO {
  return {
    id: book.id,
    authorId: book.authorId,
    bookShelfId: book.bookShelfId,
    numberOfPages: book.numberOfPages,
    title: book.title,
  };
}

export function getBookFromDTO(bookDTO: BookDTO): Book {
  return {
    id: bookDTO.id,
    authorId: bookDTO.authorId,
    bookShelfId: bookDTO.bookShelfId,
    numberOfPages: bookDTO.numberOfPages,
    title: bookDTO.title,
  };
}

export function mapAuthorToDTO(author: Author): AuthorDTO {
  return {
    id: author.id,
    name: author.name,
    booksWritten: author.booksWritten.map((book) => mapBookToDTO(book)),
  };
}

export function mapBookShelfToDTO(bookShelf: BookShelf): BookShelfDTO {
  return {
    id: bookShelf.id,
    books: bookShelf.books.map(mapBookToDTO),
    libraryId: bookShelf.libraryId,
  };
}
export function mapLibraryToDTO(library: Library): LibraryDTO {
  return {
    id: library.id,
    name: library.name,
    bookShelves: library.bookShelves.map(mapBookShelfToDTO),
  };
}
