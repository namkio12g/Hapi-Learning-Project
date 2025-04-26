import { sendingVoucherByEmailQueue, checkingEditEventQueue } from "./queues";

export const sendVoucherByEmailJob = async (
  email: string,
  voucherCode: string
) => {
  return sendingVoucherByEmailQueue.add("sendingVoucherByEmail", {
    email: email,
    voucherCode: voucherCode,
  });
};
export const addEditEventJob = async (eventId: string) => {
  return checkingEditEventQueue.add("checkingEditEvent", {
    eventId: eventId,
  });
};
