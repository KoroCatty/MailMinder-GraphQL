import Image from 'react-bootstrap/Image';

// Emotion
import { css } from '@emotion/react'

const homeHeroStyles = css`
  position: relative;
  width: 100%;

  img {
    width: 100vw;
    height: 80vh;
    /* object-fit: cover; */
    background-size: cover;
    aspect-ratio: 16/9;
  }
  .titleWrap {
    position: absolute;
    inset: 45% 0 0 40%;
    transform: translate(-50%, -50%);
  }
  h1 {
    color: brown;
  }
  button {
    background-color: red;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
      background-color: blue;
      transition: 0.3s ease-in-out;
    }
  }
`;

const HomeHero = () => {
  return (
    <>
      <section css={homeHeroStyles}>
        <Image src="/imgs/clock.jpeg" fluid />

        {/* <div className='titleWrap'>
          <h1>Email Reminder</h1>
          <button>Start</button>
        </div> */}

      </section>
    </>
  )
}

export default HomeHero