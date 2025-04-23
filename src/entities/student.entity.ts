import { Types } from "mongoose";
export interface IStudent {
  name: string;
  age: number;
  grade: number;
  address: string;
  gender: string;
  classes: Types.ObjectId[];
}
