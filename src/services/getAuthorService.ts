import { Author } from "../domain";
import { getRepository } from "../repositories/getRepository";

export function getAuthorService(repository: ReturnType<typeof getRepository>) {
  async function getAllAuthors() {
    return repository.getAuthorRepository().getAllAuthors();
  }

  async function getAuthor(id: string) {
    return repository.getAuthorRepository().getAuthor(id);
  }

  async function createAuthor(author: Author) {
    return repository.getAuthorRepository().createAuthor(author);
  }
  return { getAllAuthors, getAuthor, createAuthor };
}
