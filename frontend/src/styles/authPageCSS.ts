// Emotion CSS (Responsive Design)
import { css } from "@emotion/react";
import { min, max } from "../utils/mediaQueries";
export const authPageCss = css`
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-bottom: 6rem;

  // 1 px 〜 479 px
  ${min[0] + max[0]} {
    padding-bottom: 2rem;
  }
  // 480 px 〜 767 px
  ${min[1] + max[1]} {
  }

  h1 {
    font-size: 2.5rem;
    margin-bottom: 40px;
    letter-spacing: 1px;
  }

  input {
    padding: 12px;
    margin: 10px;
    border-radius: 5px;
    border: 1px solid #ddd;
    outline: none;
    width: 50%;
    margin-bottom: 32px;
    font-size: 1.4rem;
    letter-spacing: 1px;

    // 1 px 〜 479 px
    ${min[0] + max[0]} {
      width: 80%;
      margin-bottom: 20px;
    }
    // 480 px 〜 767 px
    ${min[1] + max[1]} {
      width: 70%;
    }

    &:focus {
      border: 1px solid #323232;
    }
  }

  .authLink {
    color: #4d4d4d;
    cursor: pointer;
    text-decoration: underline;
    margin: 60px auto;
    font-size: 1.2rem;
    width: fit-content;

    &:hover {
      color: #5358d0;
      transform: scale(1.05);
      transition: all 0.3s ease-in-out;
    }
  }

  .demoLogin {
    cursor: pointer;
    text-decoration: underline;
    width: fit-content;
    margin: 0 auto;
    font-size: 1.4rem;
    color: #5358d0;
    margin-top: 1rem;

    &:hover {
      transform: scale(1.05);
      transition: all 0.3s ease-in-out;
    }
  }

  .linkBtn {
    margin: 4rem auto 4rem auto;
    font-size: 1.2rem;
    width: fit-content;

    a {
      color: #4d4d4d;
      text-decoration: underline;
    }

    &:hover {
      color: #5358d0;
      transform: scale(1.05);
      transition: all 0.3s ease-in-out;
    }
  }
`;
