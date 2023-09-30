
import { gql } from '@apollo/client';

//! GET ALL USERS
export const GET_ALL_USERS = gql`
  query getAllUsers {
    users {
      id
      firstName
      lastName
      email
    }
  }
`
//! GET USER BY ID
export const GET_ALL_MESSAGES = gql`
  query MessagesByUser($receiverId: Int!) {
    messagesByUser(receiverId: $receiverId) {
      id
      text
      receiverId
      senderId
      createdAt
    }
  }
`





