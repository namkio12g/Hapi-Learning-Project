import Boom, { badRequest, boomify } from "@hapi/boom";
import EnvConfig from "../config/envConfig";
import { sendEmail } from "../untils";
import { sendingVoucherByEmailQueue, checkingEditEventQueue } from "./queues";
import Redis from "ioredis";
const redis = new Redis(EnvConfig.redisUri || "");
sendingVoucherByEmailQueue.process("sendingVoucherByEmail", async (job) => {
  await sendEmail(job.data.email, job.data.voucherCode);
  console.log("sending email to ", job.data.email, job.data.voucherCode);
});

//------- request a edit event ----------//
checkingEditEventQueue.process("requestEditEvent", async (job) => {
  const lockKey = `lock:event:${job.data.eventId}`;   //create lock key
  const result = await redis.set(lockKey, job.data.userId, "EX", 300, "NX"); // set the key with and value is the userID ,expired time is 300 seconds
  if (result == null) { // if it have already set, it would return null
    const userID = await redis.get(lockKey);// get userID
    if (userID === job.data.userId)// compare userID in request with the userID in redis  
      return { status: 200, message: "you are the owner of the event" };
    throw boomify(new Error("you are not the owner of the event"), {
      statusCode: 409,
    });
  }
  return { status: 200, message: "you now start editing the event" };
});
//---------------------------maintain the edit time-----------------///
checkingEditEventQueue.process("maintainEditEvent", async (job) => {
  const lockKey = `lock:event:${job.data.eventId}`;
  const userID = await redis.get(lockKey);
  if (userID == null) throw badRequest("the event is not editing now");
  if (userID !== job.data.userId)
    throw boomify(new Error("you are not the owner of the event"), {
      statusCode: 409,
    });
  await redis.expire(lockKey, 300);
  return { status: 200, message: "maintaining the event edit successfully" };
});
//---------------------------Release-----------------///
checkingEditEventQueue.process("releaseEditEvent", async (job) => {
  const lockKey = `lock:event:${job.data.eventId}`;
  const userID = await redis.get(lockKey);
  if (userID == null) throw badRequest("the event is not editing now");
  if (userID !== job.data.userId)
    throw boomify(new Error("you are not the owner of the event"), {
      statusCode: 409,
    });
  await redis.del(lockKey);
  return { status: 200, message: "releasing the event edit successfully" };
});
