import Image from "react-bootstrap/Image";
import { useLocation } from "react-router-dom";

// Emotion CSS (Responsive Design)
import { css } from "@emotion/react";
import { min, max } from "../../utils/mediaQueries";

const HeroStyles = css`
  @media screen and (min-width: 991px) {
    position: relative;
    width: 100%;

    img {
      width: 100vw;
      height: 80vh;
    }
  }

  .homeHero {
    // 1px〜479px
    ${min[0] + max[0]} {
      display: none;
    }
    // 480px〜767px
    ${min[1] + max[1]} {
      display: none;
    }
  }

  .homeHero__sp {
    display: none;

    // 1px〜479px
    ${min[0] + max[0]} {
      display: block;
    }
    // 480px〜767px
    ${min[1] + max[1]} {
      display: block;
    }
  }

  .postsHero {
    position: relative;

    &__img {
      height: 280px;
      opacity: 0.7;
      filter: blur(2px) brightness(0.8);
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);

      // 1px〜479px
      ${min[0] + max[0]} {
        height: 160px;
      }
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

      // 1px〜479px
      ${min[0] + max[0]} {
        font-size: 2.1rem;
      }
      // 480px〜767px
      ${min[1] + max[1]} {
        font-size: 3rem;
      }
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
        {/* Display in '/' Page */}
        {location.pathname === "/" && (
          <>
            <Image src="/imgs/hero.jpg" fluid className="homeHero" />
            <Image src="/imgs/hero_sub2.jpg" fluid className="homeHero__sp" />
          </>
        )}

        {/* Display in '/postlist' Page */}
        {location.pathname === "/postlist" && (
          <div className="postsHero">
            <Image
              src="/imgs/postHero.jpg"
              fluid
              className="postsHero__img"
              alt="Post Hero Image"
            />
            <h1 className="postsHero__title">All Posts List</h1>
          </div>
        )}
      </section>
    </>
  );
};

export default Hero;
