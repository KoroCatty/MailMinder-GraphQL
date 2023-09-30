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

//! Create Message (Send Message)
export const SEND_MEG = gql`
  mutation CreateMessage($receiverId: Int!, $text: String!) {
    createMessage(receiverId: $receiverId, text: $text) {
      id
      text
      receiverId 
      senderId
      createdAt
    }
  }
`;
