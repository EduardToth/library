import { createAuthorRelatedHandlers } from "./createAuthorRelatedHandlers";
import { createBookRelatedHandlers } from "./createBookRelatedHandlers";
import { createBookShelfRelatedHandlers } from "./createBookShelfRelatedHandlers";
import { getHelloWorldMessage } from "./createHelloWorldHandler";
import { createLibraryRelatedHandlers } from "./createLibraryRelatedHandlers";

export function createHandlers() {
  return {
    getHelloWorldMessage,
    ...createBookRelatedHandlers(),
    ...createAuthorRelatedHandlers(),
    ...createLibraryRelatedHandlers(),
    ...createBookShelfRelatedHandlers(),
  };
}
