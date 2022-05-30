import { Context } from "openapi-backend";
import { Response } from "express";
import { LibraryContent as LibraryContentDTO } from "./generated";
import { v4 } from "uuid";
import { Library } from "../domain";
import { StatusCodes } from "http-status-codes";
import { mapLibraryToDTO } from "./dtoConversions";
import { createService } from "../services/createService";
import { NotFoundError } from "../exceptions/NotFoundError";
import { ConflictError } from "../exceptions/ConflictError";
import { BadRequestError } from "../exceptions/BadRequestError";

export function createLibraryRelatedHandlers(
  service: ReturnType<typeof createService>
) {
  async function createLibrary(context: Context, res: Response) {
    const libraryContentDTO = context.request.requestBody as LibraryContentDTO;
    const library: Library = {
      ...libraryContentDTO,
      id: v4(),
      bookShelves: [],
    };

    const result = await service.getLibraryService().createLibrary(library);

    if (result instanceof BadRequestError) {
      res.status(StatusCodes.BAD_REQUEST).send();
    } else {
      const libraryDTO = mapLibraryToDTO(result);
      res.status(StatusCodes.CREATED).json(libraryDTO);
    }
  }

  async function getLibrary(context: Context, res: Response) {
    const id = context.request.params.id as string;
    const result = await service.getLibraryService().getLibrary(id);

    if (result instanceof NotFoundError) {
      res.status(StatusCodes.NOT_FOUND).send();
    } else {
      const libraryDTO = mapLibraryToDTO(result);

      res.status(StatusCodes.OK).json(libraryDTO);
    }
  }

  async function getAllLibraries(_context: Context, res: Response) {
    const results = await service.getLibraryService().getAllLibraries();

    if (results instanceof NotFoundError) {
      res.status(StatusCodes.NOT_FOUND).send();
    } else {
      const libraryDTOs = results.map((result) => mapLibraryToDTO(result));

      res.status(StatusCodes.OK).json(libraryDTOs);
    }
  }

  async function modifyLibrary(context: Context, res: Response) {
    const id = context.request.params.id as string;
    const { name } = context.request.requestBody as LibraryContentDTO;
    const result = await service.getLibraryService().modifyLibrary(id, name);

    if (result instanceof ConflictError) {
      res.status(StatusCodes.CONFLICT).send();
    } else {
      const libraryDTO = mapLibraryToDTO(result);

      res.status(StatusCodes.OK).json(libraryDTO);
    }
  }

  async function deleteLibrary(context: Context, res: Response) {
    const id = context.request.params.id as string;
    const result = await service.getLibraryService().deleteLibrary(id);

    if (result instanceof NotFoundError) {
      res.status(StatusCodes.NOT_FOUND).send();
    } else {
      res.status(StatusCodes.NO_CONTENT).send();
    }
  }

  return {
    createLibrary,
    getLibrary,
    getAllLibraries,
    modifyLibrary,
    deleteLibrary,
  };
}
