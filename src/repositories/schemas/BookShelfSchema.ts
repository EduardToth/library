import { Schema } from "mongoose";

export interface BookShelfDAO {
  _id: string;
  bookIds: string[];
  libraryId: string;
}

export const bookShelfDAOSchema = new Schema<BookShelfDAO>({
  _id: { type: String, required: true },
  bookIds: [{ type: String, required: true }],
  libraryId: { type: String, required: true },
});
