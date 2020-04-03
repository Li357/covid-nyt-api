import { IResolvers } from 'apollo-server-micro';
import rootResolvers from './query';
import stateResolvers from './state';
import countyResolvers from './county';
import nationResolvers from './nation';

const resolvers: IResolvers = {
  Query: rootResolvers,
  State: stateResolvers,
  County: countyResolvers,
  Nation: nationResolvers,
};

export default resolvers;
