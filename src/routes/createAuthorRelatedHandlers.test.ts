import { StatusCodes } from "http-status-codes";
import { omit } from "lodash";
import { Author } from "../domain";
import { createAuthorRelatedHandlers } from "./createAuthorRelatedHandlers";
import { AuthorContent as AuthorContentDTO } from "./generated";
import { createContext } from "./testHelpers/createContextMock";
import { createResponseMock } from "./testHelpers/createResponseMock";
import { getAuthorServiceMock } from "./testHelpers/getAuthorServiceMock";
import { v4 } from "uuid";

describe("insertion", () => {
  let {
    responseMocks: { jsonMock, sendMock, statusMock },
    response,
  } = createResponseMock();

  beforeEach(() => {
    jest.resetAllMocks();
    const newResponseMock = createResponseMock();
    jsonMock = newResponseMock.responseMocks.jsonMock;
    sendMock = newResponseMock.responseMocks.sendMock;
    statusMock = newResponseMock.responseMocks.statusMock;
    response = newResponseMock.response;
  });

  test("success", async () => {
    // Arrange
    const authorServiceMock: ReturnType<typeof getAuthorServiceMock> = {
      ...getAuthorServiceMock(),
      createAuthor: async (author: Author) => Promise.resolve(author),
    };
    const handlers = createAuthorRelatedHandlers(authorServiceMock);
    const authorContent: AuthorContentDTO = {
      name: "Edy",
    };
    const context = createContext({ request: { requestBody: authorContent } });

    // Act
    await handlers.createAuthor(context, response);

    // Assert
    expect(statusMock).toHaveBeenCalledWith(StatusCodes.CREATED);
    expect(jsonMock).toBeCalledWith({
      id: expect.any(String),
      ...authorContent,
      booksWritten: [],
    });
  });
});
