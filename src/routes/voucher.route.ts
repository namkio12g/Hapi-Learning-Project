import CustomJoi from "../untils/customJoi";
import { JoiSchemas } from "../untils/JoiSchema";
import VoucherController from "../controller/voucher.controller";
import { Server } from "@hapi/hapi";
const VoucherRoutes = (server: Server) => {
  server.route([
    {
      method: "get",
      path: "/voucher/{id}",
      options: {
        tags: ["api"],
        auth: false,
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
  ]);
};
export default VoucherRoutes;
