import mongoose from "mongoose";
import EnvConfig from "./envConfig";
const connectDb = async () => {
  try {
    const dbUri = EnvConfig.dbUri || "";
    await mongoose.connect(dbUri);
    console.log("Database Connected");
  } catch (error) {
    console.log("DB connection failed");
    process.exit(1);
  }
};
export default connectDb;
