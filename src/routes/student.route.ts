import StudentController from "../controller/student.controller";
import { Server } from "@hapi/hapi";
const StudentRoutes = (server: Server) => {
  server.route([
    {
      method: "get",
      path: "/user/{id}",
      handler: (request, reply) => {
        console.log(request.params.id);
        return StudentController.geStudents();
      },
    },
    {
      method: "post",
      path: "/create-user",
      handler: (request, reply) => {
        console.log(request.payload);
        return StudentController.geStudents();
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
    {
      method: "get",
      path: "/users",
      handler: (request, reply) => {},
    },
  ]);
};
export default StudentRoutes;
