import { ApolloServer } from 'apollo-server-micro';
import responseCachePlugin from 'apollo-server-plugin-response-cache';
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
  context: (): Context => {
    covid.getData();
    return { population, covid };
  },
  cacheControl: {
    defaultMaxAge: 60 * 60, // cache for one hour
  },
  plugins: [responseCachePlugin()],
});

export default server;
