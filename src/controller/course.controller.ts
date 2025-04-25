import { Request } from "@hapi/hapi";
import { CourseService } from "../services/course.service";
import { ICourseDocument } from "../models/index";
const CourseController = {
  createNewCourse(request: Request) {
    try {
      const courseInfo = request.payload as ICourseDocument;
      return CourseService.createCourse(courseInfo);
    } catch (error) {
      console.log(error);
    }
  },

  getOneCourse(courseId: string) {
    try {
      return CourseService.getCourseById(courseId);
    } catch (error) {
      console.log(error);
    }
  },

  getCourses(request: Request) {
    try {
      const courseInfo = request.query as ICourseDocument;
      const page = request.query.page as number;
      return CourseService.getCourses(page, courseInfo);
    } catch (error) {
      console.log(error);
    }
  },

  updateCourse(request: Request) {
    try {
      const courseInfo = request.payload as ICourseDocument;
      const courseId = request.params._id;
      return CourseService.updateCourse(courseId, courseInfo);
    } catch (error) {
      console.log(error);
    }
  },

  deleteCourseById(courseId: string) {
    try {
      return CourseService.deleteCourseById(courseId);
    } catch (error) {
      console.log(error);
    }
  },
};
export default CourseController;
