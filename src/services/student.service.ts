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
  // check the existence of the email and phone of data input then create a new student
  async createStudent(studentInfo: IStudentDocument) {
    const studentObj = await StudentModel.findOne({
      $or: [{ email: studentInfo.email }, { phone: studentInfo.phone }],
    });
    if (studentObj) throw Boom.badRequest("Email or Phone have been used");
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
    if (studentInfo.email || studentInfo.phone) {
      const studentObj = await StudentModel.findOne({
        $or: [{ email: studentInfo.email }, { phone: studentInfo.phone }],
      });

      if (studentObj) throw Boom.badRequest("Email or Phone have been used");
    }
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
        email: { $regex: studentQuery.email, $options: "i" },
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

  //   async enrollCourse(enrollmentInfo: IEnrollmentInfo) {
  //     const studentObj = await StudentModel.findById(enrollmentInfo.studentId);
  //     const courseObj = await CourseModel.findById(enrollmentInfo.courseId);
  //     let eventObj: IEventDocument | undefined = undefined;
  //     if (enrollmentInfo.voucherId) {
  //       const voucherObj = await VoucherModel.findOne({
  //         _id: enrollmentInfo.voucherId,
  //         quantity: { $gte: 0 },
  //       })
  //         .populate<{ eventApplied: IEventDocument }>("eventApplied")
  //         .exec();
  //       if (!voucherObj)
  //         throw Boom.notFound("The voucher is not found or run out");

  //       eventObj = voucherObj?.eventApplied;
  //       if (
  //         !eventObj ||
  //         eventObj.active !== "active" ||
  //         new Date(eventObj.timeEnd) < new Date()
  //       )
  //         throw Boom.notFound("The event of the is not found or run out");
  //       if (
  //         !eventObj.coursesEligible?.includes(
  //           new mongoose.Types.ObjectId(enrollmentInfo.courseId)
  //         )
  //       )
  //         throw Boom.notFound("The event of the voucher is for the course");
  //     }
  //     if (!studentObj || !courseObj)
  //       throw Boom.notFound("The student or course not found");
  //     if (studentObj.learningCourse)
  //       throw Boom.badRequest("The student have already learn a course");
  //     if (new Date(courseObj.timeEnd) < new Date())
  //       throw Boom.badRequest("The course was expired");

  //     let cost: number = courseObj.price;
  //     if (eventObj?.discount) {
  //       const discount = parseFloat(eventObj.discount.toString() ?? "0");
  //       cost = cost * (1 - discount / 100);
  //     }
  //     if (cost > studentObj?.wallet)
  //       throw Boom.badRequest("The student wallet was not enough for the course");
  //     const session = await mongoose.startSession();
  //     try {
  //       session.startTransaction();
  //       const updateStudentObj = await StudentModel.findByIdAndUpdate(
  //         studentObj._id,
  //         {
  //           $set: { learningCourse: courseObj._id },
  //           $inc: { wallet: -1 * cost },
  //         },
  //         { session, new: true }
  //       );
  //       await CourseModel.findByIdAndUpdate(
  //         courseObj._id,
  //         { $set: { studentsCount: +1 } },
  //         { session }
  //       );
  //       if (eventObj?.discount)
  //         await VoucherModel.findByIdAndUpdate(
  //           enrollmentInfo.voucherId,
  //           {
  //             $inc: { quantity: -1 },
  //           },
  //           { session }
  //         );
  //       await session.commitTransaction();
  //       return updateStudentObj;
  //     } catch (error) {
  //       await session.abortTransaction();
  //       throw Boom.badRequest("Had an error enrolling the course for student");
  //     } finally {
  //       session.endSession();
  //     }
  //   },
  async enrollCourse(enrollmentInfo: IEnrollmentInfo) {
    const studentObj = await StudentModel.findById(enrollmentInfo.studentId);
    const courseObj = await CourseModel.findById(enrollmentInfo.courseId);
    let eventObj: IEventDocument | undefined = undefined;
    if (enrollmentInfo.voucherId) {
      const voucherObj = await VoucherModel.findOne({
        _id: enrollmentInfo.voucherId,
        isUsed: false,
      })
        .populate<{ eventApplied: IEventDocument }>("eventApplied")
        .exec();
      if (!voucherObj)
        throw Boom.notFound("The voucher is not found or be used");

      eventObj = voucherObj?.eventApplied;
      if (
        !eventObj ||
        eventObj.active !== "active" ||
        new Date(eventObj.timeEnd) < new Date()
      )
        throw Boom.notFound("The event of the voucher is not found or expired");
      if (
        !eventObj.coursesEligible?.includes(
          new mongoose.Types.ObjectId(enrollmentInfo.courseId)
        )
      )
        throw Boom.notFound("The event of the voucher is for the course");
    }
    if (!studentObj || !courseObj)
      throw Boom.notFound("The student or course not found");
    if (studentObj.learningCourse)
      throw Boom.badRequest("The student have already learn a course");
    if (new Date(courseObj.timeEnd) < new Date())
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
          $set: { learningCourse: courseObj._id },
          $inc: { wallet: -1 * cost },
        },
        { session, new: true, writeConcern: { w: "majority" } }
      );
      await CourseModel.findByIdAndUpdate(
        courseObj._id,
        { $set: { studentsCount: +1 } },
        { session, writeConcern: { w: "majority" } }
      );
      if (eventObj?.discount)
        await VoucherModel.findByIdAndUpdate(
          enrollmentInfo.voucherId,
          {
            $set: { isUsed: true },
          },
          { session, writeConcern: { w: "majority" } }
        );
      await session.commitTransaction();
      return updateStudentObj;
    } catch (error) {
      await session.abortTransaction();
      throw Boom.badRequest("Had an error enrolling the course for student");
    } finally {
      session.endSession();
    }
  },
};
