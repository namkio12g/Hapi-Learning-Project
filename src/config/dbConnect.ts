import mongoose from "mongoose";
import EnvConfig from "./envConfig";
let dbConnection: mongoose.Connection;

export const DbConnection = {
  async connectDb() {
    try {
      const dbUri = EnvConfig.dbUri || "";
      await mongoose.connect(dbUri);
      dbConnection = mongoose.connection;
      console.log("Database Connected");
    } catch (error) {
      console.log("DB connection failed");
      process.exit(1);
    }
  },
  async ping() {
    if (!dbConnection) {
      throw new Error("No db connection");
    }
    try {
      const res = await dbConnection.db?.admin().ping();
      if (res && res.ok == 1) return res;
      else throw new Error("Connection lost");
    } catch (error) {
      throw new Error("Connection lost");
    }
  },
};
