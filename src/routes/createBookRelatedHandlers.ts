import { Context } from "openapi-backend";
import { Response } from "express";
import { StatusCodes } from "http-status-codes/build/cjs/status-codes";
import { BookContent as BookContentDTO, Book as BookDTO } from "./generated";
import { v4 } from "uuid";
import { Book } from "../domain";

export function createBookRelatedHandlers() {
  async function createBook(context: Context, res: Response) {
    const bookContentDTO = context.request.requestBody as BookContentDTO;
    const { authorId } = bookContentDTO;
    // TODO does author exists
    const book: Book = {
      ...bookContentDTO,
      id: v4(),
    };

    res.status(StatusCodes.CREATED).json(book);
  }

  async function getAllBooks(context: Context, res: Response) {
    res.status(StatusCodes.OK).json([]);
  }

  async function getBook(context: Context, res: Response) {
    const id = context.request.params.id as string;
    const bookDTO: BookDTO = {
      id,
      numberOfPages: 100,
      title: "Some title",
      authorName: "fakeName",
      authorId: v4(),
    };

    res.status(StatusCodes.OK).json(bookDTO);
  }

  async function deleteBook(context: Context, res: Response) {
    const id = context.request.params.id as string;
    // delete the reference to the book entity from the corresponding author field
    res.status(StatusCodes.NO_CONTENT).send();
  }

  async function updateBook(context: Context, res: Response) {
    const id = context.request.params.id as string;
    const bookContentDTO = context.request.requestBody as BookContentDTO;
    const resultingBook: BookDTO = {
      ...bookContentDTO,
      id,
    };

    res.status(StatusCodes.OK).json(resultingBook);
  }

  return { createBook, getAllBooks, getBook, deleteBook, updateBook };
}
