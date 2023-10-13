import { useState } from "react";

// Color Schema
import colorSchema from "../../../utils/colorSchema";

// Emotion
import { css } from "@emotion/react";
import { min, max } from "../../../utils/mediaQueries";
const googleSearchStyles = css`
  margin: 4rem 0;

  form {
    display: flex;
    align-items: flex-end;
    gap: 0 10px;
  }

  input {
    display: block;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 20px;
    margin-right: 40px;
    resize: none; // resizeとは、textareaの右下にある、ドラッグでサイズ変更できる機能
    box-shadow: 0 0 5px #ccc;

    width: 100%;
    height: 48px;
    padding: 1px 5px 1px 8px;
    border: 1px solid #999999;
    box-sizing: border-box;
    color: #000;
    outline: none;
    font-size: 1.2rem;
    letter-spacing: 0.1rem;

    &:focus {
      outline: none;
      border: 1px solid #2e2e2e;
      box-shadow: 0 0 8px #ccc;

      &::placeholder {
        transform: scale(1.2) translateX(20px);

        // 1px〜479px
        ${min[0] + max[0]} {
          transform: scale(1.1) translateX(10px);
        }
      }
    }
  }

  button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30%;
    max-width: 140px;
    height: 48px;
    border: none;
    background-color: ${colorSchema.success};
    color: #fff;
    cursor: pointer;
    border-radius: 4px;

    &:before {
      width: 14px;
      height: 14px;
      margin-right: 5px;
      background-image: url("data:image/svg+xml;charset=utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%3E%20%3Cpath%20d%3D%22M23.7%2020.8%2019%2016.1c-.2-.2-.5-.3-.8-.3h-.8c1.3-1.7%202-3.7%202-6C19.5%204.4%2015.1%200%209.7%200S0%204.4%200%209.7s4.4%209.7%209.7%209.7c2.3%200%204.3-.8%206-2v.8c0%20.3.1.6.3.8l4.7%204.7c.4.4%201.2.4%201.6%200l1.3-1.3c.5-.5.5-1.2.1-1.6zm-14-5.1c-3.3%200-6-2.7-6-6s2.7-6%206-6%206%202.7%206%206-2.6%206-6%206z%22%20fill%3D%22%23fff%22%3E%3C%2Fpath%3E%20%3C%2Fsvg%3E");
      background-repeat: no-repeat;
      content: "";

      // 1px〜479px
      ${min[0] + max[0]} {
        margin-right: 2px;
        width: 16px;
      }
    }

    // 1px〜479px
    ${min[0] + max[0]} {
      font-size: 1rem;
      width: 100%;
    }
  }

  small {
    display: block;
    margin-bottom: 10px;
    font-size: 1.4rem;
    font-weight: 400;
    color: #515151;

    // 1px〜479px
    ${min[0] + max[0]} {
      font-size: 1rem;
    }
  }
`;

const GoogleSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Creative Commons の画像を検索するための追加のパラメータ
    // tbs=sur:fmc は"free to use or share, even commercially"（商業的利用や共有も自由）という意味のフィルタ
    const creativeCommonsFilter =
      "&as_rights=(cc_publicdomain|cc_attribute|cc_sharealike).-(cc_noncommercial|cc_nonderived)";

    window.open(
      `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(
        searchTerm
      )}${creativeCommonsFilter}`,
      "_blank"
    );

    // NORMAL COMMERCIAL IMAGE SEARCH
    // window.open(`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(searchTerm)}`, '_blank');
  };

  return (
    <div css={googleSearchStyles}>
      <form onSubmit={handleSubmit}>
        <label>
          <small>Get Image URL</small>
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            placeholder="Enter search term"
          />
        </label>
        <button type="submit">Google Search</button>
      </form>
    </div>
  );
};

export default GoogleSearch;
