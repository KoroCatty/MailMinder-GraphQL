import { gql } from "@apollo/client";

//! Sign Up (Create User)
export const SIGNUP_USER = gql`
  mutation signupUser($userNew: UserInput!) {
    signupUser(userNew: $userNew) {
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
