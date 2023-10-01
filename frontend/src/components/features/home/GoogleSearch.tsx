import { useState } from 'react';

// Emotion
import { css } from '@emotion/react'
const googleSearchStyles = css`
  margin: 32px 0;

  input {
    width: 90%;
    display: block;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    margin-right: 40px;
    resize: none; // resizeとは、textareaの右下にある、ドラッグでサイズ変更できる機能
    box-shadow: 0 0 5px #ccc;
  }

  button {
    padding: 4px 8px;
    border-radius: 5px;
    border: 1px solid #ccc;
    background-color: #c84d4d;
    box-shadow: 0 0 5px #ccc;
    color: white;
    cursor: pointer;
    margin-top: 8px;

    &:hover {
      background-color: #f76a6a;
      transform: translate(0, 3px);
      transition: all 0.3s ease;
    }
  }
`;

const GoogleSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

  // Creative Commons の画像を検索するための追加のパラメータ
  // tbs=sur:fmc は"free to use or share, even commercially"（商業的利用や共有も自由）という意味のフィルタ
  const creativeCommonsFilter = '&as_rights=(cc_publicdomain|cc_attribute|cc_sharealike).-(cc_noncommercial|cc_nonderived)';

  window.open(`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(searchTerm)}${creativeCommonsFilter}`, '_blank');

  // NORMAL COMMERCIAL IMAGE SEARCH
    // window.open(`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(searchTerm)}`, '_blank');
  };

  return (
    <div css={googleSearchStyles}>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Enter search term"
        />
        <button type="submit">Google Search</button>
      </form>

    </div>
  )
}

export default GoogleSearch