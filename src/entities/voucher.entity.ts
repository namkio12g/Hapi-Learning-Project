import { Types } from "mongoose";

export interface IVoucher {
  eventApplied?: Types.ObjectId;
  code: string;
  isUsed: false;
}
