import { Request, ResponseToolkit } from "@hapi/hapi";
import { CourseService } from "../services/course.service";
import { ICourseDocument } from "../models/index";
const CourseController = {
  createNewCourse(request: Request, h: ResponseToolkit) {
    try {
      const courseInfo = request.payload as ICourseDocument;
      return CourseService.createCourse(courseInfo);
    } catch (error) {
      console.log(error);
    }
  },

  getOneCourse(request: Request, h: ResponseToolkit) {
    try {
      const courseId = request.params.id;
      return CourseService.getCourseById(courseId);
    } catch (error) {
      console.log(error);
    }
  },

  getCourses(request: Request, h: ResponseToolkit) {
    try {
      const courseInfo = request.query as Partial<ICourseDocument>;
      const page = request.query.page as number;
      return CourseService.getCourses(page, courseInfo);
    } catch (error) {
      console.log(error);
    }
  },

  updateCourse(request: Request, h: ResponseToolkit) {
    try {
      const courseInfo = request.payload as ICourseDocument;
      const courseId = request.query.id;
      return CourseService.updateCourse(courseId, courseInfo);
    } catch (error) {
      console.log(error);
    }
  },

  deleteCourseById(request: Request, h: ResponseToolkit) {
    try {
      const courseId = request.params.id;
      return CourseService.deleteCourseById(courseId);
    } catch (error) {
      console.log(error);
    }
  },
};
export default CourseController;
