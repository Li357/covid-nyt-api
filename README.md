# COVID-19 GraphQL API

The New York Times' [COVID-19 data](https://github.com/nytimes/covid-19-data) for the United States as a GraphQL service. Live at https://covid-nyt-api.now.sh/graphql. The API utilizes [FIPS codes](https://en.wikipedia.org/wiki/Federal_Information_Processing_Standards) heavily. See the [FIPS state code table](https://en.wikipedia.org/wiki/Federal_Information_Processing_Standard_state_code) and [county code table](https://en.wikipedia.org/wiki/List_of_United_States_FIPS_codes_by_county). Thanks to the New York Times for releasing this data.

## Schema

```graphql
type Query {
  states(fips: ID): [State!]!        # get all states or a specific by FIPS
  counties(fips: ID): [County!]!     # get all counties or a specific by FIPS
  nation: Nation!                    # aggregate data on entire US (includes US territories)
}

type State {
  fips: ID!
  name: String!
  population: Int!                   # population from US Census 2019 estimates
  cases: Int!                        # COVID-19 cases from NYT's data
  deaths: Int!                       # COVID-19 deaths from NYT's data
  counties: [County!]!               # list of counties of state
  timeline(limit: Int): [DayTotal!]! # descending time series COVID data from NYT
}

type County {
  fips: ID!
  name: String!
  population: Int!
  cases: Int!
  deaths: Int!
  timeline(limit: Int): [DayTotal!]!
}

type Nation {
  fips: ID!
  name: String!
  population: Int!
  cases: Int!
  deaths: Int!
  timeline(limit: Int): [DayTotal!]!
}

type DayTotal {
  date: String!
  cases: Int!
  deaths: Int!
}
```

## Geographic Exceptions

In accordance with [the New York Times' geographic exceptions](https://github.com/nytimes/covid-19-data), the API handles New York City and Kansas City differently. All cases/deaths in New York City (encompassing New York, Kings, Queens, Bronx and Richmond counties) are reported under New York County (FIPS 36061). Kansas City's cases/deaths (encompassing Cass, Clay, Jackson, and Platte counties) are reported wholly in Jackson County by adding Kansas City's numbers to Jackson County's numbers.

## Example

```graphql
query {
  counties(fips: "31055") {
    name
    cases
    deaths
    timeline {
      cases
      deaths
    }
  }
}
```

Response:

```json
{
  "data": {
    "counties": [
      {
        "name": "Douglas County",
        "cases": 79,
        "deaths": 0,
        "timeline": [
          {
            "date": "2020-03-29T00:00:00.000Z",
            "cases": 79,
            "deaths": 1
          },
          {
            "date": "2020-03-28T00:00:00.000Z",
            "cases": 74,
            "deaths": 1
          }
        ]
      }
    ]
  }
}
```
