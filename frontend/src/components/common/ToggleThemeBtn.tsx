// TYPE
type PropsType = {
  darkTheme: boolean;
  setDarkTheme: (themeUpdater: (prevTheme: boolean) => boolean) => void;
};


// Emotion CSS (Responsive Design)
import { css } from "@emotion/react";
import { min, max } from "../../utils/mediaQueries";
const toggleCss = css`
  // 1px〜479px
  /* ${min[0] + max[0]} {
    background-color: #c32626;
  }
  // 480px〜767px
  ${min[1] + max[1]} {
    background-color: blue;
  }
  // 768px〜989px
  ${min[2] + max[2]} {
    background-color: green;
  }
  // 990px〜1200
  ${min[3] + max[3]} {
    background-color: yellow;
  } */

  @media screen and (min-width: 1201px) {
    transform: translateY(50%);
  }

  .toggleBtn {
    position: relative;
    display: flex;
    align-items: center;

    input[type="checkbox"] {
      visibility: hidden;
      position: absolute;

      &:checked + .slider::before {
        left: 54px;
        top: 4px;
        background-color: #323030;
      }

      &:checked + .slider::after {
        left: 70px;
        top: 8px;
        font-size: 1.4rem;
        content: "🌙";
      }

      // slider の 背景色をチェックを入れたら変更
      &:checked + .slider {
        background-color: #ffffff33;
      }
    }

    // slider の 背景色
    .slider {
      position: relative;
      cursor: pointer;
      width: 90px;
      height: 40px;
      border-radius: 50px;
      background-color: #1e101033;
      transition: background-color 0.4s;

      &::before,
      &::after {
        position: absolute;
        transition: left 0.4s;
      }

      &::before {
        left: 5px;
        top: 3px;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background-color: #a6a6a6;
        content: "";
      }

      &::after {
        left: 20px;
        top: 7px;
        transform: translateX(-50%);
        color: #fff;
        font-size: 1.3rem;
        content: "☀️";
      }
    }
  }
`;

function ToggleThemeBtn({ darkTheme, setDarkTheme }: PropsType) {

    // Save Theme Color Boolean to LocalStorage
    localStorage.setItem('Theme-color', JSON.stringify(darkTheme));
  
  return (
    <div css={toggleCss}>
      {/* //! Dark Theme Toggle BUTTON */}
      <div className="toggleBtn">
        <input
          type="checkbox"
          id="toggleCheck"
          checked={darkTheme}
          onChange={() => setDarkTheme((prevTheme: boolean) => !prevTheme)}
        />
        <label htmlFor="toggleCheck" className="slider"></label>
      </div>
    </div>
  );
}

export default ToggleThemeBtn;
