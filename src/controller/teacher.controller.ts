import { Request, ResponseToolkit } from "@hapi/hapi";
import { TeacherService } from "../services/teacher.service";
import { ITeacherDocument } from "../models/teacher.model";
import { IUpdatingteachingcourse } from "../entities/types/updatingteachingcourse.types";
const TeacherController = {
  createNewTeacher(request: Request, h: ResponseToolkit) {
    try {
      const teacherInfo = request.payload as ITeacherDocument;
      return TeacherService.createTeacher(teacherInfo);
    } catch (error) {
      console.log(error);
    }
  },

  getOneTeacher(request: Request, h: ResponseToolkit) {
    try {
      const teacherId = request.params.id;

      return TeacherService.getTeacherById(teacherId);
    } catch (error) {
      console.log(error);
    }
  },

  getTeachers(request: Request, h: ResponseToolkit) {
    try {
      const page = request.query.page;

      const teacherInfo = request.query as ITeacherDocument;
      return TeacherService.getTeachers(page, teacherInfo);
    } catch (error) {
      console.log(error);
    }
  },

  updateTeacher(request: Request, h: ResponseToolkit) {
    try {
      const teacherInfo = request.payload as ITeacherDocument;
      const teacherId = request.query.id;
      return TeacherService.updateTeacher(teacherId, teacherInfo);
    } catch (error) {
      console.log(error);
    }
  },

  deleteTeacherById(request: Request, h: ResponseToolkit) {
    try {
      const teacherId = request.params.id;
      return TeacherService.deleteTeacherById(teacherId);
    } catch (error) {
      console.log(error);
    }
  },

  updateTeachingCourse(request: Request, h: ResponseToolkit) {
    try {
      const info = request.payload as IUpdatingteachingcourse;
      return TeacherService.updateTeachingCourse(info.teacherId, info.courseId);
    } catch (error) {
      console.log(error);
    }
  },
};
export default TeacherController;
