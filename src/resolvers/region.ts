import { IResolverObject } from 'apollo-server-micro';
import { Population, Context, TimelineArgs } from '../types';

const regionResolvers: IResolverObject<Population, Context, TimelineArgs> = {
  async cases(parent, _args, { covid }) {
    return covid.getCurrentCases(parent.fips);
  },
  async deaths(parent, _args, { covid }) {
    return covid.getCurrentDeaths(parent.fips);
  },
  async timeline(parent, { limit }, { covid }) {
    const totals = await covid.getTimeline(parent.fips);
    return totals.slice(0, limit);
  },
};

export default regionResolvers;
