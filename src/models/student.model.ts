import mongoose from "mongoose";
import { IStudent } from "../entities/student.entity";
export interface IStudentDocument extends IStudent, mongoose.Document {}
const StudentSchema = new mongoose.Schema({
  name: { type: String, require: true },
  age: { type: Number, require: true },
  grade: { type: Number, require: true },
  address: { type: String },
  gender: { type: String, require: true },
  class: { type: [mongoose.Schema.Types.ObjectId], ref: "Class", default: [] },
});
export const StudentModel = mongoose.model<IStudentDocument>(
  "Student",
  StudentSchema
);
