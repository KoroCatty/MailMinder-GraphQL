// Emotion CSS (Responsive Design)
import { css } from "@emotion/react";
import { min, max } from "../../utils/mediaQueries";
const formsCss = css`
  .align-center {
    text-align: center;
  }

  // Grid
  .row {
    margin: -20px 0;

    .col {
      padding: 0 20px;
      float: left;
      box-sizing: border-box;

      /* &.x-50 {
        width: 50%;
      }

      &.x-100 {
        width: 100%;
      } */
    }
  }

  .content-wrapper {
    min-height: 100%;
    position: relative;
  }

  .get-in-touch {
    /* max-width: 650px; */
    margin: 0 auto;
    position: relative;
    top: 50%;
    /* transform: translateY(-50%); */

    .title {
      text-align: center;
      font-family: Raleway, sans-serif;
      text-transform: uppercase;
      letter-spacing: 3px;
      font-size: 36px;
      line-height: 48px;
      padding-bottom: 48px;
    }
  }

  .contact-form {
    .form-field {
      position: relative;
      margin: 32px 0;
    }

    .input-text {
      display: block;
      width: 100%;
      height: 36px;
      border-width: 0 0 2px 0;
      border-color: #000;
      font-family: Lusitana, serif;
      font-size: 18px;
      line-height: 26px;
      font-weight: 400;

      &:focus {
        outline: none;
      }

      &:focus,
      &.not-empty {
        + .label {
          transform: translateY(-24px);
        }
      }
    }

    // TEXTAREA
    .input-textArea {
      height: 200px;
      display: block;
      width: 100%;
      border-width: 0 0 2px 0;
      border-color: #000;
      font-family: Lusitana, serif;
      font-size: 18px;
      line-height: 26px;
      font-weight: 400;
    }
    
    .label {
      position: absolute;
      left: 12px;
      bottom: 11px;
      font-family: Lusitana, serif;
      font-size: 18px;
      line-height: 26px;
      font-weight: 400;
      color: #888;
      cursor: text;
      transition: transform 0.2s ease-in-out;
    }

    .submit-btn {
      display: inline-block;
      background-color: #000;
      color: #fff;
      font-family: Raleway, sans-serif;
      text-transform: uppercase;
      letter-spacing: 2px;
      font-size: 16px;
      line-height: 24px;
      padding: 8px 16px;
      border: none;
      cursor: pointer;
    }
  }

  .note {
    position: absolute;
    left: 0;
    bottom: 10px;
    width: 100%;
    text-align: center;
    font-family: Lusitana, serif;
    font-size: 16px;
    line-height: 21px;

    .link {
      color: #888;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }

  // 1px〜479px
  ${min[0] + max[0]} {
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
`;

// FORM TYPE
interface CommonFormProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  text: string;
  type: string;
  name: string;
}

// TEXTAREA TYPE
interface CommonTextareaProps {
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  text: string;
  name: string;
}

//! =======================================================
//! FORM
//! =======================================================
export const CommonForm: React.FC<CommonFormProps> = ({
  onChange,
  text,
  type,
  name,
}) => {
  return (
    <div css={formsCss}>
      <section className="">
        <div className="contact-form">
          <div className="form-field">
            <input
              id="name"
              className="input-text js-input"
              type={type}
              required
              onChange={onChange}
              name={name}
            />

            <label
              className="label"
              htmlFor="name"
              style={{ letterSpacing: "0.4rem" }}
            >
              {text}
            </label>
          </div>

          {/* <div className="form-field col x-50">
            <input id="email" className="input-text js-input" type="email" required />
            <label className="label" htmlFor="email">E-mail</label>
          </div> */}

          {/* <div className="form-field col x-100">
            <input id="message" className="input-text js-input" type="text" required />
            <label className="label" htmlFor="message">Message</label>
          </div> */}

          {/* BUTTON */}
          {/* <div className="form-field col x-100 align-center">
            <input className="submit-btn" type="submit" value="Submit" />
          </div> */}
        </div>
      </section>
    </div>
  );
};



//! =======================================================
//! TEXTAREA
//! =======================================================
export const CommonTextarea: React.FC<CommonTextareaProps> = ({
  onChange,
  text,
  name,
}) => {
  return (
    <div css={formsCss}>
      <section className="get-in-touch">
        <div className="contact-form">

          <div className="form-field ">
            <textarea 
            onChange={onChange} 
            name={name} 
            className="input-text input-textArea"
            required 
            />
            <label className="label" htmlFor="message" style={{letterSpacing: ".3rem"}}>{text}</label>
          </div>

        </div>
      </section>
    
    </div>
  );
};
