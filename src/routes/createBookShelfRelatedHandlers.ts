import { Context } from "openapi-backend";
import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  BookShelf,
  BookShelfContent as BookShelfContentDTO,
} from "./generated";
import { v4 } from "uuid";
import { mapBookShelfToDTO } from "./dtoConversions";

export function createBookShelfRelatedHandlers() {
  async function getAllBookShelves(_context: Context, res: Response) {
    res.status(StatusCodes.OK).json([]);
  }

  async function createBookShelf(context: Context, res: Response) {
    const bookShelfContent = context.request.requestBody as BookShelfContentDTO;
    const { libraryId } = bookShelfContent;
    //check if the library exists
    //if so, add bookShelf id to the corresponding library
    const bookShelf: BookShelf = {
      ...bookShelfContent,
      id: v4(),
      libraryId: v4(),
      books: [],
    };
    const bookShelfDTO = mapBookShelfToDTO(bookShelf);
    res.status(StatusCodes.CREATED).json(bookShelfDTO);
  }

  async function getBookShelf(context: Context, res: Response) {
    const id = context.request.params.id as string;

    const bookShelf: BookShelf = {
      books: [],
      id,
      libraryId: v4(),
    };

    const bookShelfDTO = mapBookShelfToDTO(bookShelf);

    res.status(StatusCodes.OK).json(bookShelfDTO);
  }

  async function modifyBookShelf(context: Context, res: Response) {
    const id = context.request.params.id as string;
    const { libraryId } = context.request.requestBody as BookShelfContentDTO;

    // check if the library exists
    // if so, modify the bookShelf array from the library

    const bookShelf: BookShelf = {
      books: [],
      id,
      libraryId,
    };

    const bookShelfDTO = mapBookShelfToDTO(bookShelf);

    res.send(StatusCodes.OK).json(bookShelfDTO);
  }

  async function deleteBookShelf(context: Context, res: Response) {
    const id = context.request.params.id as string;

    //delete also the bookshelfId from the library, delete all stored books in the bookshelf

    res.status(StatusCodes.NO_CONTENT).send();
  }
  return {
    getAllBookShelves,
    createBookShelf,
    getBookShelf,
    modifyBookShelf,
    deleteBookShelf,
  };
}
