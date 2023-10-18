// import { useState } from "react";
import { Link } from "react-router-dom";

// Home components
import HomeForms from "../components/features/home/HomeForms";
import RecentPosts from "../components/features/home/RecentPosts";
// import MonthPosts from '../components/features/home/MonthPosts';

import { CommonBtn } from "../components/common/CommonBtn";

// bootstrap
import { Container } from "react-bootstrap";

// Emotion CSS (Responsive Design)
import { css } from "@emotion/react";
import { min, max } from "../utils/mediaQueries";
const HomePageCss = css`
  // 1px〜479px
  ${min[0] + max[0]} {
  }
  // 480px〜767px
  ${min[1] + max[1]} {
  }
  // 768px〜989px
  ${min[2] + max[2]} {
  }
  // 990px〜
  ${min[3] + max[3]} {
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

//! ============================================
const HomePage = () => {
  // Login Check By Token in LocalStorage
  // const [loggedIn, setLoggedIn] = useState(
  //   localStorage.getItem("token_GraphQL") ? true : false
  // );

  const loggedIn = localStorage.getItem("token_GraphQL") ? true : false;

  return (
    <main css={HomePageCss}>
      {loggedIn ? (
        <Container className="homeContainer">
          <RecentPosts />
          <HomeForms />
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
