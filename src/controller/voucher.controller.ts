import { Request, ResponseToolkit } from "@hapi/hapi";
import { VoucherService } from "../services/voucher.service";
import { IUVoucherQuantity } from "../entities/types/UVoucherQuantity.types";
const VoucherController = {
  getOneVoucher(request: Request, h: ResponseToolkit) {
    try {
      const voucherId = request.params.id;

      return VoucherService.getVoucherById(voucherId);
    } catch (error) {
      console.log(error);
    }
  },

  updateVoucher(request: Request, h: ResponseToolkit) {
    try {
      const info = request.payload as IUVoucherQuantity;
      return VoucherService.updateVoucher(info.voucherId, info.quantity);
    } catch (error) {
      console.log(error);
    }
  },
};
export default VoucherController;
