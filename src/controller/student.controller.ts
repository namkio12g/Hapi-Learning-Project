import { Request, ResponseToolkit } from "@hapi/hapi";
import { StudentService } from "../services/student.service";
import { IStudentDocument } from "../models/student.model";
import { IEnrollmentInfo } from "../entities/types/enrollment.types";
import { unauthorized } from "@hapi/boom";
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
      const studentSession = request.auth.credentials?.user as any;
      const studentInfo = request.payload as IStudentDocument;
      const studentId = request.query.id;
      if (!studentId || studentId !== studentSession.id)
        throw unauthorized("You are not authorized to update this student");

      return StudentService.updateStudent(studentId, studentInfo);
    } catch (error: any) {
      console.log(error.message);
      throw error;
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
      const studentSession = request.auth.credentials?.user as any;

      const info = request.payload as IEnrollmentInfo;
      if (!info.studentId || info.studentId !== studentSession.id)
        throw unauthorized("You are not authorized to update this student");
      return StudentService.enrollCourse(info);
    } catch (error: any) {
      console.log(error.message);
      throw error;
    }
  },
};
export default StudentController;
