import mongoose, { Types } from "mongoose";
import { ITeacher } from "../entities/teacher.entity";
export interface ITeacherDocument extends ITeacher, mongoose.Document {}
const TeacherSchema: mongoose.Schema<ITeacherDocument> =
  new mongoose.Schema<ITeacherDocument>({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    gender: { type: String, required: true },
    phone: { type: String, required: true },
    teachingCourse: { type: Types.ObjectId, ref: "course" },
  });

export const TeacherModel: mongoose.Model<ITeacherDocument> =
  mongoose.model<ITeacherDocument>("teacher", TeacherSchema);
