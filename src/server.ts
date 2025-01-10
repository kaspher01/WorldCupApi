import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import { schema } from "./graphql/schema";
import restApp from "./rest/index";

const app = express();
const PORT = 4000;

async function startServer() {
  const server = new ApolloServer({
    schema,
  });

  await server.start();

  app.use(cors());
  app.use(express.json());
  
  app.use("/graphql", expressMiddleware(server));
  app.use("/rest", restApp);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`GraphQL: http://localhost:${PORT}/graphql`);
    console.log(`Apollo Studio: http://localhost:${PORT}/graphql`);
    console.log(`REST API: http://localhost:${PORT}/rest`);
  });
}

startServer().catch((err) => console.error("Error starting server:", err));
