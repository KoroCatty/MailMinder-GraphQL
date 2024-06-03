// Emotion CSS
import { css } from "@emotion/react";
import { min, max } from "../utils/mediaQueries";
// Color Schema
import colorSchema from "../utils/colorSchema";
export const formStylesCSS = css`
  position: relative;
  max-width: 1080px;
  margin: 0 auto;

  // 1px〜479px
  ${min[0] + max[0]} {
    width: 90%;
  }
  // 480px〜767px
  ${min[1] + max[1]} {
  }
  // 768px〜989px
  ${min[2] + max[2]} {
  }
  // 990px〜
  ${min[3] + max[3]} {
  }

  textarea {
    display: block;
    width: 100%;
    height: 200px;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    margin: 80px 0;
    resize: none; // resizeとは、textareaの右下にある、ドラッグでサイズ変更できる機能
    box-shadow: 0 0 5px #ccc;

    // 1px〜479px
    ${min[0] + max[0]} {
    }
  }

  // UPLOAD IMAGE TITLE
  .uploadImgTitle {
    margin: 4rem 0 1rem 0;

    // 1px〜479px
    ${min[0] + max[0]} {
      margin: 0;
    }
    // 480px〜767px
    ${min[1] + max[1]} {
      margin: 0;
    }
  }

  // label caption
  h3 {
    font-size: 1.4rem;
    margin-bottom: 1rem;
    color: #616161;

    // 1px〜479px
    ${min[0] + max[0]} {
      margin: 2rem 0 1rem 0;
    }

    // 480px〜767px
    ${min[1] + max[1]} {
      margin: 2rem 0 1rem 0;
    }
  }

  // Select Image Form
  .imgChooseBtn {
    width: 100%;
    outline: 1px solid #ccc;
    color: #616161;
    margin-bottom: 5rem;

    &:focus {
      border: 1px solid #323232;
      box-shadow: 0 0 8px #ccc;
    }

    &:hover {
      transition: all 0.3s ease-in-out;
      transform: translate(0, 4px);
      box-shadow: 0 0 8px #ccc;
    }

    // 1px〜479px
    ${min[0] + max[0]} {
      margin-bottom: 3.5rem;
    }
    // 480px〜767px
    ${min[1] + max[1]} {
      margin-bottom: 3.5rem;
    }
  }

  .imageWrap {
    display: flex;
    gap: 5rem;
    padding-bottom: 3rem;

    // 1px〜479px
    ${min[0] + max[0]} {
      display: block;
      margin-top: 1rem;
      padding-bottom: 2rem;
    }

    // 480px〜767px
    ${min[1] + max[1]} {
      display: block;
      margin-top: 2rem;
      padding-bottom: 2rem;
    }

    // 768px
    ${min[2] + max[2]} {
      gap: 2rem;
    }

    //
    ${min[3] + max[3]} {
      gap: 2rem;
    }

    img {
      width: 40%;
      height: auto;
      border-radius: 5px;
      box-shadow: 0 0 5px #ccc;
      display: block;

      // 1px〜479px
      ${min[0] + max[0]} {
        width: 70%;
        margin: 0 auto;
      }

      // 480px〜767px
      ${min[1] + max[1]} {
        width: 80%;
        margin: 0 auto;
      }
    }

    .forms {
      width: 41%;

      // 1px〜479px
      ${min[0] + max[0]} {
        width: 90%;
        margin: 0 auto;
      }

      // 480px〜767px
      ${min[1] + max[1]} {
        width: 90%;
        margin: 0 auto;
      }
    }
  }

  //! Create Button (Props に渡すCSS)
  .submitBtn {
    width: 80%;
    font-size: 2rem;
    margin: 3rem auto;
    display: block;
    letter-spacing: 0.1rem;
    position: relative;
    overflow: hidden;

    // 480px〜767px
    ${min[0] + max[0]} {
      margin: 0 auto 2rem auto;
    }

    &:hover {
      transition: all 0.3s ease-in-out;
      transform: translate(0, 4px);
      border: none;
    }
  }

  .googleImgSearchForms {
    height: 60px;
    margin-bottom: 6rem;
  }

  // 送信中のボタンのスタイル (loadingState が true の時)
  .submitBtn.loading {
    opacity: 0.3;
    cursor: not-allowed;
  }

  //! Paste Image URL Form
  .pasteImgUrl {
    padding: 1rem 1rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    outline: none;
    font-size: 1rem;
    letter-spacing: 0.1rem;
    width: 100%;

    &:focus {
      border: 1px solid #323232;
      box-shadow: 0 0 8px #ccc;
    }

    // 1px〜479px
    ${min[0] + max[0]} {
      width: 100%;
    }
  }

  //! =================================================
  //! EDIT POST PAGE
  //! =================================================
  .timeContainer {
    display: flex;
    align-items: center;
    gap: 2rem;

    // 1px〜479px
    ${min[0] + max[0]} {
      gap: 0.4rem;
    }
    // 480px〜767px
    ${min[1] + max[1]} {
      gap: 0.8rem;
    }
  }

  .created,
  .updated {
    display: flex;
    align-items: center;
    grid-gap: 0 0.7em;
    padding: 0.4rem 0.7rem;
    border-radius: 5px;
    background-color: ${colorSchema.primary};
    color: #ffffff;
    font-size: 0.9rem;
    letter-spacing: 0.1rem;

    // 1px〜479px
    ${min[0] + max[0]} {
      font-size: 0.8rem;
      padding: 0.4rem 0.4rem;
    }
    // 480px〜767px
    ${min[1] + max[1]} {
      font-size: 1rem;
    }

    svg {
      width: 1rem;
      height: 1rem;

      // 1px〜479px
      ${min[0] + max[0]} {
        width: 0.6rem;
        height: 0.6rem;
      }
    }
  }

  .updated {
    background-color: ${colorSchema.success};
  }
`;
