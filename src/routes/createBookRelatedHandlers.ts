import { Context } from "openapi-backend";
import { Response } from "express";
import { StatusCodes } from "http-status-codes/build/cjs/status-codes";
import { BookContent as BookContentDTO, Book as BookDTO } from "./generated";
import { v4 } from "uuid";
import { Book } from "../domain";
import { createService } from "../services/createService";
import { ConflictError } from "../exceptions/ConflictError";
import { getBookFromDTO, mapBookToDTO } from "./dtoConversions";
import { NotFoundError } from "../exceptions/NotFoundError";
import { BadRequestError } from "../exceptions/BadRequestError";

type SubServiceTypes = ReturnType<typeof createService>;
export function createBookRelatedHandlers(
  bookService: ReturnType<SubServiceTypes["getBookService"]>
) {
  async function createBook(context: Context, res: Response) {
    const bookContentDTO = context.request.requestBody as BookContentDTO;
    const { authorId, bookShelfId } = bookContentDTO;
    // check that the author and the booksShelf exist
    // add book to the author entity and the bookShelf entity

    const book: Book = {
      ...bookContentDTO,
      id: v4(),
    };

    const result = await bookService.createBook(book);

    if (result instanceof BadRequestError) {
      res.status(StatusCodes.BAD_REQUEST).send();
    } else {
      const bookDTO = mapBookToDTO(book);

      res.status(StatusCodes.CREATED).json(bookDTO);
    }
  }

  async function getAllBooks(_context: Context, res: Response) {
    const result = await bookService.getAllBooks();

    if (result instanceof NotFoundError) {
      res.status(StatusCodes.OK).send();
    } else {
      const bookDTOs = result.map((book) => mapBookToDTO(book));

      res.status(StatusCodes.OK).json(bookDTOs);
    }
  }

  async function getBook(context: Context, res: Response) {
    const id = context.request.params.id as string;
    const result = await bookService.getBook(id);

    if (result instanceof NotFoundError) {
      res.status(StatusCodes.NOT_FOUND).send();
    } else {
      const bookDTO = mapBookToDTO(result);

      res.status(StatusCodes.OK).json(bookDTO);
    }
  }

  async function deleteBook(context: Context, res: Response) {
    const id = context.request.params.id as string;
    // delete the reference to the book entity from the corresponding author entity
    // delete the reference to the book entity from the corresponding bookshelf entity
    const result = await bookService.deleteBook(id);

    if (result instanceof NotFoundError) {
      res.status(StatusCodes.NOT_FOUND).send();
    } else {
      res.status(StatusCodes.NO_CONTENT).send();
    }
  }

  async function updateBook(context: Context, res: Response) {
    const id = context.request.params.id as string;
    const bookContentDTO = context.request.requestBody as BookContentDTO;
    const book = getBookFromDTO({ ...bookContentDTO, id });
    const result = await bookService.updateBook(id, book);

    if (result instanceof ConflictError) {
      res.status(StatusCodes.CONFLICT).send();
    } else {
      const resultedBook = mapBookToDTO(result);

      res.status(StatusCodes.OK).json(resultedBook);
    }
  }

  return { createBook, getAllBooks, getBook, deleteBook, updateBook };
}
