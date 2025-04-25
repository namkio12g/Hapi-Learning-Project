import { Request } from "@hapi/hapi";
import { TeacherService } from "../services/teacher.service";
import { ITeacherDocument } from "../models/teacher.model";
import { IUpdatingteachingcourse } from "../entities/types/updatingteachingcourse.types";
const TeacherController = {
  createNewTeacher(request: Request) {
    try {
      const teacherInfo = request.payload as ITeacherDocument;
      return TeacherService.createTeacher(teacherInfo);
    } catch (error) {
      console.log(error);
    }
  },

  getOneTeacher(teacherId: string) {
    try {
      return TeacherService.getTeacherById(teacherId);
    } catch (error) {
      console.log(error);
    }
  },

  getTeachers(request: Request) {
    try {
      const teacherInfo = request.query as ITeacherDocument;
      return TeacherService.getTeachers(teacherInfo);
    } catch (error) {
      console.log(error);
    }
  },

  updateTeacher(request: Request) {
    try {
      const teacherInfo = request.payload as ITeacherDocument;
      const teacherId = request.params._id;
      return TeacherService.updateTeacher(teacherId, teacherInfo);
    } catch (error) {
      console.log(error);
    }
  },

  deleteTeacherById(teacherId: string) {
    try {
      return TeacherService.deleteTeacherById(teacherId);
    } catch (error) {
      console.log(error);
    }
  },

  updateTeachingCourse(request: Request) {
    try {
      const info = request.payload as IUpdatingteachingcourse;
      return TeacherService.updateTeachingCourse(info.teacherId, info.courseId);
    } catch (error) {
      console.log(error);
    }
  },
};
export default TeacherController;
