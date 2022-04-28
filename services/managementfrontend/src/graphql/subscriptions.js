const { gql } = require('@apollo/client');

export const CHAT_MESSAGE_RECEIVED = gql`
  subscription Subscription {
    chatMessageReceived {
      visibility
      message
      player
      teamId
      squadId
      timestamp
    }
  }
`;
