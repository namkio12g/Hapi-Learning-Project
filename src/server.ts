import EnvConfig from "./config/envConfig";
import Hapi, { ResponseToolkit, Request } from "@hapi/hapi";
import StudentRoutes from "./routes/student.route";
import ClassRoutes from "./routes/class.route";
import connectDb from "./config/dbConnect";
// import the server

const start = async () => {
  const server = Hapi.server({
    port: EnvConfig.port,
    host: EnvConfig.host,
  });
  //---------------- db connection----------------//
  connectDb();

  //---------------- testing----------------//
  server.route({
    method: "GET",
    path: "/",
    handler: (request, h) => {
      return "Hello! Hapi1";
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
