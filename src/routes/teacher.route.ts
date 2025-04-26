import CustomJoi from "../untils/customJoi";
import { JoiSchemas } from "../untils/JoiSchema";
import TeacherController from "../controller/teacher.controller";
import { Server } from "@hapi/hapi";
import { GenderTypes } from "../entities/person.entity";
const TeacherRoutes = (server: Server) => {
  server.route([
    {
      method: "get",
      path: "/teacher/{id}",
      options: {
        tags: ["api"],
        validate: {
          params: CustomJoi.object({
            id: JoiSchemas.ObjectIdInput.required(),
          }),
        },
        response: {
          status: {
            200: JoiSchemas.TeacherSchema,
          },
        },
        handler: TeacherController.getOneTeacher,
      },
    },
    {
      method: "get",
      path: "/teacher/get-teachers",
      options: {
        tags: ["api"],
        validate: {
          query: CustomJoi.object({
            name: CustomJoi.string().example("Nguyen").default(""),
            email: CustomJoi.string()
              .email()
              .example("nguyenvana@gmail.com")
              .default(""),
            phone: CustomJoi.string()
              .pattern(/^0\d{9}$/)
              .example("0123456789")
              .default(""),
            address: CustomJoi.string().example("Ho chi minh").default(""),
            gender: CustomJoi.string()
              .valid(...Object.values(GenderTypes))
              .example("male")
              .default(""),
            age: CustomJoi.number().min(0).example(20),
            page: CustomJoi.number().min(0).required().example(1),
          }),
        },
        response: {
          status: {
            200: CustomJoi.array().items(JoiSchemas.TeacherSchema),
          },
        },
        handler: TeacherController.getTeachers,
      },
    },
    {
      method: "post",
      path: "/teacher/create-teacher",
      options: {
        tags: ["api"],
        validate: {
          payload: CustomJoi.object({
            name: CustomJoi.string().required().example("Nguyen"),
            email: CustomJoi.string()
              .required()
              .email()
              .example("nguyenvana@gmail.com"),
            phone: CustomJoi.string()
              .required()
              .pattern(/^0\d{9}$/)
              .example("0123456789"),
            password: CustomJoi.string().required().example("123456789"),
            address: CustomJoi.string().required().example("Ho chi minh"),
            gender: CustomJoi.string()
              .required()
              .valid(...Object.values(GenderTypes))
              .example("male"),
            age: CustomJoi.number().required().min(0).example(20),
          }),
        },
        response: {
          status: {
            200: JoiSchemas.TeacherSchema,
          },
        },
        handler: TeacherController.createNewTeacher,
      },
    },
    {
      method: "patch",
      path: "/teacher/update-teacher",
      options: {
        tags: ["api"],
        validate: {
          query: CustomJoi.object({
            id: JoiSchemas.ObjectIdInput.required(),
          }),
          payload: CustomJoi.object({
            name: CustomJoi.string().example("Nguyen"),
            email: CustomJoi.string().email().example("nguyenvana@gmail.com"),
            phone: CustomJoi.string()
              .pattern(/^0\d{9}$/)
              .example("0123456789"),
            address: CustomJoi.string().example("Ho chi minh"),
            gender: CustomJoi.string()
              .valid(...Object.values(GenderTypes))
              .example("male"),
            age: CustomJoi.number().min(0).example(20),
            wallet: CustomJoi.number().min(0).example(20000),
          }),
        },
        response: {
          status: {
            200: JoiSchemas.TeacherSchema,
          },
        },
        handler: TeacherController.updateTeacher,
      },
    },

    {
      method: "delete",
      path: "/teacher/delete/{id}",
      options: {
        tags: ["api"],
        validate: {
          params: CustomJoi.object({
            id: JoiSchemas.ObjectIdInput.required(),
          }),
        },
        response: {},
        handler: TeacherController.deleteTeacherById,
      },
    },
    {
      method: "post",
      path: "/teacher/update-teaching-course/{id}",
      options: {
        tags: ["api"],
        validate: {
          payload: CustomJoi.object({
            teacherId: JoiSchemas.ObjectIdInput.required(),
            courseId: JoiSchemas.ObjectIdInput.required(),
          }),
        },
        response: {},
        handler: TeacherController.updateTeachingCourse,
      },
    },
  ]);
};
export default TeacherRoutes;
