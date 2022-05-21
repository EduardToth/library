import { Schema } from "mongoose";

export interface BookDAO {
  _id: string;
  title: string;
  numberOfPages: number;
  authorId: string;
  bookShelfId: string;
}

export const bookDAOSchema = new Schema<BookDAO>({
  _id: { type: String, required: true },
  authorId: { type: String, required: true },
  numberOfPages: { type: Number, required: true },
  title: { type: String, required: true },
  bookShelfId: { type: String, required: true },
});
