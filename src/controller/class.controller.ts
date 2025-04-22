import { Request } from "@hapi/hapi";
import { ClassService } from "../services/class.service";
const ClassController = {
  createNewClass(request: Request) {
    try {
      const { room, subject } = request.payload;
      return ClassService.createClass(room, subject);
    } catch (error) {
      console.log(error);
    }
  },
};
export default ClassController;
