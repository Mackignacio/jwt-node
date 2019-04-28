import express from "express";
import mongoose, { connect } from "mongoose";
import bodyParser from "body-parser";
import { Routes } from "./routes";
import bluebird from "bluebird";
mongoose.Promise = bluebird;
require("dotenv").config();

const app = express();
const port = process.env.PORT;
const connectionString = process.env.MONGO_URL_TEST || process.env.MONGO_URL || "";
const routes = new Routes(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

routes.setRoutes();

function getConnection() {
  return mongoose.connect(connectionString, { useNewUrlParser: true });
}

getConnection().then(() =>
  app.listen(port, () => {
    console.log("Listening at port " + port);
  })
);
