import { ApolloServer } from 'apollo-server-micro';
import microCors from 'micro-cors';
import typeDefs from './schema';
import resolvers from './resolvers';
import * as population from './services/population';
import * as covid from './services/covid';

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: async () => {
    await covid.getData();
    return { population, covid };
  },
});

const handler = apolloServer.createHandler();
const cors = microCors();
const server = cors((req, res) => handler(req, res));

export default server;
