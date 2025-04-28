import AuthController from "../controller/auth.controller";
import CustomJoi from "../untils/customJoi";
import { Server } from "@hapi/hapi";
const AuthRoutes = (server: Server) => {
  server.route([
    {
      method: "post",
      path: "/auth/login",
      options: {
        tags: ["api"],
        auth: false,
        validate: {
          payload: CustomJoi.object({
            email: CustomJoi.string().email().required(),
            password: CustomJoi.string().required(),
          }),
        },
        response: {
          //   status: {
          //     200: CustomJoi.object({
          //       token: CustomJoi.string().example("safsdisddfsdffh12312312"),
          //     }),
          //   },
        },
        handler: AuthController.login,
      },
    },
    // {
    //   method: "post",
    //   path: "/auth/logout",
    //   options: {
    //     tags: ["api"],
    //     validate: {
    //       payload: CustomJoi.object({
    //         id: CustomJoi.object({
    //           email: CustomJoi.string().email().required(),
    //           password: CustomJoi.string().required(),
    //         }),
    //       }),
    //     },
    //     response: {
    //       status: {
    //         200: CustomJoi.object({
    //           token: CustomJoi.string().example("safsdisddfsdffh12312312"),
    //         }),
    //       },
    //     },
    //     handler: {},
    //   },
    // },
  ]);
};
export default AuthRoutes;
