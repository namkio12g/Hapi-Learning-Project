import Boom from "@hapi/boom";
import { CourseModel, ICourseDocument } from "../models/course.model";

const LIMIT_NUMBER = 6;
export const CourseService = {
  async createCourse(courseInfo: ICourseDocument) {
    if (courseInfo.timeEnd && new Date(courseInfo.timeEnd) < new Date()) {
      throw Boom.badRequest("The end time cannot be before the start time");
    }
    try {
      const newCourse = new CourseModel(courseInfo);
      return await newCourse.save();
    } catch (error) {
      console.log("error at creating course", error);
      throw Boom.badRequest("Had an error at creating course");
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
    const courseObj = await CourseModel.findById(courseId);
    if (!courseObj) throw Boom.notFound("course not found");
    const timeStart = courseObj.timeStart;
    console.log(courseInfo);
    if (
      courseInfo.timeEnd &&
      timeStart &&
      new Date(courseInfo.timeEnd) < timeStart
    )
      throw Boom.badRequest("The end time cannot be before the start time");

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
    const res = await CourseModel.findOne({ _id: courseId }).populate(
      "teacher",
      "_id name"
    );
    if (!res) throw Boom.notFound("Course not found");
    return res;
  },

  async getCourses(page: number, courseQuery: Partial<ICourseDocument>) {
    try {
      let query: any = {
        name: {
          $regex: courseQuery.name ? courseQuery.name : "",
          $options: "i",
        },
        level: {
          $regex: courseQuery.level ? courseQuery.level : "",
          $options: "i",
        },
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
