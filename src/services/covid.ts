import { fetch } from 'apollo-server-env';
import parse from 'csv-parse/lib/sync';
import { RegionData, RawStateData, RawCountyData } from '../types';
import memoize from '../util/memoize';

// custom caching to prevent reparsing every request
const REPOSITORY_URL = 'https://raw.githubusercontent.com/nytimes/covid-19-data/master';
const MAX_AGE = 1000 * 60 * 5; // refresh data from NYT every 5 hours

async function parseDataset(dataset: string): Promise<string[][]> {
  const res = await fetch(`${REPOSITORY_URL}/${dataset}`);
  const text = await res.text();
  return parse(text).slice(1); // first row is column names
}

function convertStateDataToPairs(stateData: RawStateData[]): [string, RegionData[]][] {
  const grouped = stateData.reduce((grouped, [date, _state, fips, cases, deaths]) => {
    if (!grouped[fips]) {
      grouped[fips] = [];
    }

    const totals = {
      date: new Date(`${date}T00:00Z`).toISOString(),
      cases: Number(cases),
      deaths: Number(deaths),
    };
    grouped[fips].push(totals);
    return grouped;
  }, {});
  return Object.keys(grouped).map((fips) => [fips, grouped[fips]]);
}

function convertCountyDataToPairs(countyData: RawCountyData[]): [string, RegionData[]][] {
  const grouped = countyData.reduce((grouped, [date, _state, _county, fips, cases, deaths]) => {
    if (!grouped[fips]) {
      grouped[fips] = [];
    }

    const totals = {
      date: new Date(`${date}T00:00Z`).toISOString(),
      cases: Number(cases),
      deaths: Number(deaths),
    };
    grouped[fips] = totals;
    return grouped;
  }, {});
  return Object.keys(grouped).map((fips) => [fips, grouped[fips]]);
}

export const getData = memoize(async function getData(): Promise<Map<string, RegionData[]>> {
  const stateData = (await parseDataset('us-states.csv')) as RawStateData[];
  const countyData = (await parseDataset('us-counties.csv')) as RawCountyData[];

  const stateKeyValuePairs = convertStateDataToPairs(stateData);
  const countyKeyValuePairs = convertCountyDataToPairs(countyData);

  return new Map([...stateKeyValuePairs, ...countyKeyValuePairs]);
}, MAX_AGE);

export async function getTimeline(fips: string) {
  const [data] = await getData();
  return data.has(fips) ? data.get(fips) : [];
}

export async function getCurrentCases(fips: string) {
  const timeline = await getTimeline(fips);
  return timeline.length > 0 ? timeline[timeline.length - 1].cases : 0;
}

export async function getCurrentDeaths(fips: string) {
  const timeline = await getTimeline(fips);
  return timeline.length > 0 ? timeline[timeline.length - 1].deaths : 0;
}
