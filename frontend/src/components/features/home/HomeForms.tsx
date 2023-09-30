import { useState } from "react";

// components
import GoogleSearch from "./GoogleSearch";

// bootstrap
import { Form } from "react-bootstrap";

// Emotion
import { css } from "@emotion/react";

const homeFormsStyles = css`

  textarea {
    display: block;
    width: 100%;
    height: 200px;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    margin: 40px 0;
    resize: none; // resizeとは、textareaの右下にある、ドラッグでサイズ変更できる機能
    box-shadow: 0 0 5px #ccc;
  }

  .imgChooseBtn {
    width: 50%;
  }

  .imageWrap {
    width: 30%;

    img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 5px;
    box-shadow: 0 0 5px #ccc;
  }
  }
  .RegisterBtn {
    width: 400px;
    padding: 10px 20px;
    border-radius: 5px;
    border: 1px solid #ccc;
    background-color: #c84d4d;
    box-shadow: 0 0 5px #ccc;
    color: white;
    cursor: pointer;
    margin-top: 8px;
    display: block;
    margin: 60px auto;
  }
`;

//! ========================================
//! MAIN
//! ========================================
const HomeForms = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  //* 画像を選択した時に発火する関数
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // <input type="file">から選択されたファイルのリストを提供するFileListオブジェクトを返し、[0]は選択されたファイルのリストの最初のファイルを指し、あれば返す
    const file = e.target.files && e.target.files[0];
    if (file) {
      // URL.createObjectURL(file)は、選択されたファイルのURLを生成。このURLは、<img>タグなどのsrc属性でファイルを直接参照するために使用できます。
      setSelectedImage(URL.createObjectURL(file));
    }
  };
  // console.log(selectedImage)
  // blob:http://localhost:3000/1d5663c7-b254-4d62-abb6-48150c91a4f8
  return (
    <section css={homeFormsStyles}>
      <h2 className="text-center m-4">Register Your reminder</h2>
      <form>
        <input
          type="text"
          placeholder="Type Your Title"
        />
        <textarea placeholder="Type Your Sentences" />

        <div className="imageArea">
          <Form.Group controlId="formFileLg" className="mb-3">
            <Form.Label>Large file input example</Form.Label>
            <Form.Control
              className="imgChooseBtn"
              type="file"
              size="lg"
              accept="image/*" // 画像ファイルのみを選択できるようにする
              onChange={handleImageChange}
            />
          </Form.Group>

          {/* <input
            type="file"
            accept="image/*" // 画像ファイルのみを選択できるようにする
            onChange={handleImageChange}
          // className="imgChooseBtn"
            /> */}

          {/* 画像があれば表示 */}
          <div className="imageWrap">
            {!selectedImage && <img src="/imgs/noImg.jpeg" alt="no Image" />}
            {selectedImage && <img src={selectedImage} alt="chosen Image" />}
          </div>
        </div>
        {/* Button */}
        <button type="submit" className="RegisterBtn" >Register</button>
      </form>

      {/* //! component */}
      <GoogleSearch />

      <hr />
    </section>
  );
};

export default HomeForms;
