import { Request, ResponseToolkit } from "@hapi/hapi";
import { VoucherService } from "../services/voucher.service";
const VoucherController = {
  getOneVoucher(request: Request, h: ResponseToolkit) {
    try {
      const voucherId = request.params.id;

      return VoucherService.getVoucherById(voucherId);
    } catch (error) {
      console.log(error);
    }
  },
};
export default VoucherController;
