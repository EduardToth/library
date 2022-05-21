import { Schema } from "mongoose";

export interface LibraryDAO {
  _id: string;
  name: string;
  bookShelfIds: string[];
}

export const libraryDAOSchema = new Schema<LibraryDAO>({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  bookShelfIds: [{ type: String, required: true }],
});
