import { Context } from "openapi-backend";
import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  BookShelf,
  BookShelfContent as BookShelfContentDTO,
} from "./generated";
import { v4 } from "uuid";

export function createBookShelfRelatedHandlers() {
  async function getAllBooks(context: Context, res: Response) {
    res.status(StatusCodes.OK).json([]);
  }

  async function createBookShelf(context: Context, res: Response) {
    const bookShelfContent = context.request.requestBody as BookShelfContentDTO;
    const { libraryId } = bookShelfContent;
    //check if the library exists
    //check if all ids in the books array exist
    const bookShelf: BookShelf = { ...bookShelfContent, id: v4() };

    res.status(StatusCodes.CREATED).json(bookShelf);
  }

  return { getAllBooks, createBookShelf };
}
