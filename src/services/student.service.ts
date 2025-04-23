import mongoose from "mongoose";
import { ClassModel } from "../models/class.model";
import { StudentModel, IStudentDocument } from "../models/student.model";
import { IAjustClass } from "../entities/adjustClass.entity";
import { IStudent } from "../entities/student.entity";
export const StudentService = {
  async createStudent(studentInfo: IStudentDocument) {
    try {
      console.log(studentInfo);
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
      console.log(error);
    }
  },

  async deleteStudents(studentInfo: IStudent) {
    try {
      let query: any = { name: studentInfo.name };

      if (studentInfo.grade) {
        query.grade = studentInfo.grade;
      }
      if (studentInfo.age) {
        query.age = studentInfo.age;
      }
      if (studentInfo.gender) {
        query.gender = studentInfo.gender;
      }
      return await StudentModel.deleteMany(studentInfo);
    } catch (error) {
      console.log(error);
    }
  },

  async updateStudent(studentInfo: IStudentDocument) {
    try {
      const studentObj = await StudentModel.findById(studentInfo._id);
      if (!studentObj) throw new Error("cant find the student");

      studentObj.gender = studentInfo.gender
        ? studentInfo.gender
        : studentObj.gender;

      studentObj.name = studentInfo.name ? studentInfo.name : studentObj.name;

      studentObj.age = studentInfo.age ? studentInfo.age : studentObj.age;

      studentObj.grade = studentInfo.grade
        ? studentInfo.grade
        : studentObj.grade;

      studentObj.address = studentInfo.address
        ? studentInfo.address
        : studentObj.address;

      return await studentObj.save();
    } catch (error) {
      console.log(error);
    }
  },

  async getStudentById(studentId: string) {
    try {
      return await StudentModel.findOne({ _id: studentId });
    } catch (error) {
      console.log(error);
    }
  },

  async getStudents(studentInfo: IStudentDocument) {
    try {
      let query: any = {};
      if (studentInfo.age) query.age = studentInfo.age;
      if (studentInfo.grade) query.grade = studentInfo.grade;
      if (studentInfo.name)
        query.name = { $regex: studentInfo.name, $options: "i" };
      if (studentInfo.address)
        query.address = { $regex: studentInfo.address, $options: "i" };
      if (studentInfo.gender) query.gender = studentInfo.gender;
      const studentArr = await StudentModel.find(query);
      return studentArr;
    } catch (error) {
      console.log(error);
    }
  },

  async addClass(adjustClassInfo: IAjustClass) {
    try {
      const studentObj = await StudentModel.findById(adjustClassInfo.studentId);
      if (!studentObj) throw new Error("cant find the student");

      const classObj = await ClassModel.findById(adjustClassInfo.classId);
      if (!classObj) throw new Error("cant find the student");

      const alreadyExist = studentObj.classes.some(
        (c: mongoose.Types.ObjectId) =>
          c.equals(classObj._id as mongoose.Types.ObjectId)
      );
      if (alreadyExist) {
        throw new Error();
      }
      studentObj.classes.push(classObj._id as mongoose.Types.ObjectId);
      const res = await studentObj.save();
      if (res) {
        classObj.studentCounts += 1;
        await classObj.save();
      }
      return res;
    } catch (error) {
      console.log(error);
    }
  },

  async removeClass(adjustClassInfo: IAjustClass) {
    try {
      const studentObj = await StudentModel.findById(adjustClassInfo.studentId);
      if (!studentObj) throw new Error("cant find the student");

      const classObj = await ClassModel.findById(adjustClassInfo.classId);
      if (!classObj) throw new Error("cant find the student");

      const alreadyExist = studentObj.classes.some(
        (c: mongoose.Types.ObjectId) =>
          c.equals(classObj._id as mongoose.Types.ObjectId)
      );
      if (!alreadyExist) {
        throw new Error();
      }
      studentObj.classes = studentObj.classes.filter(
        (c: mongoose.Types.ObjectId) => !c.equals(adjustClassInfo.classId)
      );

      const res = await studentObj.save();
      if (res) {
        classObj.studentCounts -= 1;
        await classObj.save();
      }
      return res;
    } catch (error) {
      console.log(error);
    }
  },
  async getClasses(studentId: string) {
    try {
      const studentObj = await StudentModel.findById(studentId);
      if (!studentObj) return { message: "cant find the student" };
      const students = StudentModel.findById(studentId)
        .populate("classes")
        .exec();
      return students;
    } catch (error) {
      console.log(error);
    }
  },
};
