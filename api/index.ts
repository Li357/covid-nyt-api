import apolloServer from '../src/server';
import microCors from 'micro-cors';

const handler = apolloServer.createHandler();
const cors = microCors();
const server = cors((req, res) => (req.method === 'OPTIONS' ? res.end() : handler(req, res)));

export default server;
