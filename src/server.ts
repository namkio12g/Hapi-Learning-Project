import EnvConfig from "./config/envConfig";
import * as Hapi from "@hapi/hapi";
// import * as HapiSwagger from "hapi-swagger";
// import * as Inert from "@hapi/inert";
// import * as Vision from "@hapi/vision";
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
  //   const swaggerOptions = {
  //     info: {
  //       title: "My Hapi API Docs",
  //       version: 1.0,
  //     },
  //   };

  //   await server.register([
  //     Inert,
  //     Vision,
  //     {
  //       plugin: HapiSwagger,
  //       options: swaggerOptions,
  //     },
  //   ]);

  //---------------- db connection----------------//
  connectDb();

  //---------------- testing----------------//
  server.route({
    method: "GET",
    path: "/",
    handler: (request, h) => {
      return "Hello! Hapi";
    },
  });
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
