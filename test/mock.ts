import request, { SuperTest, Test } from "supertest";
import express, { Application } from "express";
import bodyParser from "body-parser";
import { connect } from "mongoose";
import { Routes } from "../src/routes";
import jwt from "../src/middleware/jwt";
import config from "../src/helper/config";

export class MockDataHelper {
  constructor() {}

  async connect() {
    const app: Application = express();
    const connectionString = process.env.MONGO_URL_TEST || "";
    const routes = new Routes(app);

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    routes.setRoutes();
    app.set(
      "mongoConnection",
      connect(
        connectionString,
        { useNewUrlParser: true }
      )
    );
    return request(app);
  }

  async getToken(name: string = "test", password: string = "test"): Promise<string> {
    return `Bearer ${await jwt.generateToken({ name, password }, config.SECRET, "30s")}`;
  }
  async generateToken(data: object) {
    return jwt.generateToken({ ...data }, config.SECRET, "30s");
  }
}

const user = {
  _id: "5cc5472722fc6d096f24b8fa",
  name: "test",
  account_type: "admin",
  password: "test",
  DateCreated: "2019-04-28T06:24:39.889Z",
  DateUpdated: "2019-04-28T06:24:39.889Z",
  __v: 0
};

export const data = { user };
/* 
const mongodbObj = { DateCreated: new Date("2019-04-26T19:09:40.444Z"), DateUpdated: new Date("2019-04-26T19:09:40.555Z"), __v: 0 },
  accounts = {
    _id: Types.ObjectId("5cc15486d98b2258ac4a97ff"),
    AccountId: "Mack",
    BusinessName: "Mack Software",
    Address: "143 Manila, PH",
    EmailAddress: "mack@gmail.com",
    FirstName: "Mack",
    LastName: "Ignacio",
    Status: "Active",
    IsEnabled: false,
    Activated: false,
    ...mongodbObj
  },
  kiosk = {
    Events: [],
    Mode: "Mobile",
    IsActivated: false,
    IsTurnedOn: true,
    IsScheduledForShutDown: false,
    IsShutdownByKiosk: false,
    Name: "ROM",
    Place: "ROM",
    Owner: "ROM",
    MachineId: "ROM",
    ApiKey: "racket-76018782-9711-4ae2-a9f0-febe614dbd5d",
    Account: Types.ObjectId("45d206ff8fba4b389336e434"),
    AccountId: "aaaanewtest",
    ...mongodbObj
  },
  kioskSetting = {
    Kiosk: Types.ObjectId("5c2e81ddc3deeb97ec2e9ff1"),
    Type: "Layout",
    Name: "M1-Settings",
    S3Link: { Key: "machines/5c4a18527953b56edc7fdadc/layouts/d1a413cb4cd1f08723398a968b1d8a86.png", ETag: "45d206ff8fba4b389336e434609fbe6b" },
    ...mongodbObj
  },
  events = {
    _id: Types.ObjectId("5c2e81ddc3deeb97ec2e9ff1"),
    Name: "Test Wedding Events",
    Description: "Test Wedding Events",
    ScheduleDate: new Date("2019-05-01T00:00:00.000Z"),
    StartTime: "00:00",
    EndTime: "23:59",
    Place: "Test Wedding Events",
    Status: "Draft",
    Kiosk: Types.ObjectId("5bd226adc3329b6c7e1c6071"),
    Layout: "Photobooth-TwoBlokes01-01.png",
    LayoutUrl: "https://kiosk-dev.racketstudios.com/layout/9684090591beb4ceccaf01be41a6096c.png",
    DateCreated: new Date("2019-04-26T19:09:40.444Z"),
    DateUpdated: new Date("2019-04-26T19:09:40.555Z"),
    __v: 0
  },
  songs = {
    SongName: "Dududu",
    ArtistName: "John Doe",
    UploadBy: "@rom",
    Date: new Date("2019-01-01"),
    Mp3: { Key: "5cbd317ae25294521cca346b/5cbd317ae25294521cca346b.mp3", ETag: "70c045393a462534cb75ab2a58f55d0a" },
    Cdg: { Key: "5cbd317ae25294521cca346b/5cbd317ae25294521cca346b.cdg", ETag: "70c045393a462534cb75ab2a58f55d0a" }
  };

export const MockData = { accounts, kiosk, kioskSetting, events, songs };
 */
