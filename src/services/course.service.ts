import Boom from "@hapi/boom";
import { CourseModel, ICourseDocument } from "../models/course.model";

const LIMIT_NUMBER = 6;
export const CourseService = {
  async createCourse(courseInfo: ICourseDocument) {
    try {
      const newCourse = new CourseModel(courseInfo);
      return await newCourse.save();
    } catch (error) {
      console.log(error);
    }
  },

  async deleteCourseById(courseId: string) {
    try {
      return await CourseModel.deleteOne({ _id: courseId });
    } catch (error) {
      throw Boom.badRequest("Had an error at deleting course");
    }
  },

  async updateCourse(courseId: string, courseInfo: Partial<ICourseDocument>) {
    try {
      const updatedCourseObj = await CourseModel.findByIdAndUpdate(
        courseId,
        { $set: courseInfo },
        { new: true, runValidators: true }
      );
      if (!updatedCourseObj) throw Boom.notFound("Course not found");
      return updatedCourseObj;
    } catch (error) {
      throw Boom.badRequest("Had an error at updating course");
    }
  },

  async getCourseById(courseId: string) {
    try {
      const res = await CourseModel.findOne({ _id: courseId }).populate(
        "teacher",
        "_id name"
      );
      if (!res) throw Boom.notFound("Course not found");
      return res;
    } catch (error) {
      throw Boom.badRequest("Had an error at finding course");
    }
  },

  async getCourses(page: number, courseQuery: Partial<ICourseDocument>) {
    try {
      let query: any = {
        name: { $regex: courseQuery.name, $options: "i" },
        level: courseQuery.level,
      };
      if (courseQuery.timeStart)
        query.timeStart = { $gte: new Date(courseQuery.timeStart) };
      if (courseQuery.timeEnd)
        query.timeEnd = { $lte: new Date(courseQuery.timeEnd) };
      const courseArr = await CourseModel.find(query)
        .skip((page - 1) * LIMIT_NUMBER)
        .limit(LIMIT_NUMBER);
      return courseArr;
    } catch (error) {
      throw Boom.badRequest("Had an error at getting courses");
    }
  },
};
