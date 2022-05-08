import { createAuthorRelatedHandlers } from "./createAuthorRelatedHandlers";
import { createBookRelatedHandlers } from "./createBookRelatedHandlers";
import { getHelloWorldMessage } from "./createHelloWorldHandler";

export function createHandlers() {
  return {
    getHelloWorldMessage,
    ...createBookRelatedHandlers(),
    ...createAuthorRelatedHandlers(),
  };
}
