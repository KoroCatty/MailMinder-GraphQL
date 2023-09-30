// Home components
import HomeHero from '../components/features/home/HomeHero';
import HomeForms from '../components/features/home/HomeForms';
import RecentPosts from '../components/features/home/RecentPosts';
import MonthPosts from '../components/features/home/MonthPosts';

// bootstrap
import {Container} from 'react-bootstrap';


const HomePage = () => {

// fetch data from backend
// const fetchData = async () => {
//   const res = await fetch('http://localhost:5001/api/posts');
//   const data = await res.json();
//   console.log(data);
// }
// fetchData();

  return (
    <main>
      <HomeHero />

      <Container>
        <RecentPosts />
        <HomeForms />
        <MonthPosts />
      </Container>
    </main>
  )
}

export default HomePage