import microCors from 'micro-cors';
import apolloServer from '../src/server';

const cors = microCors();
const handler = apolloServer.createHandler();
const server = cors((req, res) => (req.method === 'OPTIONS' ? res.end() : handler(req, res)));

export default server;
