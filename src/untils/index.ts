import mongoose, { ClientSession } from "mongoose";
import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "toilanam12309@gmail.com",
    pass: "iyqgirgkqjihstiw",
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
      session.startTransaction();
      const result = await transactionFn(session);
      session.commitTransaction();
      return result;
      console.log(
        "Transaction for creating a new voucher completed successfully"
      );
    } catch (err: any) {
      console.error("Transaction failed:", err);
      await session.abortTransaction();
      session.endSession();
      if (
        err.hasErrorLabel?.("TransientTransactionError") ||
        err.hasErrorLabel?.("UnknownTransactionCommitResult")
      ) {
        console.log("Retrying transaction...");
        continue;
      }
      console.log("Retry Transaction failed with error:", err);
      throw err;
    }
  }
}
