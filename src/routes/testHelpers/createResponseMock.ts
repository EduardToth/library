import { Response } from "express";

export function createResponseMock() {
  const responseMocks = {
    jsonMock: jest.fn(),
    statusMock: jest.fn(),
    sendMock: jest.fn(),
    locationMock: jest.fn(),
    sendStatusMock: jest.fn(),
    redirectMock: jest.fn(),
  };
  const response = {
    json: responseMocks.jsonMock,
    status: responseMocks.statusMock,
    send: responseMocks.sendMock,
    location: responseMocks.locationMock,
    sendStatus: responseMocks.sendStatusMock,
    redirect: responseMocks.redirectMock,
  } as unknown as Response;

  responseMocks.statusMock.mockImplementation(() => response);
  responseMocks.sendStatusMock.mockImplementation(() => response);

  return { responseMocks, response };
}
