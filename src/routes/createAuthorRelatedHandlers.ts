import { Context } from "openapi-backend";
import { Response } from "express";
import { AuthorContent as AuthorContentDTO } from "./generated";
import { Author } from "../domain";
import { v4 } from "uuid";
import { StatusCodes } from "http-status-codes";

export function createAuthorRelatedHandlers() {
  async function createAuthor(context: Context, res: Response) {
    const authorContent = context.request.requestBody as AuthorContentDTO;
    const author: Author = { id: v4(), booksWritten: [], ...authorContent };

    res.status(StatusCodes.CREATED).json(author);
  }
  return { createAuthor };
}
