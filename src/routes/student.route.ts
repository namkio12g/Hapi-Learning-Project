import CustomJoi from "../untils/customJoi";
import { JoiSchemas } from "../untils/JoiSchema";
import StudentController from "../controller/student.controller";
import { Server } from "@hapi/hapi";
import { GenderTypes } from "../entities/person.entity";
import { requireRole } from "../middlewares/authorization";
const StudentRoutes = (server: Server) => {
  server.route([
    {
      method: "get",
      path: "/student/{id}",
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
            200: JoiSchemas.StudentSchema,
          },
        },
        handler: StudentController.getOneStudent,
      },
    },
    {
      method: "get",
      path: "/student/get-students",
      options: {
        tags: ["api"],
        auth: false,
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
            200: CustomJoi.array().items(JoiSchemas.StudentSchema),
          },
        },
        handler: StudentController.getStudents,
      },
    },
    {
      method: "post",
      path: "/student/create-student",
      options: {
        tags: ["api"],
        auth: false,
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
            wallet: CustomJoi.number().required().min(0).example(20000),
          }),
        },
        response: {
          status: {
            200: JoiSchemas.StudentSchema,
          },
        },
        handler: StudentController.createNewStudent,
      },
    },
    {
      method: "patch",
      path: "/student/update-student",
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
            200: JoiSchemas.StudentSchema,
          },
        },
        pre: [requireRole("student")],
        handler: StudentController.updateStudent,
      },
    },

    {
      method: "delete",
      path: "/student/delete/{id}",
      options: {
        tags: ["api"],
        validate: {
          params: CustomJoi.object({
            id: JoiSchemas.ObjectIdInput.required(),
          }),
        },
        response: {},
        pre: [requireRole("student")],
        handler: StudentController.deleteStudentById,
      },
    },
    {
      method: "post",
      path: "/student/enroll",
      options: {
        tags: ["api"],
        validate: {
          payload: CustomJoi.object({
            studentId: JoiSchemas.ObjectIdInput.required(),
            voucherId: JoiSchemas.ObjectIdInput,
            courseId: JoiSchemas.ObjectIdInput.required(),
          }),
          failAction: "log",
        },
        response: {},
        pre: [requireRole("student")],
        handler: StudentController.updateLearningCourse,
      },
    },
  ]);
};
export default StudentRoutes;
