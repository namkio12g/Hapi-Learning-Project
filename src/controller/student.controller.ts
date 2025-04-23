import { Request } from "@hapi/hapi";
import { IStudentDocument } from "../models/student.model";
import { StudentService } from "../services/student.service";
import { IAjustClass } from "../entities/adjustClass.entity";
import { IStudent } from "../entities/student.entity";

const StudentController = {
  geStudents(request: Request) {
    const studentInfo = request.query as IStudentDocument;
    return StudentService.getStudents(studentInfo);
  },
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

  updateStudent(request: Request) {
    try {
      const studentInfo = request.payload as IStudentDocument;
      return StudentService.updateStudent(studentInfo);
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

  deleteStudents(request: Request) {
    try {
      const studentInfo = request.payload as IStudent;
      return StudentService.deleteStudents(studentInfo);
    } catch (error) {
      console.log(error);
    }
  },

  addClass(request: Request) {
    try {
      const adjustClassInfo = request.payload as IAjustClass;
      return StudentService.addClass(adjustClassInfo);
    } catch (error) {
      console.log(error);
    }
  },

  removeClass(request: Request) {
    try {
      const adjustClassInfo = request.payload as IAjustClass;
      return StudentService.removeClass(adjustClassInfo);
    } catch (error) {
      console.log(error);
    }
  },
  getClasses(studentId: string) {
    try {
      return StudentService.getClasses(studentId);
    } catch (error) {
      console.log(error);
    }
  },
};
export default StudentController;
