import dotenv from "dotenv";
dotenv.config();

const env = process.env;

export = {
  IS_DEV: env.environment,
  PORT: env.PORT || 3333,
  SECRET: env.SECRET_KEY || "SECRET_KEY"
};
