import { Request, ResponseToolkit } from "@hapi/hapi";
import { AuthService } from "../services/auth.service";
import { ILoginInfo } from "../entities/types/loginInfo.types";
import { token } from "@hapi/jwt";
const AuthController = {
  async login(request: Request, h: ResponseToolkit) {
    try {
      const loginInfo = request.payload as ILoginInfo;
      const data = await AuthService.login(loginInfo);

      const jwtToken = token.generate(data, "grizzly-bears");
      return { token: jwtToken };
    } catch (error: any) {
      console.log(error.message);
      throw error;
    }
  },
};
export default AuthController;
