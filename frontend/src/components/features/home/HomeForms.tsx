import { useState } from "react";

// Apollo Client
import { useMutation } from "@apollo/client";
import { CREATE_POST } from "../../../graphql/mutations";

// components
import GoogleSearch from "./GoogleSearch";
import Selfie from "../../common/Selfie";
import { TitleLarge, TitleSmall } from "../../common/Titles";
import { CommonForm, CommonTextarea } from "../../common/Forms";
import { CommonBtn } from "../../common/CommonBtn";

// bootstrap
import { Form } from "react-bootstrap";

// $( '.js-input' ).keyup(function() {
//   if( $(this).val() ) {
//      $(this).addClass('not-empty');
//   } else {
//      $(this).removeClass('not-empty');
//   }
// });

// Emotion CSS (Responsive Design)
import { css } from "@emotion/react";
import { min, max } from "../../../utils/mediaQueries";

const homeFormsStyles = css`
  position: relative;
  margin-top: 18rem;

  &:before {
    position: absolute;
    left: 50%;
    top: -12%;
    content: "";
    display: block;
    width: 16%;
    transform: translateX(-50%) rotate(90deg);
    height: 1px;
    background-color: #ccc;
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

  h3 {
    font-size: 1.4rem;
    margin: 4rem 0 1rem 0;
  }
  
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

  // Select Image Form
  .imgChooseBtn {
    width: 60%;
    outline: 1px solid  #ccc;
    color: #4c4c4c;

    &:focus {
      border: 1px solid #323232;
      box-shadow: 0 0 8px #ccc;
    }

    &:hover {
      transition: all 0.3s ease-in-out;
      transform: translate(0, 4px);
      box-shadow: 0 0 8px #ccc;
    }
  }

  .imageWrap {
    margin: 3rem 0;

    img {
      width: 50%;
      height: auto;
      aspect-ratio: 1/1;
      border-radius: 5px;
      box-shadow: 0 0 5px #ccc;
      margin: 0 auto;
      display: block;
    }
  }

  // Props に渡すCSS
  .submitBtn {
    width: 80%;
    font-size: 2rem;
    margin: 3rem auto;
    display: block;
    letter-spacing: 0.1rem;

    &:hover {
      transition: all 0.3s ease-in-out;
      transform: translate(0, 4px);
    }
  }

  //! Paste Image URL Form
  .pasteImgUrl {
    padding: 1rem 1rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    outline: none;
    font-size: 1rem;
    letter-spacing: 0.1rem;
    width: 60%;

    &:focus {
      border: 1px solid #323232;
      box-shadow: 0 0 8px #ccc;
    }
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
  const [CreatePost, { loading, error }] = useMutation(CREATE_POST);

  if (loading) {
    <h1>Loading...</h1>;
  }
  if (error) {
    <h1>Error...</h1>;
  }

  //! ======================================================
  //! When forms typed
  //! ======================================================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value, // name attribute
    });
  };
  console.log(formData);

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
          postNew: formData, // postNew は mutation.ts で定義したもの
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

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
      imgUrl: imageUrl,
    });
  };

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
        imgUrl: image64,
      });
    } else {
      console.log("Too Big");
      window.alert("Too Big");
      // Proceed with saving to the database
      // ...your code to save the image to the database
    }
  };

  return (
    <section css={homeFormsStyles}>
      {/* COMPONENT */}
      <TitleLarge title="YOUR REMINDER" />

      <form onSubmit={handleSubmit}>
        <br />
        <br />
        <TitleSmall title="TEXTS" />
        <br />

        {/* TITLE COMPONENT */}
        <CommonForm
          onChange={(e) => handleChange(e)}
          text="TITLE"
          type="text"
          name="title"
          required
        />

        <br />
        <br />
        <br />

        {/*//! CONTENT */}
        <CommonTextarea
          onChange={(e) => handleChange(e)}
          text="MESSAGE"
          name="content"
        />

        {/* COMPONENT */}
        <TitleSmall title="UPLOAD IMAGE" />

        {/* SELFIE COMPONENT (Pass the function )*/}
        <Selfie selfieImage={selfieImage} />

        {/*//* DISPLAY IMG  画像があれば表示 */}
        <div className="imageWrap">
          {!selectedImage && <img src="/imgs/noImg.jpeg" alt="no Image" />}
          {selectedImage && <img src={selectedImage} alt="chosen Image" />}
        </div>


        {/*//* IMAGE SELECT */}
        <Form.Group controlId="formFileLg">
          <h3>
            From Your Local File
          </h3>
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


        {/*//* Paste Image URL */}
        <h3>
          Paste Image URL
        </h3>
        <input
          name="imgUrl"
          type="text"
          placeholder="Paste the image URL here"
          className="pasteImgUrl"
          onChange={pasteImage}
        />

        {/* Button COMPONENT*/}
        <CommonBtn type="submit" className="submitBtn">
          <span className="w-100">Create Post</span>
        </CommonBtn>

      </form>

      {/*//! COMPONENT */}
      <GoogleSearch />

      <hr />
    </section>
  );
};

export default HomeForms;
