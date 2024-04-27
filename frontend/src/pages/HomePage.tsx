// import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Home components
import HomeForms from "../components/features/home/HomeForms";
import RecentPosts from "../components/features/home/RecentPosts";
// import MonthPosts from '../components/features/home/MonthPosts';
import { CommonBtn } from "../components/common/CommonBtn";

// Apollo client
// import { GET_POSTS_BY_ID } from "../graphql/queries";
import { GET_POSTS_BY_ID_LIMIT } from "../graphql/queries";
import { useQuery } from "@apollo/client";

// bootstrap
import { Container } from "react-bootstrap";

// Emotion CSS (Responsive Design)
import { css } from "@emotion/react";
import { min, max } from "../utils/mediaQueries";
const HomePageCss = css`
  .homeContainer {
    @media screen and (max-width: 999px) and (min-width: 768px) {
      width: 96% !important;
      max-width: 96% !important;
      margin: 0 auto;
    }
  }

  .loginBtn {
    text-decoration: none;

    &__item {
      background-color: #000000;
      margin: 0 auto;
      display: block;

      @media screen and (max-width: 1200px) {
        margin: 2rem auto;
      }

      // 1px〜479px
      ${min[0] + max[0]} {
        margin: 1rem auto;
        padding: 0.8rem 2rem;
        font-size: 1rem;
        text-align: center;
        width: fit-content;
      }
    }
  }
`;

// TYPE
type IsLoggedInPropType = {
  isLoggedIn: boolean;
};

//! ============================================
const HomePage = ({ isLoggedIn }: IsLoggedInPropType) => {
  // Get 4 Posts by User ID
  const { data, loading, error, refetch } = useQuery(GET_POSTS_BY_ID_LIMIT, {
    variables: {
      uid: Number(), // backend (resolver) で id を指定しているので、空にする
      limit: Number(4),
    },
  });

  return (
    <main css={HomePageCss}>
      {/* LOGIN CHECK */}
      {isLoggedIn ? (
        <Container className="homeContainer">
          <RecentPosts
            data={data}
            loading={loading}
            error={error}
            refetch={refetch}
          />
          <HomeForms refetch={refetch} />
          {/* <MonthPosts /> */}
        </Container>
      ) : (
        <Container className="homeContainer">
          <Link to="/login" className="loginBtn">
            <CommonBtn type="button" className="loginBtn__item">
              LOGIN
            </CommonBtn>
          </Link>
        </Container>
      )}
    </main>
  );
};

export default HomePage;
