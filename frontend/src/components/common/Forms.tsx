// Emotion CSS (Responsive Design)
import { css } from "@emotion/react";
import { min, max } from "../../utils/mediaQueries";

const formsCss = css`
  .form-field {
    position: relative;
    margin: 32px 0;
  }

  // FORM（共通）
  .input-text {
    display: block;
    width: 100%;
    height: 36px;
    border-width: 0 0 2px 0; 
    border-color: #a3a3a3;
    font-family: Lusitana, serif;
    font-size: 18px;
    line-height: 26px;
    font-weight: 400;
    outline: 1px solid transparent;
    font-size: 2rem;
    letter-spacing: 0.1rem;
    color: #454545;
    word-wrap: break-word;
    line-height: 1.2;

    &:focus {
      outline: none;
    }

    &:focus, // 複数セレクタに適用
    &.aaa {
      + .label {
        // 現在の要素の直後の兄弟要素で、.labelクラスを持つ要素をターゲット
        transform: translateY(-40px);
      }
      + .label.textArea {
        transform: translateY(-80px);
      }
    }
  }

  // TEXTAREA
  .input-textArea {
    min-height: 240px;
    font-family: Lusitana, serif;
    font-size: 18px;
    line-height: 26px;
    font-weight: 400;
    font-size: 2rem;
    letter-spacing: 0.1rem;
    color: #454545;
    line-height: 1.2;

    // 1px〜479px
    ${min[0] + max[0]} {
      border-width: 1px 1px 2px 1px; // BORDER
    }
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

  .label.textArea {
    bottom: 190px;
    letter-spacing: 0.3rem;
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
  text?: string;
  type: string;
  name: string;
  value?: string;
  required?: boolean;
}

// TEXTAREA TYPE
interface CommonTextareaProps {
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  text?: string;
  name: string;
  value?: string;
  required?: boolean;
}

//! =======================================================
//! FORM
//! =======================================================
// Props を受け取る
export const CommonForm: React.FC<CommonFormProps> = ({
  onChange,
  text,
  type,
  name,
  value,
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
              value={value}
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
// Props を受け取る
export const CommonTextarea: React.FC<CommonTextareaProps> = ({
  onChange,
  text,
  name,
  value,
}) => {
  return (
    <div css={formsCss}>
      <section>
        <div>
          <div className="form-field ">
            <textarea
              onChange={onChange}
              name={name}
              className="input-text input-textArea"
              value={value}
              required
            />

            <label className="label textArea" htmlFor="message">
              {text}
            </label>
          </div>
        </div>
      </section>
    </div>
  );
};
