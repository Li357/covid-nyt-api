// From the Census API

export type RawStatePopulation = [string, string, string];
export type RawCountyPopulation = [string, string, string, string];

export interface Population {
  fips: string;
  name: string;
  population: number;
}

// From the NYT COVID datasets

export type RawStateData = [string, string, string, string, string]; // date, state, fips, case, deaths
export type RawCountyData = [string, string, string, string, string, string]; // date, state, county, fips, case, deaths

export interface RegionData {
  date: Date;
  cases: number;
  deaths: number;
}

export interface RegionArgs {
  fips?: string;
}

export interface Context {
  population: typeof import('./services/population');
  covid: typeof import('./services/covid');
}
