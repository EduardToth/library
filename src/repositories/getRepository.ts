import mongoose from "mongoose";
import { getAuthorRepository } from "./getAuthorRepository";
import { getBookRepository } from "./getBookRepository";

export function getRepository(database: typeof mongoose) {
  return {
    getBookRepository: () => getBookRepository(database),
    getAuthorRepository: () => getAuthorRepository(database),
  };
}
