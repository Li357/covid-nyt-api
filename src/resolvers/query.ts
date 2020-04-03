import { IResolverObject } from 'apollo-server-micro';
import { RegionArgs, Context } from '../types';
import { NATIONAL_DATA_KEY } from '../services/covid';

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
  async nation(_root, _args, { population }) {
    const allStates = await population.getAllStates();
    return allStates.reduce(
      (nation, state) => ({
        ...nation,
        population: nation.population + state.population,
      }),
      { fips: NATIONAL_DATA_KEY, name: 'United States', population: 0 },
    );
  },
};

export default rootResolvers;
