import { Request, ResponseToolkit } from "@hapi/hapi";
import { StudentService } from "../services/student.service";
import { IStudentDocument } from "../models/student.model";
import { IEnrollmentInfo } from "../entities/types/enrollment.types";
const StudentController = {
  createNewStudent(request: Request, h: ResponseToolkit) {
    try {
      const studentInfo = request.payload as IStudentDocument;
      return StudentService.createStudent(studentInfo);
    } catch (error) {
      console.log(error);
    }
  },

  getOneStudent(request: Request, h: ResponseToolkit) {
    try {
      const studentId = request.params.id;
      return StudentService.getStudentById(studentId);
    } catch (error) {
      console.log(error);
    }
  },

  getStudents(request: Request, h: ResponseToolkit) {
    try {
      const studentInfo = request.query as IStudentDocument;
      const page = request.query.page as number;
      return StudentService.getStudents(page, studentInfo);
    } catch (error) {
      console.log(error);
    }
  },

  updateStudent(request: Request, h: ResponseToolkit) {
    try {
      const studentInfo = request.payload as IStudentDocument;
      const studentId = request.query.id;
      return StudentService.updateStudent(studentId, studentInfo);
    } catch (error) {
      console.log(error);
    }
  },

  deleteStudentById(request: Request, h: ResponseToolkit) {
    try {
      const studentId = request.params.id;
      return StudentService.deleteStudentById(studentId);
    } catch (error) {
      console.log(error);
    }
  },

  updateLearningCourse(request: Request, h: ResponseToolkit) {
    try {
      const info = request.payload as IEnrollmentInfo;
      return StudentService.enrollCourse(info);
    } catch (error) {
      console.log(error);
    }
  },
};
export default StudentController;
