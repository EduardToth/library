import { Context } from "openapi-backend";
import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  BookShelf,
  BookShelfContent as BookShelfContentDTO,
} from "./generated";
import { v4 } from "uuid";
import { mapBookShelfToDTO } from "./dtoConversions";
import { createService } from "../services/createService";
import { ConflictError } from "../exceptions/ConflictError";
import { NotFoundError } from "../exceptions/NotFoundError";
import { BadRequestError } from "../exceptions/BadRequestError";
import { getLibraryService } from "../services/getLibraryService";

export function createBookShelfRelatedHandlers(
  service: ReturnType<typeof createService>
) {
  async function getAllBookShelves(_context: Context, res: Response) {
    res.status(StatusCodes.OK).json([]);
  }

  async function createBookShelf(context: Context, res: Response) {
    const bookShelfContent = context.request.requestBody as BookShelfContentDTO;
    const bookShelf: BookShelf = {
      ...bookShelfContent,
      id: v4(),
      books: [],
    };
    const result = await service
      .getBookShelfService()
      .createBookShelf(bookShelf);

    if (result instanceof BadRequestError) {
      res.status(StatusCodes.BAD_REQUEST).send();
    } else {
      const bookShelfDTO = mapBookShelfToDTO(result);

      res.status(StatusCodes.CREATED).json(bookShelfDTO);
    }
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
    const bookShelf: BookShelf = {
      books: [],
      id,
      libraryId,
    };

    const result = await service
      .getBookShelfService()
      .modifyBookShelf(id, bookShelf);

    if (result instanceof ConflictError) {
      res.status(StatusCodes.CONFLICT).send();
    } else {
      const bookShelfDTO = mapBookShelfToDTO(result);

      res.send(StatusCodes.OK).json(bookShelfDTO);
    }
  }

  async function deleteBookShelf(context: Context, res: Response) {
    const id = context.request.params.id as string;
    const result = await service.getBookShelfService().deleteBookShelf(id);

    if (result instanceof NotFoundError) {
      res.status(StatusCodes.NOT_FOUND).send();
    } else {
      res.status(StatusCodes.NO_CONTENT).send();
    }
  }

  return {
    getAllBookShelves,
    createBookShelf,
    getBookShelf,
    modifyBookShelf,
    deleteBookShelf,
  };
}
