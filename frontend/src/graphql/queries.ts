
import { gql } from '@apollo/client';

//! GET POSTS BY ID
export const GET_POSTS_BY_ID = gql`
  query getPostsById($uid: ID!) { # getPostsById の命名は何でもok
    PostsByUser(id: $uid) { # resolver で定義した名前
    # 以下はフロント側で使えるように定義(consoleで確認可能になる)
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

//! GET POSTS BY ID WITH LIMIT
export const GET_POSTS_BY_ID_LIMIT = gql`
  query getPostsByIdLimit($uid: ID!, $limit: Int!) { # getPostsById の命名は何でもok
    PostsByUserLimit(id: $uid, limit: $limit) { # resolver で定義した名前
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

//! GET LOGIN USER STATUS
export const IS_LOGGED_IN_QUERY = gql`
    query IsLoggedIn {
    isLoggedIn
  }
`;





