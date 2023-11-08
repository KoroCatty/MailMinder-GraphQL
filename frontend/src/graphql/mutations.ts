import { gql } from "@apollo/client";

//! Sign Up (Create User)
export const SIGNUP_USER = gql`
  mutation signupUser($userNew: UserInput!) {
      # signupUser is defined in resolvers.js
    signupUser(userNew: $userNew) {
      #  Frontend に返すデータを下記に定義し、console.log()で確認可能になる
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
      imgCloudinaryUrl
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
      imgCloudinaryUrl
      imgCloudinaryId
    }
  }
`;

//! LOGOUT USER
export const LOGOUT_MUTATION = gql`
    mutation Logout {
    logout
  }
`;

//! DELETE A POST IMAGE FILE
export const DELETE_POST_IMAGE_FILE = gql`
  mutation deletePostImage($id: ID!) {
    deletePostImage(id: $id) {
      id
      imgUrl
      imgCloudinaryUrl
      imgCloudinaryId
    }
  }
`;

//! DELETE A CLOUDINARY IMAGE FILE ON SERVER
export const DELETE_CLOUDINARY_IMAGE_FILE = gql`
mutation deleteCloudinaryImage($publicId: String) {
  deleteCloudinaryImage(publicId: $publicId)
}
`