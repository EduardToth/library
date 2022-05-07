import { Context } from "openapi-backend";
import { Response } from "express";
import { StatusCodes } from "http-status-codes/build/cjs/status-codes";

export function createHandlers() {
  async function getHelloWorldMessage(context: Context, res: Response) {
    res.status(StatusCodes.OK).send("Hello world");
  }

  return { getHelloWorldMessage };
}
