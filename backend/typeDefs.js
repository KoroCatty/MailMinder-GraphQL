import { gql } from 'graphql-tag';

//! ==========================================================
//! Schema
//! ==========================================================
const typeDefs = gql`
  scalar Date # 
  scalar Upload # Uploadはスカラー型

  type Token {
    token: String!
  }

# QUERY
  type Query {
    users: [User!]! # return an array
    PostsByUser(id: ID!): [Post!]! # resolverで定義した名前を使う
    PostsByUserLimit(id: ID!, limit: Int!): [Post!]! # limit を使ったresolver関数
  }

#//!  実際にクライエントに返すデータの型(これを使い回す)
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String
    # password: String # never return password to client
  }

#//!  実際にクライエントに返すデータの型(これを使い回す)
  type Post {
    id: ID!
    title: String!
    content: String!
    imgUrl: String!
    createdAt: Date!
    updatedAt: Date!
    user : User! # PostモデルにはUserモデルが含まれている
  }

  #//! CREATE A USER
  #//* My own input type 1 (mutationで使える)
  input UserInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }

  #//! SIGNIN A USER INPUT
  #//* My own input type 2 (mutationで使える)
  input UserSigninInput {
    email: String!
    password: String!
  }

  # //! CREATE A POST INPUT
  input PostInput {
    title: String!
    content: String!
    imgUrl: Upload
  }

  # //! UPDATE A POST INPUT
  input PostUpdateInput {
    title: String!
    content: String!
    # expecting a file upload. If you're sending a URL or base64 string instead of a file, this could be causing the issue.
    imgUrl: Upload
    # imgUrl: String
    updatedAt: Date
  }

# //! IMAGE FILE TYPE
  type File {
  filename: String!
  mimetype: String!
  encoding: String
}


  # MUTATION (これらを resolver で使う)
   type Mutation {
    # CREATE USER
    signupUser(userNew: UserInput!): User! # return a single user (配列じゃない)

    # SIGNIN USER
    signinUser(userSignin: UserSigninInput!): Token! #トークンを返す

    # CREATE A POST
    createPost(postNew: PostInput!): Post! # これが playground で出現

    # DELETE A POST
    deletePost(id: ID!): Post!

    # UPDATE A POST
    # Here, the mutation expects an id and a postUpdate object of type PostUpdateInput. This PostUpdateInput has fields title, content, imgUrl, and updatedAt.
    updatePost(id: ID!, postUpdate: PostUpdateInput!): Post!
  }
`;

export default typeDefs;