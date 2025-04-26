import Boom from "@hapi/boom";
import { VoucherModel, EventModel } from "../models/index";

export const VoucherService = {
  async getVoucherById(voucherId: string) {
    try {
      const res = await VoucherModel.findOne({ _id: voucherId });
      if (!res) throw Boom.notFound("Voucher not found");
      return res;
    } catch (error) {
      throw Boom.badRequest("Had an error at finding voucher");
    }
  },
};
