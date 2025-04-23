import ClassController from "../controller/class.controller";
import { Server } from "@hapi/hapi";
const ClassRoutes = (server: Server) => {
  server.route([
    {
      method: "get",
      path: "/class/{id}",
      handler: (request, reply) => {
        const classId = request.params.id;
        return ClassController.getOneClass(classId);
      },
    },
    {
      method: "get",
      path: "/class/get-classes",
      handler: (request, reply) => {
        return ClassController.getClasses(request);
      },
    },
    {
      method: "post",
      path: "/class/create-class",
      handler: (request, reply) => {
        return ClassController.createNewClass(request);
      },
    },
    {
      method: "patch",
      path: "/class/update-class",
      handler: (request, reply) => {
        return ClassController.updateClass(request);
      },
    },

    {
      method: "delete",
      path: "/class/delete/{id}",
      handler: (request, reply) => {
        const classId = request.params.id;
        return ClassController.deleteClassById(classId);
      },
    },
    {
      method: "delete",
      path: "/class/delete/delete-class",
      handler: (request, reply) => {
        return ClassController.deleteClass(request);
      },
    },
    {
      method: "get",
      path: "/class/get-students/{id}",
      handler: (request, reply) => {
        return ClassController.getStudents(request.params.id);
      },
    },
  ]);
};
export default ClassRoutes;
