import { createHandler } from 'graphql-http/lib/use/express';
import { schema } from './schema/index.js';

export const graphqlHandler = createHandler({
  schema,
  context: (req) => ({
  }),
});
