import Boom from "@hapi/boom";
import {
  StudentModel,
  IStudentDocument,
  CourseModel,
  VoucherModel,
  IEventDocument,
} from "../models/index";
import mongoose from "mongoose";
import { IEnrollmentInfo } from "../entities/types/enrollment.types";

const LIMIT_NUMBER = 6;
export const StudentService = {
  async createStudent(studentInfo: IStudentDocument) {
    try {
      const newStudent = new StudentModel(studentInfo);
      return await newStudent.save();
    } catch (error) {
      console.log(error);
    }
  },

  async deleteStudentById(studentId: string) {
    try {
      return await StudentModel.deleteOne({ _id: studentId });
    } catch (error) {
      throw Boom.badRequest("Had an error at deleting student");
    }
  },

  async updateStudent(
    studentId: string,
    studentInfo: Partial<IStudentDocument>
  ) {
    try {
      const updatedStudentObj = await StudentModel.findByIdAndUpdate(
        studentId,
        { $set: studentInfo },
        { new: true, runValidators: true }
      );
      if (!updatedStudentObj) throw Boom.notFound("Student not found");
      return updatedStudentObj;
    } catch (error) {
      throw Boom.badRequest("Had an error at updating student");
    }
  },

  async getStudentById(studentId: string) {
    try {
      const res = await StudentModel.findOne({ _id: studentId }).populate(
        "learningCourse",
        "_id name"
      );
      if (!res) throw Boom.notFound("Student not found");
      return res;
    } catch (error) {
      throw Boom.badRequest("Had an error at finding student");
    }
  },

  async getStudents(page: number, studentQuery: Partial<IStudentDocument>) {
    try {
      let query: any = {
        name: { $regex: studentQuery.name, $options: "i" },
        phone: { $regex: studentQuery.phone, $options: "i" },
        address: { $regex: studentQuery.address, $options: "i" },
        gender: { $regex: studentQuery.gender, $options: "i" },
      };
      if (studentQuery.age) query.age = { $lte: studentQuery.age };
      const studentArr = await StudentModel.find(query)
        .skip((page - 1) * LIMIT_NUMBER)
        .limit(LIMIT_NUMBER);
      return studentArr;
    } catch (error) {
      throw Boom.badRequest("Had an error at getting students");
    }
  },

  async enrollCourse(enrollmentInfo: IEnrollmentInfo) {
    const studentObj = await StudentModel.findById(enrollmentInfo.studentId);
    const courseObj = await CourseModel.findById(enrollmentInfo.courseId);
    let eventObj: IEventDocument | undefined = undefined;
    if (enrollmentInfo.voucherId) {
      const voucherObj = await VoucherModel.findOne({
        _id: enrollmentInfo.voucherId,
        quantity: { $gte: 0 },
      })
        .populate<{ eventApplied: IEventDocument }>("eventApplied")
        .exec();
      if (!voucherObj) Boom.notFound("The voucher is not found or run out");

      eventObj = voucherObj?.eventApplied;
    }
    if (!studentObj || !courseObj)
      throw Boom.notFound("The student or course not found");
    if (!studentObj.learningCourse)
      throw Boom.badRequest("The student have already learn a course");
    if (courseObj.timeEnd > new Date())
      throw Boom.badRequest("The course was expired");

    let cost: number = courseObj.price;
    if (eventObj?.discount) {
      const discount = parseFloat(eventObj.discount.toString() ?? "0");
      cost = cost * (1 - discount / 100);
    }
    if (cost > studentObj?.wallet)
      throw Boom.badRequest("The student wallet was not enough for the course");
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const updateStudentObj = await StudentModel.findByIdAndUpdate(
        studentObj._id,
        {
          $set: { learningCourseCourse: courseObj._id },
          $inc: { wallet: -1 * cost },
        },
        { session, new: true }
      );
      await CourseModel.findByIdAndUpdate(
        courseObj._id,
        { $set: { studentsCount: +1 } },
        { session }
      );
      if (eventObj?.discount)
        await VoucherModel.findByIdAndUpdate(enrollmentInfo.voucherId, {
          $inc: { quantity: -1 },
        });
      await session.commitTransaction();
      return updateStudentObj;
    } catch (error) {
      await session.abortTransaction();
      throw Boom.badRequest("Had an error updating student");
    } finally {
      session.endSession();
    }
  },
};
