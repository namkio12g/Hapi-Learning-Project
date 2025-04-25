import Joi from "joi";
import CourseController from "../controller/course.controller";
import { Server } from "@hapi/hapi";
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
const CourseRoutes = (server: Server) => {
  server.route([
    {
      method: "get",
      path: "/course/{id}",
      options: {
        tags: ["api"],
        validate: {
          params: Joi.object({
            id: Joi.string()
              .pattern(/^[0-9a-fA-F]{24}$/)
              .required()
              .description("Enter the course id")
              .default("68077586ecb334127cd7b2f4"),
          }),
        },
        response: {
          status: {
            200: Joi.object({
              _id: Joi.object().example(
                new mongoose.Types.ObjectId("68089144d7caca1db524becd")
              ),
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

        handler: CourseController.getOneCourse,
      },
    },
    {
      method: "get",
      path: "/course/get-coursees",
      options: {
        tags: ["api"],
        handler: CourseController.getCourses,
      },
    },
    {
      method: "post",
      path: "/course/create-course",
      options: {
        tags: ["api"],
        handler: CourseController.createNewCourse,
      },
    },
    {
      method: "patch",
      path: "/course/update-course",
      options: {
        tags: ["api"],
        handler: CourseController.updateCourse,
      },
    },

    {
      method: "delete",
      path: "/course/delete/{id}",
      options: {
        tags: ["api"],
        handler: CourseController.deleteCourseById,
      },
    },
  ]);
};
export default CourseRoutes;
