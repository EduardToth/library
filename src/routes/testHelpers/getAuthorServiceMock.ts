import { createService } from "../../services/createService";

type SubServiceTypes = ReturnType<typeof createService>;
type AuthorService = ReturnType<SubServiceTypes["getAuthorService"]>;

export function getAuthorServiceMock(): AuthorService {
  return {
    createAuthor: jest.fn(),
    deleteAuthor: jest.fn(),
    getAllAuthors: jest.fn(),
    getAuthor: jest.fn(),
    modifyAuthor: jest.fn(),
  };
}
