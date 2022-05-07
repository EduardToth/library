import express, { Express } from "express";
import { StatusCodes } from "http-status-codes";
import { isNil } from "lodash";
import OpenAPIBackend from "openapi-backend";
import { createHandlers } from "./routes/createHandlers";

async function init() {
  const api = new OpenAPIBackend({
    definition: "./definitions/api.yaml",
    handlers: { ...createHandlers() },
    validate: true,
  });
  await api.init();
  const app: Express = express();

  app.use((request, response) => {
    const headers = Object.fromEntries(
      Object.entries(request.headers).filter(
        (entry): entry is [string, string | string[]] => !isNil(entry[1])
      )
    );

    const query =
      request.query &&
      Object.fromEntries(
        Object.entries(request.query).filter(
          (entry): entry is [string, string | string[]] => !isNil(entry[1])
        )
      );

    api
      .handleRequest(
        { ...request, headers, query, path: request.path },
        response
      )
      .catch(() => response.status(StatusCodes.INTERNAL_SERVER_ERROR).end());
  });

  return app.listen(5000, () => "Server is listening on port 5000");
}

module.exports = { init };
