import mongoose, { Types } from "mongoose";
import { EventStatuses, IEvent } from "../entities/event.entity";
export interface IEventDocument extends IEvent, mongoose.Document {}
const EventSchema: mongoose.Schema<IEventDocument> =
  new mongoose.Schema<IEventDocument>({
    name: { type: String, required: true },
    discount: { type: Number, required: true },
    coursesEligible: [{ type: Types.ObjectId, ref: "course", default: [] }],
    timeStart: { type: Date, required: true, default: Date.now },
    timeEnd: { type: Date, required: true },
    maxVoucherQuantity: { type: Number, required: true },
    voucher: { type: Types.ObjectId, ref: "voucher", default: null },
    active: {
      type: String,
      required: true,
      enum: Object.values(EventStatuses),
      default: "active",
    },
  });

export const EventModel: mongoose.Model<IEventDocument> =
  mongoose.model<IEventDocument>("event", EventSchema);
