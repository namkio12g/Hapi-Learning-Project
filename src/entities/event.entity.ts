import { Types } from "mongoose";
export enum EventStatuses {
  Active = "active",
  Inactive = "inactive",
}
export interface IEvent {
  name: string;
  discount: Float16Array;
  coursesEligible?: Types.ObjectId[];
  timeStart: Date;
  timeEnd: Date;
  maxVoucherQuantity: number;
  active: string;
}
