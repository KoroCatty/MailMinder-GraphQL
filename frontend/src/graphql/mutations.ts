import { gql } from "@apollo/client";

//! Sign Up (Create User)
export const SIGNUP_USER = gql`
  mutation signupUser($userNew: UserInput!) {
    signupUser(userNew: $userNew) { # signupUser is defined in resolvers.js
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

//! Upload an Image File
export const UPLOAD_FILE = gql`
  mutation UploadFile($file: Upload!) {
    uploadFile(file: $file) {
      filename
      mimetype
      encoding
    }
  }
`;