import { unauthorized } from "@hapi/boom";
import { ILoginInfo } from "../entities/types/loginInfo.types";
import { StudentModel, TeacherModel } from "../models";

export const AuthService = {
  async login(loginInfo: ILoginInfo) {
    try {
      const studentObj = await StudentModel.findOne(loginInfo);
      if (studentObj) return { id: studentObj._id, role: "student" };
      const teacherObj = await TeacherModel.findOne(loginInfo);
      if (teacherObj) return { id: teacherObj._id, role: "teacher" };
      throw unauthorized("Cant found any user");
    } catch (error: any) {
      console.error("Error in AuthService.login:", error.message);
      throw error;
    }
  },
};
