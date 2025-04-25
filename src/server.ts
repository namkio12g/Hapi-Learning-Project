import EnvConfig from "./config/envConfig";
import * as Hapi from "@hapi/hapi";
import HapiSwagger from "hapi-swagger";
import Inert from "@hapi/inert";
import Vision from "@hapi/vision";
import StudentRoutes from "./routes/student.route";
import ClassRoutes from "./routes/course.route";
import { DbConnection } from "./config/dbConnect";
import Boom from "@hapi/boom";
import { agenda } from "./jobs/agenda";
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
  } catch (error) {
    console.log("swagger error");
  }

  //---------------- db connection----------------//
  DbConnection.connectDb().catch(console.error);

  //---------------- agenda scheduling----------------//
  try {
    agenda.on("ready", async () => {
      await agenda.start();
      console.log("agenda is started");
    });
  } catch (error) {
    console.error("agenda error", error);
  }

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

  //---------------- testing----------------//
  //   server.route({
  //     method: "GET",
  //     path: "/",
  //     handler: (request, h) => {
  //       return "Hello! Hapi";
  //     },
  //   });
  //---------------- Routing----------------//
  StudentRoutes(server);
  ClassRoutes(server);
  //---------------- Other----------------//

  await server.start();
  console.log("server run on ", server.info.uri);
};
start().catch((err) => {
  console.log(err);
  process.exit(1);
});
