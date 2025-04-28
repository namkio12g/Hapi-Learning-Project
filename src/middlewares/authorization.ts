import { ResponseToolkit, Request } from "@hapi/hapi";

export const requireRole = (role: "teacher" | "student") => {
  return (req: Request, res: ResponseToolkit) => {
    const user = req.auth.credentials.user as any;
    console.log(user);
    if (role !== user?.role) {
      return res.response("You are not allowed").code(403).takeover();
    } else {
      return res.continue;
    }
  };
};
