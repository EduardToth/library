import express, { Express } from "express";
import { StatusCodes } from "http-status-codes";
import { isNil } from "lodash";
import OpenAPIBackend, { Context } from "openapi-backend";
import { createHandlers } from "./routes/createHandlers";
import { Response } from "express";
import bodyParser from "body-parser";
import { IncomingHttpHeaders } from "http";
import QueryString from "qs";
import mongoose from "mongoose";
import { createService } from "./services/createService";
import { getRepository } from "./repositories/getRepository";

function getHeadersWithNoUndefinedAsValues(headers: IncomingHttpHeaders) {
  const headerEntries = Object.entries(headers);
  const headerEntriesWithNotUndefinedValues = headerEntries.filter(
    (entry): entry is [string, string | string[]] => !isNil(entry[1])
  );

  return Object.fromEntries(headerEntriesWithNotUndefinedValues);
}

function getQueryParametersWithNoUndefinedAsValues(
  query: QueryString.ParsedQs
) {
  const queryEntries = Object.entries(query);
  const queryEntriesWithNoUndefinedAsValues = queryEntries.filter(
    (entry): entry is [string, string | string[]] => !isNil(entry[1])
  );
  return query && Object.fromEntries(queryEntriesWithNoUndefinedAsValues);
}

async function getConfiguredApp(): Promise<express.Express> {
  const databaseUrl = "mongodb://localhost:27017/libraryDB";
  const database = await mongoose.connect(databaseUrl);
  console.log("It worked");
  const repository = getRepository(database);
  const service = createService(repository);

  const api = new OpenAPIBackend({
    definition: "./definitions/api.yaml",
    handlers: { ...createHandlers(service) },
    validate: true,
  });

  api.register("validationFail", (c: Context, res: Response) => {
    console.log("Invalid Request", {
      status: StatusCodes.BAD_REQUEST,
      err: c.validation.errors,
    });
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ status: StatusCodes.BAD_REQUEST, err: c.validation.errors });
  });

  await api.init();

  const app: Express = express();

  return app.use(bodyParser.json()).use((request, response) => {
    const headers = getHeadersWithNoUndefinedAsValues(request.headers);

    const query = getQueryParametersWithNoUndefinedAsValues(request.query);

    const { path } = request;
    api
      .handleRequest({ ...request, headers, query, path }, response)
      .catch(() => response.status(StatusCodes.INTERNAL_SERVER_ERROR).end());
  });
}

async function init() {
  const app = await getConfiguredApp();

  return app.listen(5000, () =>
    console.log("Server is listening on port 5000")
  );
}

module.exports = { init };
