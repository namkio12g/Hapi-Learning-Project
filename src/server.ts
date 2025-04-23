import EnvConfig from "./config/envConfig";
import * as Hapi from "@hapi/hapi";
import HapiSwagger from "hapi-swagger";
import Inert from "@hapi/inert";
import Vision from "@hapi/vision";
import StudentRoutes from "./routes/student.route";
import ClassRoutes from "./routes/class.route";
import connectDb from "./config/dbConnect";
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
  connectDb();

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
