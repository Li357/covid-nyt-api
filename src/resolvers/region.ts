import { IResolverObject } from 'apollo-server-micro';
import { Population, Context } from '../types';

const regionResolvers: IResolverObject<Population, Context> = {
  async cases(parent, _args, { covid }) {
    return covid.getCurrentCases(parent.fips);
  },
  async deaths(parent, _args, { covid }) {
    return covid.getCurrentDeaths(parent.fips);
  },
  async timeline(parent, _args, { covid }) {
    return covid.getTimeline(parent.fips);
  },
};

export default regionResolvers;
