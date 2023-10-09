// Home components
import HomeHero from '../components/features/home/HomeHero';
import HomeForms from '../components/features/home/HomeForms';
import RecentPosts from '../components/features/home/RecentPosts';
// import MonthPosts from '../components/features/home/MonthPosts';

// bootstrap
import {Container} from 'react-bootstrap';


// Emotion CSS (Responsive Design)
import { css } from "@emotion/react";
// import { min, max } from "../../utils/mediaQueries";
const aaa = css`
  margin-left: 16%;
  /* margin-left: 300px !important; */


  `;

const HomePage = () => {

  return (
    <main css={aaa}>
      <HomeHero />

      <Container style={{padding: "0 100px"}}>
        <RecentPosts />
        <HomeForms />
        {/* <MonthPosts /> */}
      </Container>
    </main>
  )
}

export default HomePage