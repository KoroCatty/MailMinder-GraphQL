import { css } from "@emotion/react";
import { min, max } from "../../../utils/mediaQueries";

// ===========================================================
// SCSS Start
// ===========================================================
const ContactHero = () => {
  const contactHero = css`
    .contactHeroWrap {
      position: relative;

      .titleWrap {
        position: absolute;
        top: 50%;
        left: 30%;
        transform: translate(-50%, -50%);

        @media screen and (max-width: 1201px) {
          left: 20%;
        }

        // 1px〜479px
        ${min[0] + max[0]} {
          left: 24%;
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
            font-size: 1.7rem;
          }
        }
      }

      &__img {
        height: 30vh;
        width: 100%;
        object-fit: cover;
        filter: brightness(0.6);
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
          height: 20vh;
        }
      }
    }
  `;
  //! ===========================================================
  //! JSX
  //! ===========================================================
  return (
    <>
      <section css={contactHero}>
        <div className="contactHeroWrap">
          <img
            src="./imgs/heroContact.jpg"
            alt="contactHeroImage"
            className="contactHeroWrap__img"
          />

          <div className="titleWrap">
            <h1 className="titleWrap__title">Contact</h1>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactHero;
