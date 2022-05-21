import { Book } from "../domain";
import { getRepository } from "../repositories/getRepository";
import { getAuthorService } from "./getAuthorService";
import { getBookService } from "./getBookService";

export function createService(repository: ReturnType<typeof getRepository>) {
  return {
    getBookService: () => getBookService(repository),
    getAuthorService: () => getAuthorService(repository),
  };
}
