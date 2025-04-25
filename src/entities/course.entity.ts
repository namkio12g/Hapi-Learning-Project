import { Types } from "mongoose";
export enum CourseLevel {
  Foundation = "foundation",
  Intermediate = "intermediate",
  Advanced = "advanced",
}
export interface ICourse {
  name: string;
  level: string;
  timeStart?: Date;
  timeEnd: Date;
  price: number;
  teacher?: Types.ObjectId;
  studentsCount?: number;
}
