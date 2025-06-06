import * as dotenv from "dotenv";
dotenv.config();
console.log("hello", process.env.HOST);
const EnvConfig = {
  host: process.env.HOST || "localhost",
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  dbUri: process.env.MONGODBURI,
  redisUri: process.env.REDISURI,
  emailServiceUser: process.env.EMAIL_SERVICE_USER,
  emailServicePass: process.env.EMAIL_SERVICE_PASS,
};
export default EnvConfig;
