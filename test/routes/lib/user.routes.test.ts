import { SuperTest, Test } from "supertest";
import { MockDataHelper, data } from "../../mock";

jest.setTimeout(30000);

describe("User Test", () => {
  let supertest: SuperTest<Test>, mh: MockDataHelper, token: string;

  beforeAll(async done => {
    mh = new MockDataHelper();
    supertest = await mh.connect();
    done();
  });

  beforeEach(async () => {
    token = await mh.getToken();
  });

  test("#POST - User without auth", async () => {
    const result = await supertest.post("/user").send({});

    expect(result.status).toEqual(403);
    expect(result.clientError).toEqual(true);
    expect(result.error.text).toEqual("Forbidden");
  });

  test("#POST - User with invalid auth", async () => {
    token = "test" + (await mh.getToken());
    const result = await supertest.post("/user").send({});

    expect(result.status).toEqual(403);
    expect(result.clientError).toEqual(true);
    expect(result.error.text).toEqual("Forbidden");
  });

  test("#POST - User without body", async () => {
    const result = await supertest
      .post("/user")
      .send({})
      .set("Content-Type", "application/json")
      .set("Authorization", token);

    expect(result.status).toEqual(400);
    expect(result.clientError).toEqual(true);
    expect(JSON.parse(result.error.text)).toEqual({ message: "Body is empty!" });
  });

  test("#POST - User without name", async () => {
    const result = await supertest
      .post("/user")
      .send({ password: "test", account_type: "test" })
      .set("Content-Type", "application/json")
      .set("Authorization", token);

    expect(result.status).toEqual(400);
    expect(result.clientError).toEqual(true);
    expect(JSON.parse(result.error.text)).toEqual({ message: "Name is empty!" });
  });

  test("#POST - User without password", async () => {
    const result = await supertest
      .post("/user")
      .send({ name: "test", account_type: "test" })
      .set("Content-Type", "application/json")
      .set("Authorization", token);

    expect(result.status).toEqual(400);
    expect(result.clientError).toEqual(true);
    expect(JSON.parse(result.error.text)).toEqual({ message: "Password is empty!" });
  });

  test("#POST - User without account_type", async () => {
    const result = await supertest
      .post("/user")
      .send({ name: "test", password: "test" })
      .set("Content-Type", "application/json")
      .set("Authorization", token);

    expect(result.status).toEqual(400);
    expect(result.clientError).toEqual(true);
    expect(JSON.parse(result.error.text)).toEqual({ message: "Account Type is empty!" });
  });

  test("#POST - Add user", async () => {
    const result = await supertest
      .post("/user")
      .send({ ...data.user })
      .set("Content-Type", "application/json")
      .set("Authorization", token);

    expect(result.status).toEqual(200);
    expect(result.body.data).toEqual({ ...data.user });
    expect(result.body.message).toEqual("Added User!");
  });

  test("#POST - Duplicate user", async () => {
    const result = await supertest
      .post("/user")
      .send({ ...data.user })
      .set("Content-Type", "application/json")
      .set("Authorization", token);

    expect(result.status).toEqual(400);
    expect(result.body.message).toEqual("User already exist!");
  });

  test("#POST - Add another user", async () => {
    const result = await supertest
      .post("/user")
      .send({ ...data.user, _id: "5cc5472722fc6d096f24b8fd" })
      .set("Content-Type", "application/json")
      .set("Authorization", token);

    expect(result.status).toEqual(200);
    expect(result.body.data).toEqual({ ...data.user, _id: "5cc5472722fc6d096f24b8fd" });
    expect(result.body.message).toEqual("Added User!");
  });

  test("#LOGIN - w/o body", async () => {
    const result = await supertest.post("/user/login");

    expect(result.status).toEqual(400);
    expect(result.body.message).toEqual("Body is empty!");
  });

  test("#LOGIN - w/o name", async () => {
    const result = await supertest
      .post("/user/login")
      .set("Content-Type", "application/json")
      .send({ password: "test" });

    expect(result.status).toEqual(400);
    expect(result.body.message).toEqual("Name is empty!");
  });

  test("#LOGIN - w/o password", async () => {
    const result = await supertest
      .post("/user/login")
      .set("Content-Type", "application/json")
      .send({ name: "test" });

    expect(result.status).toEqual(400);
    expect(result.body.message).toEqual("Password is empty!");
  });

  test("#LOGIN - w/ incorrect name", async () => {
    const result = await supertest
      .post("/user/login")
      .set("Content-Type", "application/json")
      .send({ name: "", password: "test" });

    expect(result.status).toEqual(400);
    expect(result.body.message).toEqual("Incorrect username and password!");
  });

  test("#LOGIN - w/ incorrect password", async () => {
    const result = await supertest
      .post("/user/login")
      .set("Content-Type", "application/json")
      .send({ name: "test", password: "" });

    expect(result.status).toEqual(400);
    expect(result.body.message).toEqual("Incorrect username and password!");
  });

  test("#LOGIN - w/ correct name and password", async () => {
    const data = { name: "test", password: "test" };
    const result = await supertest
      .post("/user/login")
      .set("Content-Type", "application/json")
      .send({ ...data });

    const token = await mh.generateToken({ ...data });
    expect(result.status).toEqual(200);
    expect(result.body.message).toEqual("You are login");
    expect(result.body.token).toBeDefined();
    expect(result.body.token).toEqual(token);
  });

  test("#GET - all users without auth", async () => {
    const result = await supertest.get("/user");

    expect(result.status).toEqual(403);
    expect(result.clientError).toEqual(true);
    expect(result.error.text).toEqual("Forbidden");
  });

  test("#GET - all users", async () => {
    const result = await supertest.get("/user").set("Authorization", token);

    expect(result.status).toEqual(200);
    expect(result.body.length).toEqual(2);
    expect(result.body[0]).toEqual({ ...data.user });
    expect(result.body[1]).toEqual({ ...data.user, _id: "5cc5472722fc6d096f24b8fd" });
  });

  test("#GET - one user w/o auth", async () => {
    const result = await supertest.get("/user/5cc5472722fc6d096f24b8fd");

    expect(result.status).toEqual(403);
    expect(result.clientError).toEqual(true);
    expect(result.error.text).toEqual("Forbidden");
  });

  test("#GET - one user wrong id", async () => {
    const id = "5cc5472722fc6d096f24bxxx";
    const result = await supertest.get(`/user/${id}`).set("Authorization", token);

    expect(result.body.message).toEqual(`User "${id}" not found!`);
  });

  test("#GET - one user", async () => {
    const result = await supertest.get("/user/5cc5472722fc6d096f24b8fd").set("Authorization", token);

    expect(result.body).toEqual({ ...data.user, _id: "5cc5472722fc6d096f24b8fd" });
  });

  test("#Patch - Update with incorrect ID", async () => {
    const id = "5cc5472722fc6d096f24bxxx";
    const test = { ...data.user, _id: "5cc5472722fc6d096f24b8fd", name: "updated" };
    const result = await supertest
      .patch(`/user/${id}`)
      .send(test)
      .set("Content-Type", "application/json")
      .set("Authorization", token);
    console.log(result.body);

    expect(result.status).toEqual(400);
    expect(result.body.message).toEqual("Path _id with value of 5cc5472722fc6d096f24bxxx is not valid property!");
  });

  test("#Patch - Update one user", async () => {
    const id = "5cc5472722fc6d096f24b8fd";
    const test = { ...data.user, _id: "5cc5472722fc6d096f24b8fd", name: "updated" };
    const result = await supertest
      .patch(`/user/${id}`)
      .send(test)
      .set("Content-Type", "application/json")
      .set("Authorization", token);

    expect(result.status).toEqual(200);
    expect(result.body.data).toEqual({ ...test });
    expect(result.body.message).toEqual("Updated User!");
  });

  test("#Delete - single document w/o auth", async () => {
    const result = await supertest.delete("/user/5cc5472722fc6d096f24b8fa").set("Content-Type", "application/json");

    expect(result.status).toEqual(403);
    expect(result.clientError).toEqual(true);
    expect(result.error.text).toEqual("Forbidden");
  });

  test("#Delete - single user wrong ID", async () => {
    const id = "5cc5472722fc6d096f24bfff";
    const result = await supertest
      .delete(`/user/${id}`)
      .set("Content-Type", "application/json")
      .set("Authorization", token);

    expect(result.status).toEqual(404);
    expect(result.body.message).toEqual(`Can't delete ID of ${id} because its not exist!`);
  });

  test("#Delete - single user", async () => {
    const result = await supertest
      .delete("/user/5cc5472722fc6d096f24b8fa")
      .set("Content-Type", "application/json")
      .set("Authorization", token);

    expect(result.status).toEqual(200);
  });

  test("#Delete - another user", async () => {
    const result = await supertest
      .delete("/user/5cc5472722fc6d096f24b8fd")
      .set("Content-Type", "application/json")
      .set("Authorization", token);

    expect(result.status).toEqual(200);
  });
});
