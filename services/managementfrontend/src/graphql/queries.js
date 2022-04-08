const { gql } = require('@apollo/client');

export const GET_ALL_VIPS = gql`
  query allVipsQuery {
    allVips {
      ID
      gametype
      servergroup
      playername
      timestamp
      status
      admin
      comment
      guid
      discord_id
    }
  }
`;

export const GET_GAMES = gql`
  query GetGames {
    getGames {
      GameID
      Name
    }
  }
`;

export const GET_SERVERS_BY_GAMEID = gql`
  query GetServersByGameID($gameId: Int!) {
    getServersByGameID(gameID: $gameId) {
      ServerID
      ServerGroup
      ServerName
      GameID
    }
  }
`;

export const GET_ALL_PLAYERS = gql`
  query AllPlayers($skip: Int, $limit: Int, $search: String) {
    allPlayers(skip: $skip, limit: $limit, search: $search) {
      count
      data {
        PlayerID
        GameID
        ClanTag
        SoldierName
        GlobalRank
        PBGUID
        EAGUID
        IP_Address
        DiscordID
        CountryCode
        created_at
        updated_at
      }
    }
  }
`;

export const GET_ALL_USERS = gql`
  query AllUsers($skip: Int, $limit: Int, $search: String) {
    allUsers(skip: $skip, limit: $limit, search: $search) {
      count
      data {
        signedIn
        userId
        email
        name
        roles
        userRoles {
          id
          name
          description
        }
      }
    }
  }
`;

export const GET_ME = gql`
  query Me {
    me {
      signedIn
      userId
      email
      name
      roles
    }
  }
`

export const GET_USER = gql`
  query GetUser($userId: Int!) {
    getUser(userId: $userId) {
      signedIn
      userId
      email
      name
      roles
      userRoles {
        description
        name
        id
      }
    }
  }
`

export const GET_VIP = gql`
  query GetVip($vipId: Int!) {
    getVip(vipId: $vipId) {
      ID
      gametype
      servergroup
      playername
      timestamp
      status
      admin
      comment
      guid
      discord_id
    }
  }
`
