// Emotion
import { css } from "@emotion/react";
import { min, max } from "../../utils/mediaQueries";

const footerStyles = css`
  background-color: #151515;
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
`;

function Footer() {
  return (
    <footer css={footerStyles}>
      <div>&copy; 2023 K-Dev</div>
    </footer>
  );
}

export default Footer;
