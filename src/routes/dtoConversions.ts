import { Author, Book } from "../domain";
import { Author as AuthorDTO, Book as BookDTO } from "./generated";

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
