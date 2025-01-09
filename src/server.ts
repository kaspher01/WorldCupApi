import express from "express";
import { graphqlApp } from "./graphql/server";
import restApp from "./rest/index";

const app = express();

app.use("/graphql", graphqlApp);
app.use("/rest", restApp);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
  console.log(`REST API endpoint: http://localhost:${PORT}/rest`);
});
