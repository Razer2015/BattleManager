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
    signedIn: Boolean
    userId: Int
    email: String
    name: String
    roles: [String]
    userRoles: [Role]
  }

  type Role {
    id: Int!
    name: String
    description: String
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

  type Game {
    GameID: Int!
    Name: String
  }

  type Server {
    ServerID: Int!
    ServerGroup: Int!
    ServerName: String
    GameID: Int!
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

  type ServerInfo {
    server_name:                                                       String
    playercount:                                                       Int
    max_playercount:                                                   Int
    game_mode:                                                         String
    map:                                                               String
    rounds_played:                                                     Int
    rounds_total:                                                      Int
    scores:                                                            Scores
    online_state:                                                      String
    ranked:                                                            Boolean
    punkbuster:                                                        Boolean
    has_gamepassword:                                                  Boolean
    server_uptime:                                                     Timestamp
    roundtime:                                                         Timestamp
    game_ip_and_port:                                                  String
    punkbuster_version:                                                String
    join_queue_enabled:                                                Boolean
    region:                                                            String
    closest_ping_site:                                                 String
    country:                                                           String
    blaze_player_count:                                                Int
    blaze_game_state:                                                  String
  }

  type Scores {
    number_of_entries: Int
    scores: [Int]
    target_score: Int
  }

  type Player {
    player_name: String
    eaid: String
    squad: Int
    team: Int
    kills: Int
    deaths: Int
    score: Int
    rank: Int
    ping: Int
  }

  type PaginatedPlayerData {
    count: Int!
    data: [PlayerData!]
  }

  type PaginatedUserData {
    count: Int!
    data: [User!]
  }

  type Query {
    me: User
    vip(id: Int!): Vip
    allVips: [Vip!]!
    getVip(vipId: Int!): Vip
    allPlayers(skip: Int, limit: Int, search: String): PaginatedPlayerData!
    allUsers(skip: Int, limit: Int, search: String): PaginatedUserData!
    getUser(userId: Int!): User
    getGames: [Game!]!
    getServers: [Server!]!
    getServersByGameID(gameID: Int!): [Server!]!
    serverInfo(serverId: Int!): ServerInfo
    listPlayers(serverId: Int!): [Player]
  }

  input UserInput {
    name: String
    email: String!
    password: String!
    roles: [Int!]!
  }

  input UserUpdateInput {
    name: String
    email: String!
    roles: [Int!]!
  }

  input VipInput {
    gametype: Int!
    servergroup: Int!
    playername: String!
    timestamp: Timestamp!
    status: String!
    comment: String
    discord_id: BigInt
  }

  input VipUpdateInput {
    playername: String!
    timestamp: Timestamp!
    status: String!
    comment: String
    discord_id: BigInt
  }

  type Mutation {
    createUser(user: UserInput!): User
    updateUser(userId: Int!, user: UserUpdateInput!): User
    deleteUser(userId: Int!): User
    login(email: String!, password: String!): Token
    loginSafe(email: String!, password: String!): User
    logout: String
    token(refreshToken: String!): Token
    tokenSafe: User
    createVip(vip: VipInput!): Vip
    updateVip(vipId: Int!, vip: VipUpdateInput!): Vip
    deleteVip(vipId: Int!): Vip
  }
`;