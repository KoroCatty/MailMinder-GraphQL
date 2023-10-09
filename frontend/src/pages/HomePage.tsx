// Home components
// import HomeHero from "../components/features/home/HomeHero";
import HomeForms from "../components/features/home/HomeForms";
import RecentPosts from "../components/features/home/RecentPosts";
// import MonthPosts from '../components/features/home/MonthPosts';

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
`;

//! ============================================
const HomePage = () => {
  return (
    <main css={HomePageCss}>
      {/* <HomeHero /> */}

      <Container className="homeContainer">
        <RecentPosts />
        <HomeForms />
        {/* <MonthPosts /> */}
      </Container>
    </main>
  );
};

export default HomePage;
