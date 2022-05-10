import { Book } from "./book";

export interface BookShelf {
  id: string;
  books: Book[];
  libraryId: string;
  libraryName: string;
}
