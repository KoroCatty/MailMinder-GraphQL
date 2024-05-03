import Image from "react-bootstrap/Image";
import { useLocation } from "react-router-dom";

import { Link } from "react-router-dom";

// Emotion CSS (Responsive Design)
import { css } from "@emotion/react";
import { min, max } from "../../utils/mediaQueries";

const Hero = () => {
  const location = useLocation();
  // console.log(location.pathname); // ex) /about
  const HeroStyles = css`
    @media screen and (min-width: 1200px) {
      position: relative;
      width: 100%;

      img {
        width: 85%;
        object-fit: cover;
        margin-left: auto;
        display: block;
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

    .heroWrap {
      position: relative;

      .loginBtn {
        position: absolute;
        top: 75%;
        left: 31%;
        transform: translate(-31%, -75%);
        padding: 1.6rem 4rem;
        color: #ffffff;
        background-color: #000000;
        letter-spacing: 0.1rem;
        font-size: 1.2rem;

        // 1px〜479px
        ${min[0] + max[0]} {
          font-size: 0.7rem;
          padding: 0.4rem 1rem;
          top: 75% !important;
          left: 15% !important;
          display: none;
        }
        // 480px〜767px
        ${min[1] + max[1]} {
          font-size: 0.8rem;
          padding: 0.7rem 2rem;
          display: none;
        }
        // 768px〜1023px
        ${min[2] + max[2]} {
          font-size: 1rem;
          padding: 1rem 2.6rem;
        }

        @media screen and (max-width: 1200px) {
          top: 75%;
          left: 16%;
          transform: translate(-17%, -73%);
        }

        @media screen and (min-width: 1000px) {
          &:hover {
            opacity: 0.8;
            transition: all 0.3s ease-in-out;
            color: black;
          }
        }
      }
    }
  `;

  return (
    <>
      <section css={HeroStyles}>
        {/* Display in '/' Page */}
        {location.pathname === "/" && (
          <div className="heroWrap">
            <Image src="/imgs/mailMinder_hero_pc.jpg" fluid className="homeHero" />
            <Image
              src="/imgs/mailMinder_hero_sp.jpg"
              fluid
              className="homeHero__sp"
            />

            <Link to="/login" className="loginBtn">
              LOGIN
            </Link>
            {/* <Image src="/imgs/hero_sub2.jpg" fluid className="homeHero__sp" /> */}
          </div>
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
