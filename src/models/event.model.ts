import mongoose, { Types } from "mongoose";
import { EventStatuses, IEvent } from "../entities/event.entity";
//---------create event document ------------//
export interface IEventDocument extends IEvent, mongoose.Document {}

//---------create event schema ------------//
const EventSchema: mongoose.Schema<IEventDocument> =
  new mongoose.Schema<IEventDocument>({
    name: { type: String, required: true },
    discount: { type: Number, required: true },
    coursesEligible: [{ type: Types.ObjectId, ref: "course", default: [] }],
    timeStart: { type: Date, required: true, default: Date.now },
    timeEnd: { type: Date, required: true },
    maxVoucherQuantity: { type: Number, required: true },
    active: {
      type: String,
      required: true,
      enum: Object.values(EventStatuses),
      default: "active",
    },
  });

export const EventModel: mongoose.Model<IEventDocument> =
  mongoose.model<IEventDocument>("event", EventSchema);
