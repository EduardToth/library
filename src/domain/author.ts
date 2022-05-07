import { Book } from "./book";

export interface Author {
  id: string;
  name: string;
  booksWritten: Book[];
}
