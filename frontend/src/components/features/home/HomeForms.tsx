import { useState } from "react";

// Apollo Client 
import { useMutation } from '@apollo/client';
import { CREATE_POST } from '../../../graphql/mutations';

// components
import GoogleSearch from "./GoogleSearch";
import Selfie from "../../common/Selfie";

// bootstrap
import { Form } from "react-bootstrap";

// Emotion CSS
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
    width: 40%;

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
    font-size: 1.8rem;
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
  // HOOKS
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [formData, setFormData] = useState({});

  // Mutations (CreatePost は mutation.ts で定義)
  const [CreatePost, {  loading, error }] = useMutation(CREATE_POST);


  if (loading) { <h1>Loading...</h1> }
  if (error) { <h1>Error...</h1> }

  //! ======================================================
  //! When forms typed
  //! ======================================================
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value, // name attribute
    })
  };

  //! ======================================================
  //! When form submitted
  //! ======================================================
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);

    // DBに保存
    try {
      CreatePost({
        variables: {
          postNew: formData // postNew は mutation.ts で定義したもの
        }
      });
    } catch (error) {
      console.log(error)
    }
  }

  //* ===================================================
  //* Choose image from local file 画像を選択した時に発火する関数 
  //* ===================================================
  const chooseImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));

      // FormDataを更新
      setFormData({
        ...formData,
        imgFile: file, // これが重要です！
      });
    }
  };

  //* ===================================================
  //* Paste Image URL 
  //* ===================================================
  const pasteImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageUrl = e.target.value;
    setSelectedImage(imageUrl);
    setFormData({
      ...formData,
      imgUrl: imageUrl
    });
  }

  //* ===================================================
  //*  Selfie Image
  //* ===================================================
  const selfieImage = (image64: string | null) => {

    // Check if image64 (or selectedImage if you prefer) is not null before reading its length
    if (image64 && image64.length > 10000) {
      setSelectedImage(image64);
      // Handle error - maybe return a user-friendly error message
      setFormData({
        ...formData,
        imgUrl: image64
      });
    } else {
      console.log("Too Big")
      window.alert("Too Big")
      // Proceed with saving to the database
      // ...your code to save the image to the database
    }
  };


  return (
    <section css={homeFormsStyles}>
      <h2 className="text-center m-4">Register Your reminder</h2>

      <form onSubmit={handleSubmit} >
        {/* TITLE */}
        <input
          name="title"
          type="text"
          style={{ width: "100%", height: "40px" }}
          placeholder=" Title here"
          onChange={(e) => handleChange(e)}
        />

        <br />
        <br />
        <br />

        {/* CONTENT */}
        <textarea
          placeholder="Contents here"
          name="content"
          onChange={(e) => handleChange(e)}
        />

        {/* IMAGE */}
        <div className="imageArea">
          <Form.Group controlId="formFileLg" className="mb-3">
            <Form.Label style={{ fontSize: "2rem" }}>From Your Local File</Form.Label>
            <Form.Control
              className="imgChooseBtn"
              type="file"
              size="lg"
              accept="image/*" // 画像ファイルのみを選択できるようにする
              // onChange={handleImageChange}
              onChange={chooseImage}
              name="image"
            />
          </Form.Group>

          <br />
          <div style={{ fontSize: "2rem" }}>OR</div>
          <br />

          {/* Paste Image URL */}
          <label style={{ fontSize: "2rem", marginTop: "40px" }}>Paste Image URL</label>
          <input
            name="imgUrl"
            type="text"
            placeholder="Paste the image URL here"
            style={{ width: "100%", height: "40px", marginBottom: "40px" }}
            // onChange={handleImageChange2 }
            onChange={pasteImage}
          />

          {/* DISPLAY IMG  画像があれば表示 */}
          <div className="imageWrap d-flex">
            {!selectedImage && <img src="/imgs/noImg.jpeg" alt="no Image" />}
            {selectedImage && <img src={selectedImage} alt="chosen Image" />}

            {/* SELFIE COMPONENT (Pass the function )*/}
            {/* <Selfie handleImageChange3={handleImageChange3 }  /> */}
            <Selfie selfieImage={selfieImage} />
          </div>
        </div>


        {/* Button */}
        <button type="submit" className="RegisterBtn">Register</button>
      </form>

      {/* //! component */}
      <GoogleSearch />

      <hr />
    </section>
  );
};

export default HomeForms;
