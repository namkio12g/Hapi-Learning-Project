import mongoose from "mongoose";

export interface IAjustClass {
  classId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
}
