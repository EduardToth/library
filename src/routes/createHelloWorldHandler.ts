import { StatusCodes } from "http-status-codes";
import { Context } from "openapi-backend";
import { Response } from "express";

export async function getHelloWorldMessage(_context: Context, res: Response) {
  res.status(StatusCodes.OK).send("Hello world");
}
