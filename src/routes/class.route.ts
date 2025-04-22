import ClassController from "../controller/class.controller";
import { Server } from "@hapi/hapi";
const ClassRoutes = (server: Server) => {
  server.route([
    // {
    //   method: "get",
    //   path: "/user/{id}",
    //   handler: (request, reply) => {
    //     console.log(request.params.id);
    //     return StudentController.geStudents();
    //   },
    // },
    {
      method: "post",
      path: "/class/create-class",
      handler: async (request, reply) => {
        const payload = request.payload;
        console.log(payload);
        const res = await ClassController.createNewClass("name", "lop");
        console.log(res);
        return res;
      },
    },
    // {
    //   method: "get",
    //   path: "/user/{id}",
    //   handler: (request, reply) => {
    //     console.log(request.params.id);
    //     return StudentController.geStudents();
    //   },
    // },
    // {
    //   method: "get",
    //   path: "/user/{id}",
    //   handler: (request, reply) => {
    //     console.log(request.params.id);
    //     return StudentController.geStudents();
    //   },
    // },
    // {
    //   method: "get",
    //   path: "/users",
    //   handler: (request, reply) => {},
    // },
  ]);
};
export default ClassRoutes;
