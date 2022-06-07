import { createService } from "../services/createService";
import { createAuthorRelatedHandlers } from "./createAuthorRelatedHandlers";
import { createBookRelatedHandlers } from "./createBookRelatedHandlers";
import { createBookShelfRelatedHandlers } from "./createBookShelfRelatedHandlers";
import { getHelloWorldMessage } from "./createHelloWorldHandler";
import { createLibraryRelatedHandlers } from "./createLibraryRelatedHandlers";

export function createHandlers(service: ReturnType<typeof createService>) {
  return {
    getHelloWorldMessage,
    ...createBookRelatedHandlers(service.getBookService()),
    ...createAuthorRelatedHandlers(service.getAuthorService()),
    ...createBookShelfRelatedHandlers(),
    ...createLibraryRelatedHandlers(),
  };
}
