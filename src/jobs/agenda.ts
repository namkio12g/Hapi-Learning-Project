import EnvConfig from "../config/envConfig";
import Agenda from "agenda";
import { DbConnection } from "../config/dbConnect";
const dbUri = EnvConfig.dbUri || "";
const agenda = new Agenda({
  db: { address: dbUri, collection: "agendaChecking" },
});
//-----------------define an agenda schedule----------------///
agenda.define("checking mongoDB", async () => {
  try {
    const isDbConnected = await DbConnection.ping();
    if (isDbConnected) console.log("DB connection is fine!");
    else console.log("DB connection is lost");
  } catch (error) {
    console.error("DB connection checking err", error);
  }
});
//---------every minute start the schedule------------////
agenda.on("ready", async () => {
  await agenda.start();
  await agenda.every("1 minute", "checking mongoDB");
  console.log("schedule to run every one minute");
});
agenda.on("error", (err) => {
  console.error("agenda checking err", err);
});

export { agenda };
