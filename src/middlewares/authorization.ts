import { ResponseToolkit, Request } from "@hapi/hapi";

export const requireRole = (role: "teacher" | "student") => {
  return (req: Request, res: ResponseToolkit) => {
    const userRole = req.auth.credentials?.role;
    console.log(
      "your beatiful role is : ",
      userRole,
      "and your role is : ",
      role,
      " and your role is : ",
      role
    );

    if (role === userRole) {
      return res.response("You are not allowed").code(403).takeover();
    } else {
      return res.continue;
    }
  };
};
