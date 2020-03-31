import { fetch } from 'apollo-server-env';
import { Population, RawCountyPopulation, RawStatePopulation } from '../types';

const CENSUS_API = 'https://api.census.gov/data/2019/pep/population';

export async function getAllStates(): Promise<Population[]> {
  return getByState('*');
}

export async function getByState(stateFips: string): Promise<Population[]> {
  const response = await fetch(`${CENSUS_API}?get=NAME,POP&for=state:${stateFips}`);
  const [, ...data]: RawStatePopulation[] = await response.json();
  return data.map(([name, population, fips]) => ({
    fips,
    name,
    population: Number(population),
  }));
}

export async function getAllCounties(): Promise<Population[]> {
  return getByCounty('*', '*');
}

export async function getAllCountiesByState(stateFips: string): Promise<Population[]> {
  return getByCounty(stateFips, '*');
}

export async function getByCounty(stateFips: string, countyFips: string): Promise<Population[]> {
  const response = await fetch(`${CENSUS_API}?get=NAME,POP&in=state:${stateFips}&for=county:${countyFips}`);
  const [, ...data]: RawCountyPopulation[] = await response.json();
  return data.map(([name, population, stateFips, countyFips]) => ({
    fips: `${stateFips}${countyFips}`,
    name,
    population: Number(population),
  }));
}
