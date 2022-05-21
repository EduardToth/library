import { Context } from "openapi-backend";
import { Response } from "express";
import { AuthorContent as AuthorContentDTO } from "./generated";
import { Author } from "../domain";
import { v4 } from "uuid";
import { StatusCodes } from "http-status-codes";
import { mapAuthorToDTO } from "./dtoConversions";

export function createAuthorRelatedHandlers() {
  async function createAuthor(context: Context, res: Response) {
    const authorContent = context.request.requestBody as AuthorContentDTO;
    const author: Author = { ...authorContent, id: v4(), booksWritten: [] };

    const authorDTO = mapAuthorToDTO(author);
    res.status(StatusCodes.CREATED).json(authorDTO);
  }

  async function getAllAuthors(_context: Context, res: Response) {
    res.status(StatusCodes.OK).json([]);
  }

  async function modifyAuthor(context: Context, res: Response) {
    const id = context.request.params.id as string;
    const authorContent = context.request.requestBody as AuthorContentDTO;

    res.status(StatusCodes.OK).json({ ...authorContent, id });
  }

  async function getAuthor(context: Context, res: Response) {
    const id = context.request.params.id as string;
    const author: Author = { id, booksWritten: [], name: "Edy" };
    const authorDTO = mapAuthorToDTO(author);

    res.status(StatusCodes.OK).json(authorDTO);
  }

  async function deleteAuthor(context: Context, res: Response) {
    const id = context.request.params.id as string;
    // delete all book written by this author

    res.status(StatusCodes.NO_CONTENT).send();
  }

  return { createAuthor, getAllAuthors, modifyAuthor, getAuthor, deleteAuthor };
}
