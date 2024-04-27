import { useRef, useState, useEffect } from "react";

// Emotion CSS (Responsive Design)
import { css } from "@emotion/react";
import { min, max } from "../../utils/mediaQueries";

const formsCss = css`
  .form-field {
    position: relative;
  }

  // FORM（共通）
  .input-text {
    display: block;
    width: 100%;
    min-height: 36px;
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
    overflow: scroll;

    // 1px〜479px
    ${min[0] + max[0]} {
      height: 60px;
      font-size: 1.4rem;
    }

    &:focus {
      outline: none;
    }

    &:focus {
      + .label {
        // 現在の要素の直後の兄弟要素で、.labelクラスを持つ要素をターゲット
        transform: translateY(-60px);

        // 1px〜479px
        ${min[0] + max[0]} {
          transform: translateY(-40px);
        }
      }
      + .label.textArea {
        transform: translateY(-80px);

        // 1px〜479px
        ${min[0] + max[0]} {
          transform: translateY(-60px);
        }
      }
    }
  }

  /* 新しく追加するスタイル */
  .input-text.has-text + .label {
    transform: translateY(-60px);
  }

  // TEXTAREA
  .input-textArea {
    min-height: 240px;
    font-family: Lusitana, serif;
    font-size: 16px;
    line-height: 26px;
    font-weight: 400;
    letter-spacing: 0.1rem;
    color: #454545;
    line-height: 1.2;
    overflow: hidden;

    // 1px〜479px
    ${min[0] + max[0]} {
      border-width: 1px 1px 2px 1px; // BORDER
      min-height: 160px;
      font-size: 1rem;
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

    // 1px〜479px
    ${min[0] + max[0]} {
      bottom: 120px;
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
  text?: string;
  type: string;
  name: string;
  value?: string;
  required?: boolean;
  classNameProp?: string;
}

// TEXTAREA TYPE
interface CommonTextareaProps {
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  text?: string;
  name: string;
  value?: string;
  required?: boolean;
  classNameProp?: string;
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
  classNameProp,
}) => {
  // テキストが存在するかどうかで state を変え、クラスを付与
  const [hasText, setHasText] = useState(false);
  // テキストの存在をチェック
  const inputRef = useRef<HTMLInputElement>(null);

  // ページ読み込み時の監視
  useEffect(() => {
    if (inputRef.current && inputRef.current.value !== "") {
      setHasText(true);
    }
  }, [value]); // Async で値が DB から入ってくるので、valueを監視

  // onChangeハンドラー
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e); // 既存のonChangeを呼び出す

    // テキストの存在をチェック
    if (e.target.value) {
      setHasText(true);
    } else {
      setHasText(false);
    }
  };

  return (
    <div css={formsCss}>
      <div className="contact-form">
        <div className="form-field">
          <input
            id="name"
            className={`input-text js-input ${classNameProp} ${hasText ? "has-text" : ""}`}
            type={type}
            required
            onChange={(e) => {
              onChange;
              handleChange(e);
            }}
            name={name}
            value={value}
            ref={inputRef}
          />

          <label
            className="label"
            htmlFor="name"
            style={{ letterSpacing: "0.4rem" }}
          >
            {text}
          </label>
        </div>
      </div>
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
  classNameProp,
}) => {
  // useRef
  const textAreaRef = useRef<HTMLTextAreaElement>(null); // テキストエリアの参照を作成

  // テキストが存在するかどうかで state を変え、クラスを付与
  const [hasText, setHasText] = useState(false);

  // ページ読み込み時の監視
  useEffect(() => {
    if (textAreaRef.current && textAreaRef.current.value !== "") {
      setHasText(true);
    }
  }, [value]); // Async で値が DB から入ってくるので、valueを監視

  // onChangeハンドラー
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e); // 既存のonChangeを呼び出す

    // テキストの存在をチェック
    if (e.target.value) {
      setHasText(true);
    } else {
      setHasText(false);
    }
  };

  //? 高さ自動調整 (テキストエリアの内容が変わるたびに呼び出される)
  const handleInput = () => {
    const textArea = textAreaRef.current;
    if (textArea) {
      textArea.style.height = "auto"; // 高さを初期化
      textArea.style.height = textArea.scrollHeight + "px"; // 新しい高さを設定
    }
  };

  return (
    <div css={formsCss}>
      <section>
        <div>
          <div className={`form-field ${classNameProp}`}>
            <textarea
              onChange={(e) => {
                onChange;
                handleChange(e);
              }}
              onInput={handleInput} // ここで高さを自動調整
              ref={textAreaRef} // ここで高さを自動調整
              name={name}
              className={`input-text input-textArea ${hasText ? "has-text" : ""}`}
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
