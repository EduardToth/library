import { createService } from "../../services/createService";

type SubServiceTypes = ReturnType<typeof createService>;
type BookService = ReturnType<SubServiceTypes["getBookService"]>;

export function getBookServiceMock(): BookService {
  return {
    createBook: jest.fn(),
    deleteBook: jest.fn(),
    getAllBooks: jest.fn(),
    getBook: jest.fn(),
    updateBook: jest.fn(),
  };
}
