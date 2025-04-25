import CustomJoi from "../utility/customJoi";
import { JoiSchemas } from "../utility/JoiSchema";
import CourseController from "../controller/course.controller";
import { CourseLevel } from "../entities/course.entity";
import { Server } from "@hapi/hapi";
const CourseRoutes = (server: Server) => {
  server.route([
    {
      method: "get",
      path: "/course/{id}",
      options: {
        tags: ["api"],
        validate: {
          params: CustomJoi.object({
            id: JoiSchemas.ObjectIdInput.required(),
          }),
        },
        response: {
          status: {
            200: JoiSchemas.CourseSchema,
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
        validate: {
          query: CustomJoi.object({
            name: CustomJoi.string().example("Summ"),
            level: CustomJoi.string()
              .valid(...Object.values(CourseLevel))
              .example("intermidate"),
            timeEnd: CustomJoi.date().iso().example("04-22-2025"),
            timeStart: CustomJoi.date().iso().example("2025-04-16"),
            page: CustomJoi.number().required().example(1),
          }),
        },
        response: {
          status: {
            200: CustomJoi.array().items(JoiSchemas.CourseSchema),
          },
        },
        handler: CourseController.getCourses,
      },
    },
    {
      method: "post",
      path: "/course/create-course",
      options: {
        tags: ["api"],
        validate: {
          payload: CustomJoi.object({
            name: CustomJoi.string().required().example("Summ"),
            price: CustomJoi.number().min(0),
            level: CustomJoi.string()
              .required()
              .valid(...Object.values(CourseLevel))
              .example("intermediate"),
            timeEnd: CustomJoi.date().iso().required(),
          }),
          failAction: "log",
        },
        response: {
          status: {
            200: JoiSchemas.CourseSchema,
          },
        },
        handler: CourseController.createNewCourse,
      },
    },
    {
      method: "patch",
      path: "/course/update-course",
      options: {
        tags: ["api"],
        validate: {
          query: CustomJoi.object({
            id: JoiSchemas.ObjectIdInput.required(),
          }),
          payload: CustomJoi.object({
            name: CustomJoi.string().example("Summ"),
            level: CustomJoi.string()
              .valid(...Object.values(CourseLevel))
              .example("intermediate"),
            timeEnd: CustomJoi.date().iso(),
            price: CustomJoi.number().min(0),
          }),
          failAction: "log",
        },
        response: {
          status: {
            200: JoiSchemas.CourseSchema,
          },
        },
        handler: CourseController.updateCourse,
      },
    },

    {
      method: "delete",
      path: "/course/delete/{id}",
      options: {
        tags: ["api"],
        validate: {
          params: CustomJoi.object({
            id: JoiSchemas.ObjectIdInput.required(),
          }),
        },
        response: {},
        handler: CourseController.deleteCourseById,
      },
    },
  ]);
};
export default CourseRoutes;
