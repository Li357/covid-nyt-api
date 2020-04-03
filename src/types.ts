// From the Census API

export type RawStatePopulation = [string, string, string];
export type RawCountyPopulation = [string, string, string, string];

export interface Population {
  fips: string;
  name: string;
  population: number;
}

// From the NYT COVID datasets

export interface RawData {
  date: string;
  fips: string;
  cases: string;
  deaths: string;
}

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
