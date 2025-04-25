import Boom from "@hapi/boom";
import { VoucherModel, EventModel } from "../models/index";

export const VoucherService = {
  async updateVoucher(
    voucherId: string,
    eventId: string,
    voucherQuantity: number
  ) {
    try {
      const eventObj = await EventModel.findById(eventId);
      if (!eventObj) throw Boom.notFound("The event of this voucher not found");
      if (eventObj.maxVoucherQuantity < voucherQuantity)
        throw Boom.notFound(
          "New quantity for the voucher was exceeded from the event"
        );
      const updatedVoucherObj = await VoucherModel.findByIdAndUpdate(
        voucherId,
        { $set: { quantity: voucherQuantity } },
        { new: true, runValidators: true }
      );
      if (!updatedVoucherObj) throw Boom.notFound("Voucher not found");
      return updatedVoucherObj;
    } catch (error) {
      throw Boom.badRequest("Had an error at updating voucher");
    }
  },

  async getVoucherById(voucherId: string) {
    try {
      const res = await VoucherModel.findOne({ _id: voucherId }).populate(
        "eventApplied",
        "_id name"
      );
      if (!res) throw Boom.notFound("Voucher not found");
      return res;
    } catch (error) {
      throw Boom.badRequest("Had an error at finding voucher");
    }
  },
};
