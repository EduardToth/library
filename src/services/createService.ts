import { getRepository } from "../repositories/getRepository";
import { getAuthorService } from "./getAuthorService";
import { getBookService } from "./getBookService";
import { getBookShelfService } from "./getBookShelfService";
import { getLibraryService } from "./getLibraryService";

export function createService(repository: ReturnType<typeof getRepository>) {
  return {
    getBookService: () => getBookService(repository),
    getAuthorService: () => getAuthorService(repository),
    getBookShelfService: () => getBookShelfService(repository),
    getLibraryService: () => getLibraryService(repository),
  };
}
