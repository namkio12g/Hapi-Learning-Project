import mongoose, { Types } from "mongoose";
import { ICourse, CourseLevel } from "../entities/course.entity";
export interface ICourseDocument extends ICourse, mongoose.Document {}
const CourseSchema: mongoose.Schema<ICourseDocument> =
  new mongoose.Schema<ICourseDocument>({
    name: { type: String, required: true },
    level: { type: String, required: true, enum: Object.values(CourseLevel) },
    timeStart: { type: Date, required: true, default: Date.now },
    timeEnd: { type: Date, required: true },
    teacher: { type: Types.ObjectId, ref: "teacher", default: null },
    price: { type: Number, default: 0 },
    studentsCount: { type: Number, default: 0 },
  });

export const CourseModel: mongoose.Model<ICourseDocument> =
  mongoose.model<ICourseDocument>("course", CourseSchema);
