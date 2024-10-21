import { response } from "express";
import { AuthController } from "./auth.v1.controller";

const registerReqBody = {
  body: {
    name: "test11",
    email: "test11@mail.com",
    password: "TesteandoEstoxd32+",
    nickName: "test11",
    country: "CO",
  },
};

const registerResBody = {
  status: jest.fn(x => x),
  formatResponse: jest.fn(x => x),
};

it("Should send a status code of 201 if user was created succesfully", async (registerReqBody, {}) => {
  //  mock request and response objects
  // in case of orm import the schema
  // mock userFindOne function jest.mock("pathToDBFunctions", () => ({ userFindOne: jest.fn() }));
  // assertions
  await AuthController.register(registerReqBody, registerResBody);
  // if was created successfully
  expect(response.status).toHaveBeenCalledWith(200);
  expect(response.formatResponse).toHaveBeenCalledTimes(1);
  // if was not created
  // when user already exists
  // always mock your dependcies (db functions, services, helpers, etc)
});

it("Should send a status code of 400 if user was not created", async (registerReqBody, {}) => {});
