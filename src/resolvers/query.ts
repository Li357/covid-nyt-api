import { IResolverObject } from 'apollo-server-micro';
import { RegionArgs, Context } from '../types';

const rootResolvers: IResolverObject<undefined, Context, RegionArgs> = {
  async states(_root, { fips }, { population }) {
    return fips ? population.getByState(fips) : population.getAllStates();
  },
  async counties(_root, { fips }, { population }) {
    if (fips) {
      const stateFips = fips.slice(0, 2);
      const countyFips = fips.slice(2);
      return population.getByCounty(stateFips, countyFips);
    }
    return population.getAllCounties();
  },
};

export default rootResolvers;
