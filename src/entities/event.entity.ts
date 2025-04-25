import { Types } from "mongoose";

export interface IEvent {
  name: string;
  discount: Float16Array;
  coursesEligible?: Types.ObjectId[];
  timeStart: Date;
  timeEnd: Date;
  maxVoucherQuantity: number;
  voucher?: Types.ObjectId;
}
