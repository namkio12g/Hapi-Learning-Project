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

export const requestEditEventJob = async (eventId: string, userId: string) => {
  try {
    const job = await checkingEditEventQueue.add("requestEditEvent", {
      eventId: eventId,
      userId: userId,
    });
    return job.finished();
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};
export const releaseEditEventJob = async (eventId: string, userId: string) => {
  try {
    const job = await checkingEditEventQueue.add("releaseEditEvent", {
      eventId: eventId,
      userId: userId,
    });
    return job.finished();
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};
export const maintainEditEventJob = async (eventId: string, userId: string) => {
  try {
    const job = await checkingEditEventQueue.add("maintainEditEvent", {
      eventId: eventId,
      userId: userId,
    });
    return job.finished();
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};
