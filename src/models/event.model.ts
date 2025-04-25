import mongoose, { Types } from "mongoose";
import { IEvent } from "../entities/event.entity";
export interface IEventDocument extends IEvent, mongoose.Document {}
const EventSchema: mongoose.Schema<IEventDocument> =
  new mongoose.Schema<IEventDocument>({
    name: { type: String, required: true },
    discount: { type: Float16Array, required: true },
    coursesEligible: [{ type: Types.ObjectId, ref: "course", default: [] }],
    timeStart: { type: Date, required: true, default: Date.now },
    timeEnd: { type: Date, required: true },
    maxVoucherQuantity: { type: Number, required: true },
    voucher: { type: Types.ObjectId, ref: "voucher", default: null },
  });

export const EventModel: mongoose.Model<IEventDocument> =
  mongoose.model<IEventDocument>("event", EventSchema);
