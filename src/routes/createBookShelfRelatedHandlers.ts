import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Context } from "openapi-backend";
import { v4 } from "uuid";
import { BadRequestError } from "../exceptions/BadRequestError";
import { ConflictError } from "../exceptions/ConflictError";
import { NotFoundError } from "../exceptions/NotFoundError";
import { createService } from "../services/createService";
import { mapBookShelfToDTO, mapBookToDTO } from "./dtoConversions";
import {
  BookShelf,
  BookShelfContent as BookShelfContentDTO,
} from "./generated";

export function createBookShelfRelatedHandlers(
  service: ReturnType<typeof createService>
) {
  async function getAllBookShelves(_context: Context, res: Response) {
    const result = await service.getBookShelfService().getAllBookShelves();

    if (result instanceof NotFoundError) {
      res.status(StatusCodes.NOT_FOUND).send();
    } else {
      res.status(StatusCodes.OK).json(result.map(mapBookShelfToDTO));
    }
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

    const result = await service.getBookShelfService().getBookShelf(id);

    if (result instanceof NotFoundError) {
      res.status(StatusCodes.NOT_FOUND).send();
    } else {
      const bookShelfDTO = mapBookShelfToDTO(result);

      res.status(StatusCodes.OK).json(bookShelfDTO);
    }
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

      res.status(StatusCodes.OK).json(bookShelfDTO);
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
