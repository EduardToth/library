import { Author } from "../domain";
import { getRepository } from "../repositories/getRepository";

export function getAuthorService(repository: ReturnType<typeof getRepository>) {
  const { getAuthorRepository } = repository;

  async function getAllAuthors() {
    return getAuthorRepository().getAllAuthors();
  }

  async function getAuthor(id: string) {
    return getAuthorRepository().getAuthor(id);
  }

  async function createAuthor(author: Author) {
    return getAuthorRepository().createAuthor(author);
  }

  return { getAllAuthors, getAuthor, createAuthor };
}
