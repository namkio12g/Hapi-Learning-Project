import { sendEmail } from "../untils";
import { sendingVoucherByEmailQueue } from "./queues";

sendingVoucherByEmailQueue.process("sendingVoucherByEmail", async (job) => {
  await sendEmail(job.data.email, job.data.voucherCode);
  console.log("sending email to ", job.data.email, job.data.voucherCode);
});
