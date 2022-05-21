import { StringNullableChain } from "lodash";
import { BookShelf } from "./bookShelf";

export interface Library {
  id: string;
  name: string;
  bookShelves: BookShelf[];
}
