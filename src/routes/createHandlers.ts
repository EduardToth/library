import { createService } from "../services/createService";
import { createAuthorRelatedHandlers } from "./createAuthorRelatedHandlers";
import { createBookRelatedHandlers } from "./createBookRelatedHandlers";
import { getHelloWorldMessage } from "./createHelloWorldHandler";

export function createHandlers(service: ReturnType<typeof createService>) {
  return {
    getHelloWorldMessage,
    ...createBookRelatedHandlers(service),
    ...createAuthorRelatedHandlers(service),
  };
}
