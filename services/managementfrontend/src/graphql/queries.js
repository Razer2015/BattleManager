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
