import { Types } from "mongoose";
//------- states of active status--------//
export enum EventStatuses {
  Active = "active",
  Inactive = "inactive",
}
//---------Event Entity------------------//
export interface IEvent {
  name: string;
  discount: Float16Array;
  coursesEligible?: Types.ObjectId[];
  timeStart: Date;
  timeEnd: Date;
  maxVoucherQuantity: number;
  active: string;
}
