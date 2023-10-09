import Image from "react-bootstrap/Image";

// Emotion
import { css } from "@emotion/react";

import { useLocation } from "react-router-dom";


const HeroStyles = css`
  @media screen and (min-width: 991px) {
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
  }

  .postList {
    position: relative;

    &__img {
      height: 280px;
      opacity: 0.7;
      filter: blur(2px) brightness(0.8);
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
    }

    &__title {
      position: absolute;
      top: 50%;
      left: 34%;
      transform: translate(-50%, -50%);
      color: #ffffff;
      font-size: 4rem;
      font-weight: 700;
      text-shadow: 1px 1px 6px black;
    }
  }
`;

//! ============================================
const Hero = () => {

  const location = useLocation();
  // console.log(location.pathname); // ex) /about

  return (
    <>
      <section css={HeroStyles}>
        {/* Display in Home Page */}
        {location.pathname === "/" && <Image src="/imgs/hero.jpg" fluid />}

        {/* Display in settings Page */}
        {location.pathname === "/postlist" && (
          <div className="postList">
            <Image src="/imgs/postHero.jpg" fluid className="postList__img" alt="Post Hero Image" />
            <h1 className="postList__title">All Posts List</h1>
          </div>
        )
        }
      </section>
    </>
  );
};

export default Hero;
