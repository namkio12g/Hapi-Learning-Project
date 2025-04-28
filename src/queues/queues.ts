import Queue from "bull";
import EnvConfig from "../config/envConfig";

if (!EnvConfig.redisUri) {
  throw new Error("REDIS_URL is not defined");
}
//--------------Create a queue for sending mails------------------///
const sendingVoucherByEmailQueue = new Queue(
  "checking-voucher-queue",
  EnvConfig.redisUri
);
//--------------Create a queue for processing editable eventse------------------///

const checkingEditEventQueue = new Queue(
  "checking-edit-event-queue",
  EnvConfig.redisUri
);

export { checkingEditEventQueue, sendingVoucherByEmailQueue };
