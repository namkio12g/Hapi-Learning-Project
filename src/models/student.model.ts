import mongoose, { Types } from "mongoose";
import { IStudent } from "../entities/student.entity";
import { GenderTypes } from "../entities/person.entity";
export interface IStudentDocument extends IStudent, mongoose.Document {}
const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  email: { type: String, required: true },
  address: { type: String, default: "" },
  gender: { type: String, required: true, enum: Object.values(GenderTypes) },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  learningCourse: { type: Types.ObjectId, ref: "course", default: null },
  wallet: { type: Number, default: 0 },
});
export const StudentModel = mongoose.model<IStudentDocument>(
  "student",
  StudentSchema
);
