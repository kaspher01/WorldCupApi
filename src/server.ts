import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import { schema } from "./graphql/schema";
import restApp from "./rest/index";
import { startGrpcServer } from "./grpc/server";

const app = express();
const PORT = 4000;

async function startServer() {
  try {
    const server = new ApolloServer({
      schema,
    });

    await server.start();

    app.use(cors());
    app.use(express.json());

    app.use("/graphql", expressMiddleware(server));
    app.use("/rest", restApp);

    startGrpcServer(app, PORT);

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`REST API: http://localhost:${PORT}/rest/api/docs`);
      console.log(`Apollo Studio (GraphQL): http://localhost:${PORT}/graphql`);
      console.log(`gRPC: http://localhost:${PORT}/grpc`);
    });

    console.log("All servers started successfully");
  } catch (error) {
    console.error("Error starting servers:", error);
    process.exit(1);
  }
}

startServer();
