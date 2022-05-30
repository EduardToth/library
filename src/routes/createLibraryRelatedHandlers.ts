import { Context } from "openapi-backend";
import { Response } from "express";
import { LibraryContent as LibraryContentDTO } from "./generated";
import { v4 } from "uuid";
import { Library } from "../domain";
import { StatusCodes } from "http-status-codes";
import { mapLibraryToDTO } from "./dtoConversions";

export function createLibraryRelatedHandlers() {
  async function createLibrary(context: Context, res: Response) {
    const libraryContentDTO = context.request.requestBody as LibraryContentDTO;

    const library: Library = {
      ...libraryContentDTO,
      bookShelves: [],
      id: v4(),
    };
    const libraryDTO = mapLibraryToDTO(library);
    res.status(StatusCodes.CREATED).json(libraryDTO);
  }

  async function getLibrary(context: Context, res: Response) {
    const id = context.request.params.id as string;

    const library: Library = {
      id,
      name: "n",
      bookShelves: [],
    };

    const libraryDTO = mapLibraryToDTO(library);
    res.status(StatusCodes.OK).json(libraryDTO);
  }

  async function getAllLibraries(_context: Context, res: Response) {
    res.status(StatusCodes.OK).json([]);
  }

  async function modifyLibrary(context: Context, res: Response) {
    const id = context.request.params.id as string;
    const libraryContentDTO = context.request.requestBody as LibraryContentDTO;

    res.status(StatusCodes.OK).json({ ...libraryContentDTO, id });
  }

  async function deleteLibrary(context: Context, res: Response) {
    const id = context.request.params.id as string;
    // every bookshelf in this library has to be deleted
    res.status(StatusCodes.NO_CONTENT).send();
  }

  return {
    createLibrary,
    getLibrary,
    getAllLibraries,
    modifyLibrary,
    deleteLibrary,
  };
}
