import { Request, ResponseToolkit } from "@hapi/hapi";
import { AuthService } from "../services/auth.service";
import { ILoginInfo } from "../entities/types/loginInfo.types";
import { token } from "@hapi/jwt";
const AuthController = {
  login(request: Request, h: ResponseToolkit) {
    try {
      const loginInfo = request.payload as ILoginInfo;
      const data = AuthService.login(loginInfo);
      const jwtToken = token.generate(data, "grizzly-bears");
      console.log(jwtToken);
      return { token: jwtToken };
    } catch (error) {
      console.log(error);
    }
  },
};
export default AuthController;
