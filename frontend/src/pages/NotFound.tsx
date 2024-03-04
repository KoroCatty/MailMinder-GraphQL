import { Link } from "react-router-dom";
// Image (import することで URL によって動的にパスが変わるのを防ぐ)
import notFoundHeroImage from "/imgs/hero_404.jpg";

// Color schema
import colorSchema from "../utils/colorSchema";

// Emotion CSS (Responsive Design)
import { css } from "@emotion/react";
import { min, max } from "../utils/mediaQueries";

const notFoundCss = css`
  position: relative;
  margin-bottom: -8px;

  // 1201px 以上の場合
  @media screen and (min-width: 1201px) {
    padding-left: 16%; // header の幅分だけ右にずらす
  }

  .notFoundHeroWrap {
    position: relative;

    .titleWrap {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      @media screen and (max-width: 1201px) {
        width: 90%;
        text-align: center;
      }

      &__title {
        font-size: 3rem;
        letter-spacing: 6px;
        background: linear-gradient(
          to left,
          #fff20d 0,
          #ff790d 14.28%,
          #ff0d1a 28.56%,
          #f20dff 42.85%,
          #0d93ff 57.14%,
          #0dfff2 71.42%,
          #93ff0d 85.71%,
          #fff20d 100%
        );
        width: content-fit;
        max-width: 1000px;
        background-size: 1000%;
        -webkit-text-fill-color: transparent;
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-animation: gra 10s linear infinite;
        animation: gra 10s linear infinite;

        @keyframes gra {
          to {
            background-position-x: -110%;
          }
        }

        // 1px〜479px
        ${min[0] + max[0]} {
          font-size: 1.6rem;
        }
      }
    }

    &__img {
      height: 70vh;
      width: 100%;
      object-fit: cover;
      filter: brightness(0.5);
      animation: fadein1 1s forwards;

      @keyframes fadein1 {
        0% {
          opacity: 0;
        }
        100% {
          opacity: 1;
        }
      }

      // 1px〜479px
      ${min[0] + max[0]} {
        height: 50vh;
      }
    }
  }

  // Give a classNameProp to BackButton.tsx
  .notFoundBackBtn {
    position: absolute;
    top: 70%;
    left: 50%;
    transform: translate(-50%, 0);

    background-color: ${colorSchema.light};
    color: ${colorSchema.secondary};
    padding: 1rem 4rem;
    border: none;
    font-size: 1.5rem;

    // 1201px 以上の場合
    @media screen and (min-width: 1201px) {
      left: 59%;
    }

    // 1px〜479px
    ${min[0] + max[0]} {
      padding: 0.5rem 2rem;
      font-size: 1rem;
    }

    &:hover {
      background-color: ${colorSchema.darkLight};
      color: ${colorSchema.lightDark};
      transition: all 0.3s ease;
    }
  }
`;

const NotFound = () => {
  return (
    <>
      {/* <Header /> */}

      <main css={notFoundCss}>
        <section>
          <div className="notFoundHeroWrap">
            <img
              src={notFoundHeroImage}
              alt="notFoundHeroImage"
              className="notFoundHeroWrap__img"
            />
            <div className="titleWrap">
              <h1 className="titleWrap__title">404 NOT FOUND</h1>
            </div>
          </div>
        </section>

        {/* Give a Prop as a string  */}
        <Link to="/" className="notFoundBackBtn">
          Go Back
        </Link>
      </main>

      {/* <Footer /> */}
    </>
  );
};

export default NotFound;
