import { IResolverObject } from 'apollo-server-micro';
import regionResolvers from './region';
import { Population, Context } from '../types';

const stateResolvers: IResolverObject<Population, Context> = {
  async counties(parent, _args, { population }) {
    return population.getAllCountiesByState(parent.fips);
  },
  ...regionResolvers,
};

export default stateResolvers;
