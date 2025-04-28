import mongoose, { ClientSession } from "mongoose";
import nodemailer from "nodemailer";
import EnvConfig from "../config/envConfig";
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: EnvConfig.emailServiceUser,
    pass: EnvConfig.emailServicePass,
  },
});
export async function sendEmail(to: string, voucherCode: string) {
  console.log("Sending email...");

  const mailOptions = {
    from: "I-Course",
    to: to,
    subject: `Hello from ${to}`,
    text: `Your ${voucherCode}`,
    html: `<b>Your voucher code is : ${voucherCode}</b>`,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log("✅ Message sent:", info.messageId);
  console.log("🔗 Preview it here:", nodemailer.getTestMessageUrl(info));
}
export async function retryTransaction<T>(
  transactionFn: (session: ClientSession) => Promise<T>,
  retryTime: number = 3
) {
  for (let i = 0; i < retryTime; i++) {
    const session = await mongoose.startSession();
    try {
      session.startTransaction({
        readConcern: { level: "majority" }, // Set readConcern here
        writeConcern: { w: "majority" }, // Optional: Set writeConcern
      });
      const result = await transactionFn(session);
      session.commitTransaction();
      return result;
      console.log(
        "Transaction for creating a new voucher completed successfully"
      );
    } catch (err: any) {
      await session.abortTransaction();
      session.endSession();

      if (
        err.hasErrorLabel?.("TransientTransactionError") ||
        err.hasErrorLabel?.("UnknownTransactionCommitResult")
      ) {
        console.log("Retrying transaction...");
        continue;
      }
      throw err;
    }
  }
}
