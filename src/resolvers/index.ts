import rootResolvers from './query';
import stateResolvers from './state';
import countyResolvers from './county';
import { IResolvers } from 'apollo-server-micro';

const resolvers: IResolvers = {
  Query: rootResolvers,
  State: stateResolvers,
  County: countyResolvers,
};

export default resolvers;
