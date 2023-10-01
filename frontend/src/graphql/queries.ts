
import { gql } from '@apollo/client';

//! GET POSTS BY ID
export const GET_POSTS_BY_ID = gql`
  query getPostsById($uid: ID!) { # getPostsById の命名は何でもok
    PostsByUser(id: $uid) { # resolver で定義した名前
      id
      title
      content
      imgUrl
      createdAt
      updatedAt

    }
  }
`





