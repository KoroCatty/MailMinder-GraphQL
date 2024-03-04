import { css } from "@emotion/react";
import { min, max } from "../../utils/mediaQueries";

import { Container, Row, Col } from "react-bootstrap";

// react-icons
import { AiFillGithub } from "react-icons/ai";

import { Link } from "react-router-dom";

// go to top
function goTop() {
  window.scroll({ top: 0, behavior: 'smooth' });
}

// TYPE
type IsLoggedInPropsType = {
  isLoggedIn: boolean;
}

const FooterCSS = css`
  .footer {
    font-family: freight-display-pro, STKaiti, essonnes-display, serif;
    color: #ffffff;
    padding: 4rem 0 3rem 1rem;
    // gradient
    background-image: linear-gradient(
      145deg,
      #000000 0%,
      #4f4f4f 50%,
      #1e1e1e 100%
    );

    @media screen and (min-width: 1201px) {
      margin-left: 16%; // header の幅分だけ右にずらす
    }

    // 1px〜479px
    ${min[0] + max[0]} {
      padding: 40px 0;
    }

    &__title {
      letter-spacing: -1px;
      margin-bottom: 40px;
      font-size: 2rem;
    }

    .row {
      // 1px〜479px
      ${min[0] + max[0]} {
        display: flex;
        flex-direction: column-reverse;
      }

      // 480px〜767px
      ${min[1] + max[1]} {
        display: flex;
        flex-direction: column-reverse;
      }
    }

    &__sns {
      img {
        width: 30px;
        height: 30px;
        margin-left: 1rem !important;

        // 1px〜479px
        ${min[0] + max[0]} {
          width: 24px;
          height: 24px;
        }

        // 480px〜767px
        ${min[1] + max[1]} {
          width: 24px;
          height: 24px;
        }
      }
    }

    &__logo {
      font-size: 2.6rem;
      margin-top: 100px;
      margin-bottom: 40px;
      text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);

      // 1px〜479px
      ${min[0] + max[0]} {
        font-size: 2rem;
        margin-top: 60px;
      }
    }

    &__links {
      // 1px〜479px
      ${min[0] + max[0]} {
        border-bottom: 1px solid rgb(85, 85, 85);
        margin-bottom: 40px;
      }

      // 480px〜767px
      ${min[1] + max[1]} {
        border-bottom: 1px solid rgb(85, 85, 85);
        margin-bottom: 40px;
      }

      a {
        display: block;
        width: fit-content;
        text-decoration: none;
        font-size: 1.3rem;
        color: white;
        margin-bottom: 30px;

        // 1px〜479px
        ${min[0] + max[0]} {
          font-size: 1rem;
        }
      }
    }

    &__copyRight {
      font-size: 0.8rem;
    }
  }

  .breakLineSP {
    display: none;

    // 1px〜479px
    ${min[0] + max[0]} {
      display: block;
    }
  }

  .privacyLink {
    cursor: pointer;
    color: #ffffff;
    text-decoration: underline;
    font-size: 1rem;
    letter-spacing: 2px;
    display: block;
    width: fit-content;
    margin: 3rem auto 0 auto;

    &:hover {
      opacity: 0.8;
      color: #d5d5ff;
      transition: all 0.3s ease;
    }
  }
`;

function Footer({ isLoggedIn }: IsLoggedInPropsType) {
  return (
    <footer css={FooterCSS}>
      <div className="footer">
        <Container>
          <Row>
            <Col>
              <h3 className="footer__title">GITHUB</h3>

              <div className="footer__sns">
                <a target="blank" href="https://github.com/TechnoEmpire">
                  <AiFillGithub style={{ color: "white", fontSize: "2rem" }} />
                </a>
              </div>

              <h3 className="footer__logo">KAZ-DEV</h3>
              <p className="footer__copyRight">
                &copy; {new Date().getFullYear()} - KAZE-DEV - All Rights
                Reseved. <br className="breakLineSP" />{" "}
              </p>
            </Col>
            <Col>

              {/* LOGIN CHECK */}
              {isLoggedIn ? (
                <div className="footer__links">
                  <Link to="/" onClick={goTop}>
                    HOME
                  </Link>
                  <Link to="/postlist" onClick={goTop}>
                    POSTS
                  </Link>
                  <Link to="/settings" onClick={goTop}>
                    SETTINGS
                  </Link>
                  <Link to="/contact" onClick={goTop}>
                    CONTACT
                  </Link>
                </div>
              ) : (
                <div className="footer__links">
                  <Link to="/" onClick={goTop}>
                    HOME
                  </Link>
                  <Link to="/contact" onClick={goTop}>
                    CONTACT
                  </Link>
                </div>
              )}
            </Col>
          </Row>
        </Container>

        <Link to="/privacy" onClick={goTop}>
          <span className="privacyLink">Privacy Policy</span>
        </Link>
      </div>
    </footer>
  );
}

export default Footer;
