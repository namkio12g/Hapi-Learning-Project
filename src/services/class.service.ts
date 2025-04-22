import { ClassModel } from "../models/class.model";
export const ClassService = {
  async createClass(room: string, subject: string) {
    try {
      const newClass = new ClassModel({ room: room, subject: subject });
      return await newClass.save();
    } catch (error) {
      console.log(error);
    }
  },
};
