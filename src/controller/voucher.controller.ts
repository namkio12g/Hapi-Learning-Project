import { Request } from "@hapi/hapi";
import { VoucherService } from "../services/voucher.service";
import { IUVoucherQuantity } from "../entities/types/UVoucherQuantity.types";
const VoucherController = {
  getOneVoucher(voucherId: string) {
    try {
      return VoucherService.getVoucherById(voucherId);
    } catch (error) {
      console.log(error);
    }
  },

  updateVoucher(request: Request) {
    try {
      const info = request.payload as IUVoucherQuantity;
      return VoucherService.updateVoucher(
        info.voucherId,
        info.eventId,
        info.quantity
      );
    } catch (error) {
      console.log(error);
    }
  },
};
export default VoucherController;
