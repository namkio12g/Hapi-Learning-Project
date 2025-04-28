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
  retryTime: number = 3 // how many times to retry the request
) {
  for (let i = 0; i < retryTime; i++) {
    const session = await mongoose.startSession();// start the session
    try {
      session.startTransaction({
        readConcern: { level: "majority" }, // Start a transaction and use options to boost synchronous read and write performance in the database
        writeConcern: { w: "majority" }, 
      });
      const result = await transactionFn(session);// run the call back
      session.commitTransaction(); // commit transaction
      return result;
      console.log(
        "Transaction for creating a new voucher completed successfully"
      );
    } catch (err: any) {
      await session.abortTransaction(); // re roll the commit
      session.endSession();// end session

      //check if the error is TransientTransactionError or UnknownTransactionCommitResul, retry the transaction
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
