import EnvConfig from "../config/envConfig";
import Hapi, { ResponseToolkit, Request } from "@hapi/hapi";
// import the server

const start = async () => {
  const server = Hapi.server({
    port: EnvConfig.port,
    host: EnvConfig.host,
  });

  server.route({
    method: "GET",
    path: "/",
    handler: (request, h) => {
      return "Hello! Hapi";
    },
  });

  await server.start();
  console.log("server run on ", server.info.uri);
  console.log("hello");
};
start().catch((err) => {
  console.log(err);
  process.exit(1);
});
