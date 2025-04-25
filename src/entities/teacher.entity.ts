import { Types } from "mongoose";
import { IPerson } from "./person.entity";
export interface ITeacher extends IPerson {
  teachingCourse?: Types.ObjectId;
}
