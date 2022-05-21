import { createAuthorRelatedHandlers } from "./createAuthorRelatedHandlers";
import { createBookRelatedHandlers } from "./createBookRelatedHandlers";
import { getHelloWorldMessage } from "./createHelloWorldHandler";
import { createLibraryRelatedHandlers } from "./createLibraryRelatedHandlers";

export function createHandlers() {
  return {
    getHelloWorldMessage,
    ...createBookRelatedHandlers(),
    ...createAuthorRelatedHandlers(),
    ...createLibraryRelatedHandlers(),
  };
}
