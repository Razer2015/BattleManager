const { gql } = require('@apollo/client');

export const CREATE_USER = gql`
  mutation CreateUser($user: UserInput!) {
    createUser(user: $user) {
      userId
      email
      name
      roles
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($userId: Int!, $user: UserUpdateInput!) {
    updateUser(userId: $userId, user: $user) {
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
`;

export const DELETE_USER = gql`
  mutation DeleteUser($userId: Int!) {
    deleteUser(userId: $userId) {
      userId
      email
      name
    }
  }
`;


export const CREATE_VIP = gql`
  mutation CreateVip($vip: VipInput!) {
    createVip(vip: $vip) {
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

export const UPDATE_VIP = gql`
  mutation UpdateVip($vipId: Int!, $vip: VipUpdateInput!) {
    updateVip(vipId: $vipId, vip: $vip) {
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

export const DELETE_VIP = gql`
  mutation DeleteVip($vipId: Int!) {
    deleteVip(vipId: $vipId) {
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

export const LOGIN = gql`
  mutation LoginSafe($email: String!, $password: String!) {
    loginSafe(email: $email, password: $password) {
      userId
      email
      name
      roles
    }
  }
`;

export const TOKEN = gql`
  mutation TokenSafe {
    tokenSafe {
      userId
      email
      name
      roles
    }
  }
`;

export const LOGOUT = gql`
  mutation Logout {
    logout
  }
`;
