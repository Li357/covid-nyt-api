import fetch from 'node-fetch';
import csv from 'csv-parser';
import { RegionData, RawData } from '../types';
import memoize from '../util/memoize';
import descSort from '../util/descSort';

// custom caching to prevent reparsing every request
const REPOSITORY_URL = 'https://raw.githubusercontent.com/nytimes/covid-19-data/master';
const MAX_AGE = 1000 * 60 * 1; // refresh data from NYT every 1 hour

export const NATIONAL_DATA_KEY = 'NATION';

async function parseDataset(dataset: string): Promise<RawData[]> {
  const res = await fetch(`${REPOSITORY_URL}/${dataset}`);
  return new Promise((resolve, reject) => {
    const data: RawData[] = [];
    res.body
      .pipe(csv())
      .on('data', (chunk) => {
        data.push(chunk);
      })
      .on('end', () => {
        resolve(data);
      })
      .on('error', reject);
  });
}

function processDataset(stateData: RawData[]): [string, RegionData[]][] {
  const grouped = stateData.reduce((grouped: Record<string, RegionData[]>, { date, fips, cases, deaths }) => {
    if (!grouped[fips]) {
      grouped[fips] = [];
    }

    const totals = {
      date: `${date}T00:00`,
      cases: Number(cases),
      deaths: Number(deaths),
    };
    grouped[fips].push(totals);
    return grouped;
  }, {});

  return Object.keys(grouped).map((fips) => [fips, descSort(grouped[fips], 'date')]);
}

async function getCOVIDData(): Promise<Map<string, RegionData[]>> {
  const stateData = (await parseDataset('us-states.csv')) as RawData[];
  const countyData = (await parseDataset('us-counties.csv')) as RawData[];

  const statePairs = processDataset(stateData);
  const countyPairs = processDataset(countyData);

  const nationData = stateData.reduce((timeline: Record<string, Omit<RegionData, 'date'>>, state) => {
    if (!timeline[state.date]) {
      timeline[state.date] = { cases: 0, deaths: 0 };
    }
    timeline[state.date].cases += Number(state.cases);
    timeline[state.date].deaths += Number(state.deaths);
    return timeline;
  }, {});
  const nationTimeline = descSort(
    Object.keys(nationData).map((date) => ({
      date: `${date}T00:00`,
      ...nationData[date],
    })),
    'date',
  );

  return new Map([...statePairs, ...countyPairs, [NATIONAL_DATA_KEY, nationTimeline]]);
}
export const getData = memoize(getCOVIDData, MAX_AGE);

export async function getTimeline(fips: string): Promise<RegionData[]> {
  const data = await getData();
  return data.has(fips) ? data.get(fips)! : []; // eslint-disable-line @typescript-eslint/no-non-null-assertion
}

export async function getCurrentCases(fips: string): Promise<number> {
  const timeline = await getTimeline(fips);
  return timeline.length > 0 ? timeline[0].cases : 0;
}

export async function getCurrentDeaths(fips: string): Promise<number> {
  const timeline = await getTimeline(fips);
  return timeline.length > 0 ? timeline[0].deaths : 0;
}
