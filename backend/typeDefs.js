// import { gql } from 'apollo-server';
import { gql } from 'graphql-tag';

//! ==========================================================
//! Schema
//! ==========================================================
const typeDefs = gql`
# QUERY
  type Query {
    users: [User!]! # return an array
    messagesByUser(receiverId: Int!):[Message!]!
  }

#//!  実際にクライエントに返すデータの型(これを使い回す)
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String
    # password: String # never return password to client
  }
  #//! CREATE A USER
  #//* My own input type 1 (mutationで使える)
  input UserInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }

  type Token {
    token: String!
  }

  #//! SIGNIN A USER INPUT
  #//* My own input type 2 (mutationで使える)
  input UserSigninInput {
    email: String!
    password: String!
  }

  scalar Date # これは scalar type なので、自分で定義しなくてもいい

  #//! CREATE A MESSAGE INPUT 
  type Message {
  id: ID!
  text: String!
  receiverId: Int!
  senderId: Int!
  createdAt: Date! # これは scalar type なので、自分で定義しなくてもいい
  }

  # MUTATION
   type Mutation {
    # CREATE USER
    signupUser(userNew: UserInput!): User! # return a single user (配列じゃない)

    # SIGNIN USER
    signinUser(userSignin: UserSigninInput!): Token! #トークンを返す

    # CREATE A MESSAGE
    createMessage( receiverId: Int!, text: String ): Message!
  }
`;

export default typeDefs;