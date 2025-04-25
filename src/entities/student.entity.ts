import { Types } from "mongoose";
import { IPerson } from "./person.entity";
export interface IStudent extends IPerson {
  learningCourse?: Types.ObjectId;
  wallet: number;
}
