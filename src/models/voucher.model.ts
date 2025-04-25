import mongoose, { Types } from "mongoose";
import { IVoucher } from "../entities/voucher.entity";
export interface IVoucherDocument extends IVoucher, mongoose.Document {}
export interface IVoucherWithDiscount extends mongoose.Document {
  eventApplied: { discount: Float16Array };
  code: string;
  quantity: number;
}
const VoucherSchema: mongoose.Schema<IVoucherDocument> =
  new mongoose.Schema<IVoucherDocument>({
    eventApplied: { type: Types.ObjectId, ref: "event" },
    code: { type: String },
    quantity: { type: Number },
  });

export const VoucherModel: mongoose.Model<IVoucherDocument> =
  mongoose.model<IVoucherDocument>("voucher", VoucherSchema);
