import Hapi, { Request } from "@hapi/hapi";
import HapiJwt from "@hapi/jwt";

export const jwtAuthPlugin = {
  name: "auth",
  version: "1.0.0",
  register: async (server: Hapi.Server) => {
    await server.register(HapiJwt);

    server.auth.strategy("jwt", "jwt", {
      keys: "grizzly-bears",
      verify: false,
      validate: (artifacts: any, request: Request, h: Hapi.ResponseToolkit) => {
        const payload = artifacts.decoded.payload; // Extract the payload from the JWT
        if (!payload || !payload.id || !payload.role) {
          return {
            isValid: false,
          };
        }
        return {
          isValid: true,
          credentials: { user: artifacts.decoded.payload },
        };
      },
    });

    server.auth.default("jwt");
  },
};
