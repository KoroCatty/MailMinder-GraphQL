// Emotion
import { css } from "@emotion/react";
import { min, max } from "../../utils/mediaQueries";

const footerStyles = css`
  background-color: #3c3c3c;
  // gradient 
   background-image: linear-gradient(145deg, #000000 0%, #4f4f4f 50%, #1e1e1e 100%);

  color: #ffffff;
  padding: 60px 0;
  text-align: center;
  font-size: 1.4rem;
  border-top: 1px solid #ddd;
  margin-top: 40px;

  @media screen and (min-width: 1201px) {
    margin-left: 16%; // header の幅分だけ右にずらす
  }

  small {
    margin-top: 2rem;
    font-size: 0.9rem;
    display: block;
    letter-spacing: 1px;
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
`;

function Footer() {
  return (
    <footer css={footerStyles}>
      <div>&copy; {new Date().getFullYear()} KAZ-DEV</div>

      <small>ALL RIGHTS RESERVED</small>
    </footer>
  );
}

export default Footer;
