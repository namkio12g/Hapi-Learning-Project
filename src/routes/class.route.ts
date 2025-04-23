import Joi from "joi";
import ClassController from "../controller/class.controller";
import { Server } from "@hapi/hapi";
import { ObjectId } from "mongodb";
const ClassRoutes = (server: Server) => {
  server.route([
    {
      method: "get",
      path: "/class/{id}",
      options: {
        tags: ["api"],
        validate: {
          params: Joi.object({
            id: Joi.string()
              .pattern(/^[0-9a-fA-F]{24}$/)
              .required()
              .description("Enter the class id1")
              .example("507f1f77bcf86cd799439011"),
          }),
        },
        handler: (request, reply) => {
          const classId = request.params.id;
          return ClassController.getOneClass(classId);
        },
      },
    },
    {
      method: "get",
      path: "/class/get-classes",
      options: {
        tags: ["api"],
        handler: (request, reply) => {
          return ClassController.getClasses(request);
        },
      },
    },
    {
      method: "post",
      path: "/class/create-class",
      options: {
        tags: ["api"],
        handler: (request, reply) => {
          return ClassController.createNewClass(request);
        },
      },
    },
    {
      method: "patch",
      path: "/class/update-class",
      options: {
        tags: ["api"],
        handler: (request, reply) => {
          return ClassController.updateClass(request);
        },
      },
    },

    {
      method: "delete",
      path: "/class/delete/{id}",
      options: {
        tags: ["api"],
        handler: (request, reply) => {
          const classId = request.params.id;
          return ClassController.deleteClassById(classId);
        },
      },
    },
    {
      method: "delete",
      path: "/class/delete/delete-class",
      options: {
        tags: ["api"],
        handler: (request, reply) => {
          return ClassController.deleteClass(request);
        },
      },
    },
    {
      method: "get",
      path: "/class/get-students/{id}",
      options: {
        tags: ["api"],
        handler: (request, reply) => {
          return ClassController.getStudents(request.params.id);
        },
      },
    },
  ]);
};
export default ClassRoutes;
