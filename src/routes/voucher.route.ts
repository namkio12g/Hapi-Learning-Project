import CustomJoi from "../utility/customJoi";
import { JoiSchemas } from "../utility/JoiSchema";
import VoucherController from "../controller/voucher.controller";
import { Server } from "@hapi/hapi";
const VoucherRoutes = (server: Server) => {
  server.route([
    {
      method: "get",
      path: "/voucher/{id}",
      options: {
        tags: ["api"],
        validate: {
          params: CustomJoi.object({
            id: JoiSchemas.ObjectIdInput.required(),
          }),
        },
        response: {
          status: {
            200: JoiSchemas.VoucherSchema,
          },
        },
        handler: VoucherController.getOneVoucher,
      },
    },
    {
      method: "post",
      path: "/voucher/update-voucher/{id}",
      options: {
        tags: ["api"],
        validate: {
          payload: CustomJoi.object({
            voucherId: JoiSchemas.ObjectIdInput.required(),
            quantity: CustomJoi.number().required().min(0),
          }),
        },
        response: {
          status: {
            200: JoiSchemas.VoucherSchema,
          },
        },
        handler: VoucherController.updateVoucher,
      },
    },
  ]);
};
export default VoucherRoutes;
