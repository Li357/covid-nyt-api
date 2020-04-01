import { ApolloServer } from 'apollo-server-micro';
import typeDefs from './schema';
import resolvers from './resolvers';
import { Context } from './types';
import * as population from './services/population';
import * as covid from './services/covid';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  introspection: true,
  context: async (): Promise<Context> => {
    await covid.getData();
    return { population, covid };
  },
});

export default server;
