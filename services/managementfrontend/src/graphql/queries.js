const { gql } = require('@apollo/client');

export const GET_ALL_VIPS = gql`
  query allVipsQuery($queryParams: TableInput) {
    allVips(queryParams: $queryParams) {
      count
      data {
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
  query AllPlayers($queryParams: TableInput) {
    allPlayers(queryParams: $queryParams) {
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
  query AllUsers($queryParams: TableInput) {
    allUsers(queryParams: $queryParams) {
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

export const GET_SERVERINFO = gql`
  query ServerInfo($serverId: Int!) {
    serverInfo(serverId: $serverId) {
      server_name
      playercount
      max_playercount
      game_mode
      map
      rounds_played
      rounds_total
      scores {
        number_of_entries
        scores
        target_score
      }
      online_state
      ranked
      punkbuster
      has_gamepassword
      server_uptime
      roundtime
      game_ip_and_port
      punkbuster_version
      join_queue_enabled
      region
      closest_ping_site
      country
      blaze_player_count
      blaze_game_state
    }
  }
`

export const LIST_PLAYERS = gql`
  query ListPlayers($serverId: Int!) {
    listPlayers(serverId: $serverId) {
      player_name
      eaid
      squad
      team
      kills
      deaths
      score
      rank
      ping
    }
  }
`
