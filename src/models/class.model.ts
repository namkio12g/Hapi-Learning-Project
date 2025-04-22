import mongoose from "mongoose";
import { IClass } from "../entities/class.entity";
export interface IClassDocument extends IClass, mongoose.Document {}
const ClassSchema: mongoose.Schema<IClassDocument> =
  new mongoose.Schema<IClassDocument>({
    room: { type: String, required: true },
    studentCounts: { type: Number, default: 0 },
    subject: { type: String, require: 0 },
  });

export const ClassModel: mongoose.Model<IClassDocument> =
  mongoose.model<IClassDocument>("Class", ClassSchema);
