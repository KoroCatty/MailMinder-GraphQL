import { gql } from "graphql-tag";

//! ==========================================================
//! Schema
//! ==========================================================
const typeDefs = gql`
  scalar Date
  scalar Upload

  type Token {
    token: String
  }

  type Image {
    imageUrl: String
    imgCloudinaryUrl: String
    imgCloudinaryId: String
  }

  # QUERY
  type Query {
    users: [User!]! # return an array
    PostsByUser(id: ID!, first: Int, skip: Int): PostTotalCount #(pagination & total数を実装)
    PostsByUserLimit(id: ID!, limit: Int!): [Post!]! # limit を使ったresolver関数
    isLoggedIn: Boolean! # login しているかどうか
    getLoggedInUserDetails: User # login しているユーザーの詳細情報
    getUserImgByUserId(userId: ID!): Image
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
    user: User! # PostモデルにはUserモデルが含まれている
    imgCloudinaryUrl: String
    imgCloudinaryId: String
  }

  type PostTotalCount {
    items: [Post!]! # 上の Post オブジェクトを、items という配列に格納 (Postが nestされるので注意)
    totalCount: Int
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
    # imgUrl: String
    # imgUrl: File
    imgUrl: Upload
    # imgFile: Upload
    imgCloudinaryUrl: String
    imgCloudinaryId: String
  }

  # //! UPDATE A POST INPUT
  input PostUpdateInput {
    title: String!
    content: String!
    imgUrl: String
    imgCloudinaryUrl: String
    imgCloudinaryId: String
    updatedAt: Date
  }

  # //! MONGO - CREATE A USER PROFILE IMAGE
  input UserProfileImgInput {
    userId: ID!
    imageUrl: String!
    imgCloudinaryUrl: String!
    imgCloudinaryId: String!
  }

  # MUTATION (これらを resolver で使う)
  type Mutation {
    # CREATE USER
    signupUser(userNew: UserInput!): User! # return a single user (配列じゃない)
    # SIGNIN USER
    signinUser(userSignin: UserSigninInput!): Token #トークンを返す
    # CREATE A POST
    createPost(postNew: PostInput!): Post! # これが playground で出現
    # DELETE A POST
    deletePost(id: ID!): Post!

    # UPDATE A POST
    # The mutation expects an id and a postUpdate object of type PostUpdateInput. This PostUpdateInput has fields title, content, imgUrl, and updatedAt.
    updatePost(id: ID!, postUpdate: PostUpdateInput!): Post!

    # DELETE A POST IMAGE FILE
    deletePostImage(id: ID!): Post!

    # LOGOUT USER
    logout: Boolean! # return a boolean
    # DELETE A CLOUDINARY IMAGE FILE ON SERVER
    deleteCloudinaryImage(publicId: String): Boolean

    # MONGO - CREATE USER PROFILE IMAGE
    # create_profile_img_mongo(userId: String): Image
    create_profile_img_mongo(input: UserProfileImgInput!): Image!
  }
`;

export default typeDefs;
