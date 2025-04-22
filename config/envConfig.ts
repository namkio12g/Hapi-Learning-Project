import dotenv from "dotenv";
dotenv.config();
console.log("hello", process.env.HOST);
const EnvConfig = {
    host: process.env.HOST || "localhost",
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
};
export default EnvConfig;
