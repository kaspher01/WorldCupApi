import express from "express";
import { graphqlHTTP } from "express-graphql";
import { schema } from "./schema";

export const graphqlApp = express.Router();

graphqlApp.use(
  "/",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);
