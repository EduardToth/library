import { Context } from "openapi-backend";
import { Response } from "express";
import { AuthorContent as AuthorContentDTO } from "./generated";
import { Author } from "../domain";
import { v4 } from "uuid";
import { StatusCodes } from "http-status-codes";

export function createAuthorRelatedHandlers() {
  async function createAuthor(context: Context, res: Response) {
    const authorContent = context.request.requestBody as AuthorContentDTO;
    const author: Author = { ...authorContent, id: v4() };

    res.status(StatusCodes.CREATED).json(author);
  }

  async function getAllAuthors(context: Context, res: Response) {
    res.status(StatusCodes.OK).json([]);
  }

  async function modifyAuthor(context: Context, res: Response) {
    const id = context.request.params.id as string;
    const authorContent = context.request.requestBody as AuthorContentDTO;

    // Verify if author exists
    // Modify author

    res.status(StatusCodes.OK).json({ ...authorContent, id });
  }

  async function getAuthor(context: Context, res: Response) {
    const id = context.request.params.id as string;
    const author: Author = { id, booksWritten: [], name: "Edy" };

    res.status(StatusCodes.OK).json(author);
  }

  async function deleteAuthor(context: Context, res: Response) {
    const id = context.request.params.id as string;

    res.status(StatusCodes.NO_CONTENT).send();
  }

  return { createAuthor, getAllAuthors, modifyAuthor, getAuthor, deleteAuthor };
}
