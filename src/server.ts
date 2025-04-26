import EnvConfig from "./config/envConfig";
import * as Hapi from "@hapi/hapi";
import HapiSwagger from "hapi-swagger";
import Inert from "@hapi/inert";
import Vision from "@hapi/vision";
import "./queues/worker.queue";
import {
  CourseRoutes,
  EventRoutes,
  TeacherRoutes,
  StudentRoutes,
  VoucherRoutes,
} from "./routes/index";
import { DbConnection } from "./config/dbConnect";
import Boom from "@hapi/boom";
import { jwtAuthPlugin } from "./middlewares/jwtStrategy";
import { SeverityLevel } from "mongodb";
import AuthRoutes from "./routes/auth.route";
// import { agenda } from "./jobs/agenda";
// import the server

const start = async () => {
  const server = Hapi.server({
    port: EnvConfig.port,
    host: EnvConfig.host,
  });
  //---------------- Swagger set up----------------//
  const swaggerOptions: HapiSwagger.RegisterOptions = {
    info: {
      title: "Test API Documentation",
    },
    securityDefinitions: {
      jwt: {
        type: "apiKey",
        name: "Authorization",
        in: "header",
      },
    },
    security: [{ jwt: [] }],
  };

  const plugins: Array<Hapi.ServerRegisterPluginObject<any>> = [
    {
      plugin: Inert,
    },
    {
      plugin: Vision,
    },
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ];

  try {
    await server.register(plugins);
    await server.register(jwtAuthPlugin);
  } catch (error) {
    console.log(error);
  }

  //---------------- db connection----------------//
  DbConnection.connectDb().catch(console.error);

  //---------------- agenda scheduling----------------//
  //   try {
  //     agenda.on("ready", async () => {
  //       await agenda.start();
  //       console.log("agenda is started");
  //     });
  //   } catch (error) {
  //     console.error("agenda error", error);
  //   }

  //---------------- Handling Global error (using boom)----------------//
  server.ext("onPreResponse", (request, h) => {
    const response = request.response;

    // Catch Boom errors
    if (Boom.isBoom(response)) {
      return h
        .response({
          statusCode: response.output.statusCode,
          error: response.output.payload.error,
          message: response.message,
        })
        .code(response.output.statusCode);
    }

    // if (response.isBoom) {
    //   return h
    //     .response({
    //       statusCode: 500,
    //       error: "Internal Server Error",
    //       message: response.message,
    //     })
    //     .code(500);
    // }

    return h.continue;
  });
  console.log(server.auth);
  //---------------- Routing----------------//
  //   StudentRoutes(server);
  AuthRoutes(server);
  CourseRoutes(server);
  VoucherRoutes(server);
  StudentRoutes(server);
  EventRoutes(server);
  TeacherRoutes(server);
  //---------------- Other----------------//

  await server.start();

  console.log("server run on ", server.info.uri);
};
start().catch((err) => {
  console.log(err);
  process.exit(1);
});
