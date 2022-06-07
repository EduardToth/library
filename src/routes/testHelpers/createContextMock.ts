import { Context, ParsedRequest } from "openapi-backend";

interface ContextCreationParameter {
  request: Partial<Omit<ParsedRequest, "body">>;
  validation?: Context["validation"];
}

export function createContext({
  request: {
    params = {},
    requestBody = {},
    cookies = {},
    query = {},
    method = "GET",
    path = "",
    headers = {},
  },
  validation = { valid: true },
}: ContextCreationParameter) {
  return {
    request: {
      params,
      requestBody,
      cookies,
      query,
      method,
      path,
      headers,
      body: requestBody,
    },
    operation: { path, method },
    api: {} as Context["api"],
    validation,
    security: {},
    response: {},
  };
}
