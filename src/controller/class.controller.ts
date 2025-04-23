import { Request } from "@hapi/hapi";
import { ClassService } from "../services/class.service";
import { IClassDocument } from "../models/class.model";
const ClassController = {
  createNewClass(request: Request) {
    try {
      const classInfo = request.payload as IClassDocument;
      return ClassService.createClass(classInfo);
    } catch (error) {
      console.log(error);
    }
  },

  getOneClass(classId: string) {
    try {
      return ClassService.getClassById(classId);
    } catch (error) {
      console.log(error);
    }
  },

  getClasses(request: Request) {
    try {
      const classInfo = request.query as IClassDocument;
      return ClassService.getClasses(classInfo);
    } catch (error) {
      console.log(error);
    }
  },

  updateClass(request: Request) {
    try {
      const classInfo = request.payload as IClassDocument;
      return ClassService.updateClass(classInfo);
    } catch (error) {
      console.log(error);
    }
  },

  deleteClassById(classId: string) {
    try {
      return ClassService.deleteClassById(classId);
    } catch (error) {
      console.log(error);
    }
  },

  deleteClass(request: Request) {
    try {
      const classInfo = request.payload as IClassDocument;
      return ClassService.deleteClass(classInfo);
    } catch (error) {
      console.log(error);
    }
  },
  getStudents(classId: string) {
    try {
      return ClassService.getStudents(classId);
    } catch (error) {
      console.log(error);
    }
  },
};
export default ClassController;
