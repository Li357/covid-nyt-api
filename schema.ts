import { gql } from 'apollo-server';

export default gql`
  type DayTotal {
    date: Date!
    cases: Int!
    deaths: Int!
  }

  type Region {
    fips: ID!
    name: String!
    population: Int!
    cases: Int!
    deaths: Int!
    timeline: [DayTotal!]!
    lastUpdated: Date!
  }

  type State implements Region {
    counties: [County!]!
  }

  type County implements Region {

  }

  type Query {
    states: [State!]!
    counties: [County!]!
  }
`;
