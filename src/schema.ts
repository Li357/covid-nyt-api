import { gql } from 'apollo-server-micro';

export default gql`
  type DayTotal {
    date: String!
    cases: Int!
    deaths: Int!
  }

  type State {
    fips: ID!
    name: String!
    population: Int!
    cases: Int!
    deaths: Int!
    counties: [County!]!
    timeline: [DayTotal!]!
    lastUpdated: String!
  }

  type County {
    fips: ID!
    name: String!
    population: Int!
    cases: Int!
    deaths: Int!
    timeline: [DayTotal!]!
    lastUpdated: String!
  }

  type Query {
    states: [State!]!
    counties: [County!]!
  }
`;
