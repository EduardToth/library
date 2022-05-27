import mongoose from "mongoose";
import { getAuthorRepository } from "./getAuthorRepository";
import { getBookRepository } from "./getBookRepository";
import { getBookShelfRepository } from "./getBookShelfRepository";
import { getLibraryRepository } from "./getLibraryRepository";

export function getRepository(database: typeof mongoose) {
  return {
    getBookRepository: () => getBookRepository(database),
    getAuthorRepository: () => getAuthorRepository(database),
    getLibraryRepository: () => getLibraryRepository(database),
    getBookShelfRepository: () => getBookShelfRepository(database),
  };
}
