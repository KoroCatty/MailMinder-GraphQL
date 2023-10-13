// Emotion
import { css } from "@emotion/react";
import { min, max } from "../../utils/mediaQueries";

import { Link } from "react-router-dom";

const footerStyles = css`
  background-color: #3c3c3c;
  // gradient
  background-image: linear-gradient(
    145deg,
    #000000 0%,
    #4f4f4f 50%,
    #1e1e1e 100%
  );

  color: #ffffff;
  padding: 60px 0;
  text-align: center;
  font-size: 1.4rem;
  border-top: 1px solid #ddd;
  margin-top: 40px;

  @media screen and (min-width: 1201px) {
    margin-left: 16%; // header の幅分だけ右にずらす
  }

  // 1px〜479px
  ${min[0] + max[0]} {
  }
  // 480px〜767px
  ${min[1] + max[1]} {
    margin-top: 100px; // tablet 対策
    padding: 80px 0;
  }
  // 768px〜989px
  ${min[2] + max[2]} {
    margin-top: 100px; // tablet 対策
    padding: 80px 0;
  }
  // 990px〜
  ${min[3] + max[3]} {
  }

  small {
    margin-top: 2rem;
    font-size: 0.9rem;
    display: block;
    letter-spacing: 1px;
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

function Footer() {
  return (
    <footer css={footerStyles}>
      <div>&copy; {new Date().getFullYear()} KAZ-DEV</div>

      <small>ALL RIGHTS RESERVED</small>

      <Link
        to="/privacy"
        onClick={() => {
          window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        }}
      >
        <span className="privacyLink">Privacy Policy</span>
      </Link>
    </footer>
  );
}

export default Footer;
