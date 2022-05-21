import { Schema } from "mongoose";

export interface AuthorDAO {
  _id: string;
  name: string;
  bookIds: string[];
}

export const authorDAOSchema = new Schema<AuthorDAO>({
  _id: { type: String, required: true },
  bookIds: [{ type: String, required: true }],
  name: { type: String, required: true },
});
