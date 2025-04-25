import Boom from "@hapi/boom";
import { TeacherModel, ITeacherDocument, CourseModel } from "../models/index";
import mongoose from "mongoose";

const LIMIT_NUMBER = 6;
export const TeacherService = {
  async createTeacher(teacherInfo: ITeacherDocument) {
    const teacherObj = await TeacherModel.findOne({
      $or: [{ email: teacherInfo.email }, { phone: teacherInfo.phone }],
    });
    if (teacherObj) throw Boom.badRequest("Email or Phone have been used");
    try {
      const newTeacher = new TeacherModel(teacherInfo);
      return await newTeacher.save();
    } catch (error) {
      console.log(error);
    }
  },

  async deleteTeacherById(teacherId: string) {
    try {
      return await TeacherModel.deleteOne({ _id: teacherId });
    } catch (error) {
      throw Boom.badRequest("Had an error at deleting teacher");
    }
  },

  async updateTeacher(
    teacherId: string,
    teacherInfo: Partial<ITeacherDocument>
  ) {
    if (teacherInfo.email || teacherInfo.phone) {
      const teacherObj = await TeacherModel.findOne({
        $or: [{ email: teacherInfo.email }, { phone: teacherInfo.phone }],
      });

      if (teacherObj) throw Boom.badRequest("Email or Phone have been used");
    }
    try {
      const updatedTeacherObj = await TeacherModel.findByIdAndUpdate(
        teacherId,
        { $set: teacherInfo },
        { new: true, runValidators: true }
      );
      if (!updatedTeacherObj) throw Boom.notFound("Teacher not found");
      return updatedTeacherObj;
    } catch (error) {
      throw Boom.badRequest("Had an error at updating teacher");
    }
  },

  async getTeacherById(teacherId: string) {
    try {
      const res = await TeacherModel.findOne({ _id: teacherId }).populate(
        "teachingCourse",
        "_id name"
      );
      if (!res) throw Boom.notFound("Teacher not found");
      return res;
    } catch (error) {
      throw Boom.badRequest("Had an error at finding teacher");
    }
  },

  async getTeachers(page: number, teacherQuery: Partial<ITeacherDocument>) {
    try {
      let query: any = {
        name: { $regex: teacherQuery.name, $options: "i" },
        phone: { $regex: teacherQuery.phone, $options: "i" },
        address: { $regex: teacherQuery.address, $options: "i" },
        gender: { $regex: teacherQuery.gender, $options: "i" },
      };
      if (teacherQuery.age) query.age = { $lte: teacherQuery.age };
      const teacherArr = await TeacherModel.find(query)
        .skip((page - 1) * LIMIT_NUMBER)
        .limit(LIMIT_NUMBER);
      return teacherArr;
    } catch (error) {
      throw Boom.badRequest("Had an error at getting teachers");
    }
  },
  async updateTeachingCourse(teacherId: string, courseId: string) {
    const teacherObj = await TeacherModel.findById(teacherId);
    if (!teacherObj) throw Boom.notFound(" Teacher are invalid");
    if (!courseId) {
      try {
        await CourseModel.findByIdAndUpdate(teacherObj.teachingCourse, {
          $set: { teacher: null },
        });
        const updateTeacherObj = await TeacherModel.findByIdAndUpdate(
          teacherId,
          { $set: { teachingCourse: null } },
          { new: true }
        );

        return updateTeacherObj;
      } catch (error) {
        throw Boom.badRequest("Had an error updating course for t null!");
      }
    }
    const courseObj = await CourseModel.findById(courseId);
    if (!courseObj) throw Boom.notFound(" Course are invalid");

    const session = await mongoose.startSession();

    try {
      session.startTransaction();
      if (teacherObj.teachingCourse) {
        await CourseModel.findByIdAndUpdate(
          teacherObj.teachingCourse,
          { $set: { teacher: null } },
          { session }
        );
      }
      await CourseModel.findByIdAndUpdate(
        courseId,
        { $set: { teacher: teacherObj._id } },
        { session }
      );
      const updateTeacherObj = await TeacherModel.findByIdAndUpdate(
        teacherId,
        { $set: { teachingCourse: courseObj._id } },
        { session, new: true }
      );
      await session.commitTransaction();

      return updateTeacherObj;
    } catch (error) {
      await session.abortTransaction();
      console.log(error);
      throw Boom.badRequest("Had an error updating teacher");
    } finally {
      session.endSession();
    }
  },
};
