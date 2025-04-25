import { Request } from "@hapi/hapi";
import { StudentService } from "../services/student.service";
import { IStudentDocument } from "../models/student.model";
import { IEnrollmentInfo } from "../entities/types/enrollment.types";
const StudentController = {
  createNewStudent(request: Request) {
    try {
      const studentInfo = request.payload as IStudentDocument;
      return StudentService.createStudent(studentInfo);
    } catch (error) {
      console.log(error);
    }
  },

  getOneStudent(studentId: string) {
    try {
      return StudentService.getStudentById(studentId);
    } catch (error) {
      console.log(error);
    }
  },

  getStudents(request: Request) {
    try {
      const studentInfo = request.query as IStudentDocument;
      const page = request.query.page as number;
      return StudentService.getStudents(page, studentInfo);
    } catch (error) {
      console.log(error);
    }
  },

  updateStudent(request: Request) {
    try {
      const studentInfo = request.payload as IStudentDocument;
      const studentId = request.params._id;
      return StudentService.updateStudent(studentId, studentInfo);
    } catch (error) {
      console.log(error);
    }
  },

  deleteStudentById(studentId: string) {
    try {
      return StudentService.deleteStudentById(studentId);
    } catch (error) {
      console.log(error);
    }
  },

  updateTeachingCourse(request: Request) {
    try {
      const info = request.payload as IEnrollmentInfo;
      return StudentService.enrollCourse(info);
    } catch (error) {
      console.log(error);
    }
  },
};
export default StudentController;
