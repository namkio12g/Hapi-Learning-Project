import { error } from "console";
import { ClassModel, IClassDocument } from "../models/class.model";
import { StudentModel } from "../models/student.model";
export const ClassService = {
  async createClass(classInfo: IClassDocument) {
    try {
      const newClass = new ClassModel(classInfo);
      return await newClass.save();
    } catch (error) {
      console.log(error);
    }
  },

  async deleteClassById(classId: string) {
    try {
      return await ClassModel.deleteOne({ _id: classId });
    } catch (error) {
      console.log(error);
    }
  },

  async deleteClass(classInfo: IClassDocument) {
    try {
      let changes: any = {};
      if (classInfo.room) {
        changes.room = classInfo.room;
      }
      if (classInfo.subject) {
        changes.subject = classInfo.subject;
      }
      return await ClassModel.deleteMany(changes);
    } catch (error) {
      console.log(error);
    }
  },

  async updateClass(classInfo: IClassDocument) {
    try {
      const classObj = await ClassModel.findById(classInfo._id);
      if (!classObj) throw new Error("cant find the class");
      if (classInfo.room) {
        classObj.room = classInfo.room;
      }
      if (classInfo.subject) {
        classObj.subject = classInfo.subject;
      }
      return await classObj.save();
    } catch (error) {
      console.log(error);
    }
  },

  async getClassById(classId: string) {
    try {
      return await ClassModel.findOne({ _id: classId });
    } catch (error) {
      console.log(error);
    }
  },

  async getClasses(classInfo: IClassDocument) {
    try {
      const classArr = await ClassModel.find({
        room: { $regex: classInfo.room, $options: "i" },
        subject: { $regex: classInfo.subject, $options: "i" },
      });
      return classArr;
    } catch (error) {
      console.log(error);
    }
  },
  async getStudents(classId: string) {
    try {
      const classObj = await ClassModel.findById(classId);
      if (!classObj) return { message: "invalid class" };
      const students = StudentModel.find({ classes: { $in: [classId] } });
      return students;
    } catch (error) {
      console.log(error);
    }
  },
};
