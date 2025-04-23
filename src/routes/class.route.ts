import Joi from "joi";
import ClassController from "../controller/class.controller";
import { Server } from "@hapi/hapi";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";
const subjects = [
  "Biology",
  "Math",
  "Geography",
  "literature",
  "Physical",
  "History",
  "English",
];
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
              .description("Enter the class id")
              .default("68077586ecb334127cd7b2f4"),
          }),
        },
        response: {
          status: {
            200: Joi.object({
              _id: Joi.example(
                new mongoose.Types.ObjectId("68089144d7caca1db524becd")
              ).object(),
              room: Joi.string().example("PC100"),
              subject: Joi.string()
                .valid(...subjects)
                .example("Math"),
              studentCounts: Joi.number().min(0).example(30),
            })
              .label("UserResponse")
              .unknown(true),
          },
        },

        handler: (request, reply) => {
          const classId = request.params.id;
          try {
            return ClassController.getOneClass(classId);
          } catch (error) {
            console.log(error);
          }
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
