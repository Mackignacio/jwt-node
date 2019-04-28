import request, { SuperTest, Test } from "supertest";
import express, { Application } from "express";
import mongoose, { connect } from "mongoose";
import { Routes } from "../../../src/routes";
import bluebird from "bluebird";
mongoose.Promise = bluebird;

require("dotenv").config(); // env

jest.setTimeout(30000);

describe("User Test", () => {
  let supertest: SuperTest<Test>, app: Application;

  beforeAll(async done => {
    app = express();
    const connectionString = process.env.MONGO_URL_TEST || "";
    const routes = new Routes(app);
    routes.setRoutes();
    app.set(
      "mongoConnection",
      connect(
        connectionString,
        { useNewUrlParser: true }
      )
    );

    supertest = request(app);
    done();
  });

  test("#POST - Users", async () => {
    const result = await supertest.post("/user").send({
      name: "jose",
      account_type: "user",
      password: "123"
    });
    console.log(result.error);

    expect(result.status).toEqual(403);
    expect(result.clientError).toEqual(true);
    expect(result.error.text).toEqual("Forbidden");
  });

  /*  test("#GET - Users", async () => {
    const result = await supertest.get("/user");
    console.log(result.body);

    expect(result.body).toEqual({ name: "john" });
  }); */
});
