import { gql } from "@apollo/client";

//! Sign Up (Create User)
export const SIGNUP_USER = gql`
  mutation signupUser($userNew: UserInput!) {
    signupUser(userNew: $userNew) {
      # signupUser is defined in resolvers.js
      id
      email
      firstName
      lastName
    }
  }
`;

//! Sign In (Login User)
export const LOGIN_USER = gql`
  mutation SigninUser($userSignin: UserSigninInput!) {
    signinUser(userSignin: $userSignin) {
      token
    }
  }
`;

//! Create A Post
export const CREATE_POST = gql`
  mutation CreatePost($postNew: PostInput!) {
    createPost(postNew: $postNew) {
      id
      title
      content
      imgUrl
      createdAt
      updatedAt
    }
  }
`;

//! DELETE A POST BY ID
export const DELETE_POST_BY_ID = gql`
  mutation deletePostById($id: ID!) {
    deletePost(id: $id) {
      id
      title
      content
      imgUrl
    }
  }
`;

//! UPDATE A POST BY ID
export const UPDATE_POST_BY_ID = gql`
  mutation updatePostById($postUpdate: PostUpdateInput!, $updatePostId: ID!) {
    updatePost(postUpdate: $postUpdate, id: $updatePostId) {
      id
      title
      content
      imgUrl
      createdAt
      updatedAt
    }
  }
`;
