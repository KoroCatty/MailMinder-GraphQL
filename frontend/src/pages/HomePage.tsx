// Home components
import HomeHero from '../components/features/home/HomeHero';
import HomeForms from '../components/features/home/HomeForms';
import RecentPosts from '../components/features/home/RecentPosts';
// import MonthPosts from '../components/features/home/MonthPosts';

// bootstrap
import {Container} from 'react-bootstrap';


const HomePage = () => {

  return (
    <main>
      <HomeHero />

      <Container>
        <RecentPosts />
        <HomeForms />
        {/* <MonthPosts /> */}
      </Container>
    </main>
  )
}

export default HomePage