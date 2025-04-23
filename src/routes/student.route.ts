import StudentController from "../controller/student.controller";
import { Server } from "@hapi/hapi";
const StudentRoutes = (server: Server) => {
  server.route([
    {
      method: "get",
      path: "/student/{id}",
      options: {
        tags: ["api"],
        handler: (request, reply) => {
          return StudentController.getOneStudent(request.params.id);
        },
      },
    },
    {
      method: "post",
      path: "/student/create-student",
      options: {
        tags: ["api"],
        handler: (request, reply) => {
          console.log(request.payload);
          return StudentController.createNewStudent(request);
        },
      },
    },
    {
      method: "get",
      path: "/student/get-students",
      options: {
        tags: ["api"],
        handler: (request, reply) => {
          return StudentController.geStudents(request);
        },
      },
    },
    {
      method: "patch",
      path: "/student/update-student",
      options: {
        tags: ["api"],
        handler: (request, reply) => {
          return StudentController.updateStudent(request);
        },
      },
    },

    {
      method: "delete",
      path: "/student/delete/{id}",
      options: {
        tags: ["api"],
        handler: (request, reply) => {
          const studentId = request.params.id;
          return StudentController.deleteStudentById(studentId);
        },
      },
    },
    {
      method: "delete",
      path: "/student/delete/delete-students",
      options: {
        tags: ["api"],
        handler: (request, reply) => {
          return StudentController.deleteStudents(request);
        },
      },
    },
    {
      method: "patch",
      path: "/student/add-class",
      options: {
        tags: ["api"],
        handler: (request, reply) => {
          return StudentController.addClass(request);
        },
      },
    },
    {
      method: "patch",
      path: "/student/remove-class",
      options: {
        tags: ["api"],
        handler: (request, reply) => {
          return StudentController.removeClass(request);
        },
      },
    },
    {
      method: "get",
      path: "/student/get-classes/{id}",
      options: {
        tags: ["api"],
        handler: (request, reply) => {
          return StudentController.getClasses(request.params.id);
        },
      },
    },
  ]);
};
export default StudentRoutes;
