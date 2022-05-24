import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Context } from "openapi-backend";
import { v4 } from "uuid";
import { Author } from "../domain";
import { ConflictError } from "../exceptions/ConflictError";
import { NotFoundError } from "../exceptions/NotFoundError";
import { createService } from "../services/createService";
import { mapAuthorToDTO } from "./dtoConversions";
import { AuthorContent as AuthorContentDTO } from "./generated";

export function createAuthorRelatedHandlers(
  service: ReturnType<typeof createService>
) {
  async function createAuthor(context: Context, res: Response) {
    const authorContent = context.request.requestBody as AuthorContentDTO;
    const author: Author = {
      id: v4(),
      name: authorContent.name,
      booksWritten: [],
    };

    const result = await service.getAuthorService().createAuthor(author);

    if (result instanceof ConflictError) {
      res.status(StatusCodes.CONFLICT).send();
    } else {
      const authorDTO = mapAuthorToDTO(result);

      res.status(StatusCodes.CREATED).json(authorDTO);
    }
  }

  async function getAllAuthors(_context: Context, res: Response) {
    const authors = await service.getAuthorService().getAllAuthors();

    if (authors instanceof NotFoundError) {
      res.status(StatusCodes.NOT_FOUND).send();
    } else {
      const authorDTOs = authors.map((author) => mapAuthorToDTO(author));

      res.status(StatusCodes.OK).json(authorDTOs);
    }
  }

  async function getAuthor(context: Context, res: Response) {
    const id = context.request.params.id as string;

    const result = await service.getAuthorService().getAuthor(id);

    if (result instanceof NotFoundError) {
      res.status(StatusCodes.NOT_FOUND).send();
    } else {
      const authorDTO = mapAuthorToDTO(result);

      res.status(StatusCodes.OK).json(authorDTO);
    }
  }

  async function deleteAuthor(context: Context, res: Response) {
    const id = context.request.params.id as string;

    const result = await service.getAuthorService().deleteAuthor(id);

    if (result instanceof NotFoundError) {
      res.status(StatusCodes.NOT_FOUND).send();
    } else {
      res.status(StatusCodes.NO_CONTENT).send();
    }
  }

  async function modifyAuthor(context: Context, res: Response) {
    const id = context.request.params.id as string;
    const { name } = context.request.requestBody as AuthorContentDTO;

    const result = await service.getAuthorService().modifyAuthor(id, name);

    if (result instanceof ConflictError) {
      res.status(StatusCodes.CONFLICT).send();
    } else {
      const authorDTO = mapAuthorToDTO(result);

      res.status(StatusCodes.OK).json(authorDTO);
    }
  }

  return { createAuthor, getAllAuthors, getAuthor, deleteAuthor, modifyAuthor };
}
