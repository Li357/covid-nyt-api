import { gql } from 'apollo-server-micro';

export default gql`
  type DayTotal {
    date: String!
    cases: Int!
    deaths: Int!
  }

  type Nation {
    fips: ID!
    name: String!
    population: Int!
    cases: Int!
    deaths: Int!
    timeline: [DayTotal!]!
  }

  type State {
    fips: ID!
    name: String!
    population: Int!
    cases: Int!
    deaths: Int!
    counties: [County!]!
    timeline: [DayTotal!]!
  }

  type County {
    fips: ID!
    name: String!
    population: Int!
    cases: Int!
    deaths: Int!
    timeline: [DayTotal!]!
  }

  type Query {
    states(fips: ID): [State!]!
    counties(fips: ID): [County!]!
    nation: Nation!
  }
`;
