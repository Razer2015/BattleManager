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
