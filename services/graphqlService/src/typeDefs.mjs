import { gql } from 'apollo-server-core'

export const typeDefs = gql`
  scalar BigInt
  scalar Timestamp

  type Token {
    accessToken: String
    accessTokenLife: Int
    refreshToken: String
    refreshTokenLife: Int
  }

  type User {
    isLoggedIn: Boolean
    userId: Int
    email: String
    name: String
    roles: [String]
  }

  type Vip {
    ID: Int!
    gametype: String!
    servergroup: String!
    playername: String
    timestamp: Timestamp
    status: String!
    admin: String
    comment: String
    guid: String
    discord_id: BigInt
  }

  type PlayerData {
    PlayerID:                                                          Int!
    GameID:                                                            Int
    ClanTag:                                                           String
    SoldierName:                                                       String
    GlobalRank:                                                        Int
    PBGUID:                                                            String
    EAGUID:                                                            String
    IP_Address:                                                        String
    DiscordID:                                                         String
    CountryCode:                                                       String
    created_at:                                                        Timestamp
    updated_at:                                                        Timestamp
  }

  type PaginatedPlayerData {
    count: Int!
    data: [PlayerData!]
  }

  type Query {
    me: User
    vip(id: Int!): Vip
    allVips: [Vip!]!
    allPlayers(skip: Int, limit: Int, search: String): PaginatedPlayerData!
  }

  type Mutation {
    createUser(email: String!, password: String!, name: String): Token
    login(email: String!, password: String!): Token
    loginSafe(email: String!, password: String!): User
    logout: String
    token(refreshToken: String!): Token
    tokenSafe: User
    createVip(name: String!, email: String!, password: String!): Vip!
  }
`;