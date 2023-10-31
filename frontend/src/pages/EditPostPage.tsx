import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

import axios from "axios";

// COMPONENTS
import BackButton from "../components/common/BackButton";
import Selfie from "../components/common/Selfie";
import GoogleSearch from "../components/features/home/GoogleSearch";
import { TitleLarge, TitleSmall } from "../components/common/Titles";
import { CommonForm, CommonTextarea } from "../components/common/Forms";
import { CommonBtn } from "../components/common/CommonBtn";

// Color Schema
import colorSchema from "../utils/colorSchema";

// Apollo client
import { useQuery } from "@apollo/client";
import { useMutation } from "@apollo/client";

import { GET_POSTS_BY_ID } from "../graphql/queries";
import { UPDATE_POST_BY_ID } from "../graphql/mutations";

// bootstrap
import { Form } from "react-bootstrap";

// Emotion CSS
import { css } from "@emotion/react";
import { min, max } from "../utils/mediaQueries";



const EditPostCss = css`
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

  // CREATED & UPDATED DATE TAG
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

    .created,
    .updated {
      display: flex;
      align-items: center;
      grid-gap: 0 0.7em;
      padding: 0.6rem 0.6rem;
      border-radius: 5px;
      background-color: ${colorSchema.primary};
      color: #ffffff;
      font-size: 1.1rem;
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
  }

  // COMPONENT className Prop
  .formTitleProp {
    // 1px〜479px
    ${min[0] + max[0]} {
      margin-bottom: 8rem;
    }
  }

  textarea {
    border-radius: 5px;
    padding: 10px;
    resize: none; // resizeとは、textareaの右下にある、ドラッグでサイズ変更できる機能
    box-shadow: 0 0 5px ${colorSchema.border};
  }

  // UPLOAD IMAGE TITLE
  .uploadImgTitle {
    margin: 8rem 0 4rem 0;
  }

  // label caption
  h3 {
    font-size: 1.4rem;
    margin: 4rem 0 1rem 0;
    color: #616161;
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

          // 1px〜479px
    ${min[0] + max[0]} {
      width: 80%;
    }
    }
  }


  // Select Image Form
  .imgChooseBtn {
    width: 60%;
    outline: 1px solid #ccc;
    color: #616161;
    margin-bottom: 5rem;

    // 1px〜479px
    ${min[0] + max[0]} {
      width: 100%;
    }

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


  //! UPDATE Button (Props に渡すCSS)
  .submitBtn {
    width: 80%;
    font-size: 2rem;
    margin: 3rem auto;
    display: block;
    letter-spacing: 0.1rem;
    position: relative;
    overflow: hidden;

    // For Animation
    &:before {
      position: absolute;
      top: -50%;
      left: -30%;
      transform: rotate(30deg);
      width: 50px;
      height: 100px;
      content: "";
      background-image: linear-gradient(
        left,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 1) 50%,
        rgba(255, 255, 255, 0) 100%
      );
      background-image: -webkit-gradient(
        linear,
        left bottom,
        right bottom,
        color-stop(0%, rgba(255, 255, 255, 0)),
        color-stop(50%, rgba(255, 255, 255, 1)),
        color-stop(100%, rgba(255, 255, 255, 0))
      );
      animation: submitBtn 5s infinite linear;
    }

    &:hover {
      transition: all 0.3s ease-in-out;
      transform: translate(0, 4px);
    }

    @keyframes submitBtn {
      10% {
        left: 120%;
      }
      100% {
        left: 120%;
      }
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
    margin-bottom: 4rem;

    &:focus {
      border: 1px solid #323232;
      box-shadow: 0 0 8px #ccc;
    }

    // 1px〜479px
    ${min[0] + max[0]} {
      width: 100%;
    }
  }
`;

//! ======================================================
//! Main
//! ======================================================
const EditPostPage = () => {
  // useParam
  const { id: idUrl } = useParams<{ id: string }>();

    // Get local selected image value
    const fileInputRef = useRef<HTMLInputElement>(null);

  //* GET POSTS BY ID (Apollo Client)
  const { data, refetch } = useQuery(GET_POSTS_BY_ID, {
    variables: {
      uid: Number(idUrl), // queries.ts で uid を定義している
    },
  });

  //* UPDATE POST BY ID (Apollo Client)
  const [updatePostById] = useMutation(UPDATE_POST_BY_ID);

  // Initialize with an empty array or a suitable default value.
  const [currentData, setCurrentData] = useState({
    id: 0 as number,
    title: "",
    content: "",
    imgUrl: "",
    src: "",
    createdAt: "",
    updatedAt: "",
  });

  // TYPES (data.PostsByUser)
  type FormDataType = {
    id: number;
    title: string;
    content: string;
    imgUrl: string;
    createAt: string;
    updateAt: string;
  };

  //? TYPES (For Form Data)
interface FormDataProps {
  title?: string;
  content?: string;
  imgUrl?: string;
  // imgFile?: string;
  [key: string]: string | undefined; // This makes it indexable for dynamic keys
}

  //* useState
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormDataProps>({});

   // local selected image
   const [selectedLocalFile, setSelectedLocalFile] = useState<File | null>(null);

     // which image to preview
  const [displayImg, setDisplayImg] = useState<string>("/imgs/noImg.jpeg");

  // Reset the local selected image input value
  const resetLocalFileSelectValue = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };


  //* useEffect
  // DB からデータを取得
  useEffect(() => {
    if (data && data.PostsByUser) {
      const idToFind = Number(idUrl); // 特定のID
      const filteredData = data?.PostsByUser.filter(
        (item: FormDataType) => Number(item.id) === idToFind
      );

      setCurrentData(filteredData[0]);
    }
  }, [data, idUrl]); // ここで指定した変数が変更されたら実行される

  // console.log(data)
  // console.log(currentData)

  //? ======================================================
  //? Title
  //? ======================================================
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setCurrentData((prevData) => ({ ...prevData, title: newTitle }));
  };
  //? ======================================================
  //? Content
  //? ======================================================
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setCurrentData((prevData) => ({ ...prevData, content: newContent }));
  };

  //* ===================================================
  //* Choose Image from local file 画像を選択した時に発火する関数
  //* ===================================================
  // const chooseImage = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files && e.target.files[0];
  //   if (file) {
  //     setSelectedImage(URL.createObjectURL(file));

  //     // FormDataを更新
  //     setFormData({
  //       ...formData,
  //       imgUrl: file,
  //       // imgFile: file, 
  //     });
  //   }
  // };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    // Set the selected file to state for later use in handleSubmit
    setSelectedLocalFile(file);

    // Create a local URL for the file to display it in an img tag
    const localImageUrl = URL.createObjectURL(file);
    console.log(localImageUrl)// blob:http://localhost:3000/9ad32e0f-6952-45c7-99c9-051430a562a9

    // Update the display image
    setDisplayImg(localImageUrl);

    // e.target.value = '';
  }

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

     // reset local selected file in useState
     setSelectedLocalFile(null);

     // reset selected image input value
     resetLocalFileSelectValue();
 
     // display image
     setDisplayImg(imageUrl);
  };

  //* ===================================================
  //*  Selfie Image
  //* ===================================================
  const selfieImage = (image64: string | null) => {
    // Check if image64 is not null before reading its length
    if (image64 && image64.length > 10000) {
      setSelectedImage(image64);
      // Handle error - maybe return a user-friendly error message
      setFormData({
        ...formData,
        imgUrl: image64,
      });
      // reset selected image value
      resetLocalFileSelectValue();

      // reset local selected file in useState
      setSelectedLocalFile(null);

      setDisplayImg(image64);
    } else {
      console.log("Too Big");
      window.alert("Too Big");
    }
  };






  //! ================================================
  //! FORM SUBMIT !! (UPDATE BUTTON)
  //! ================================================
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // SERVER URL 
    const SERVER_URL = import.meta.env.VITE_PUBLIC_SERVER_URL || 'http://localhost:5001/uploads';
    //  console.log(SERVER_URL + "🫡") // http://localhost:5001/uploads

    // Define a variable for asyncronous data to save DB
    let imageUrlForDB: string | undefined = await formData.imgUrl;
    console.log(formData)
    console.log(imageUrlForDB)


    //! 1. Upload the image to the server using AXIOS
    if (selectedLocalFile) {
      const formData = new FormData();
      formData.append('img', selectedLocalFile);

      try {
        const response = await axios.post(SERVER_URL, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        // console.log(response.data.url); // /uploads/img-1697934272148.jpg

        // make tis absolute path and get rid of double 'uploads/'
        imageUrlForDB = `${SERVER_URL}${response.data.url.replace('uploads/', '')}`;
        // get rid of double '//' in a server (Local is fine)
        imageUrlForDB = imageUrlForDB.replace('uploads//', 'uploads/');
        setFormData((prevFormData) => ({
          ...prevFormData,
          imgUrl: imageUrlForDB
        }));

      } catch (error) {
        console.error("Error uploading the file:", error);
        return;

      } finally {
        // reset local selected file in useState
        // setSelectedLocalFile(null);
        // reset selected image input value
        // resetLocalFileSelectValue();
      }
    }


    //! 2. Update the post in the database
    try {
      const response = await updatePostById({
        variables: {
          updatePostId: currentData.id, // ここで指定したIDのデータを更新する
          postUpdate: {
            title: currentData.title,
            content: currentData.content,
            imgUrl: imageUrlForDB || currentData.imgUrl, // Use selectedImage if it's available, else use currentData.imgUrl
            updatedAt: new Date().toISOString(),
          },
        },
      });

      if (response.data) {
        // Handle success. Maybe redirect user or show success message.
        console.log("Post updated successfully", response.data);
        // Props で受け取った refetch を実行
        refetch();
        await refetch();
        console.log("Refetched!");
      }

    } catch (error) {
      // Handle error. Maybe show error message to user.
      console.error("Error updating post - アップデートエラー:", error);
    }
  };

  //! ======================================================
  //! JSX
  //! ======================================================
  return (
    <main css={EditPostCss}>
      {/* COMPONENT */}
      <BackButton />

      <div className="container">
        <div className="row">
          {data?.PostsByUser.length === 0 && (
            <p className="text-center">No posts to display</p>
          )}

          {currentData && (
            <form onSubmit={handleSubmit} className="detailItem">
              <h1>USER ID: {currentData.id}</h1>

              {/* COMPONENT */}
              <TitleLarge title="EDIT POST" />

              <div className="timeContainer">
                {/*  CREATED DATE */}
                <div className="created">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      fill="#ffffff"
                      d="M13.6,4.4l6,6l-13,13L1.2,24c-0.7,0.1-1.3-0.5-1.2-1.2l0.6-5.4C0.6,17.4,13.6,4.4,13.6,4.4z M23.3,3.5l-2.8-2.8  c-0.9-0.9-2.3-0.9-3.2,0l-2.7,2.7l6,6l2.7-2.7C24.2,5.8,24.2,4.4,23.3,3.5z"
                    />
                  </svg>
                  <time>
                    Created:{" "}
                    {currentData.createdAt
                      .substring(0, 10)
                      .replace("T", " ")
                      .replace(/-/g, "/")}
                  </time>
                </div>

                {/*  UPDATE DATE */}
                <div className="updated">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      fill="#ffffff"
                      d="M13.6,4.4l6,6l-13,13L1.2,24c-0.7,0.1-1.3-0.5-1.2-1.2l0.6-5.4C0.6,17.4,13.6,4.4,13.6,4.4z M23.3,3.5l-2.8-2.8  c-0.9-0.9-2.3-0.9-3.2,0l-2.7,2.7l6,6l2.7-2.7C24.2,5.8,24.2,4.4,23.3,3.5z"
                    />
                  </svg>
                  <time>
                    Updated:{" "}
                    {currentData.updatedAt
                      ? currentData.updatedAt
                        .substring(0, 10)
                        .replace("T", " ")
                        .replace(/-/g, "/")
                      : "Not Updated"}
                  </time>
                </div>
              </div>

              <br />
              <br />
              <TitleSmall title="TEXTS" />
              <br />

              {/* Title */}
              <CommonForm
                name="title"
                type="text"
                text="TITLE"
                value={currentData.title}
                onChange={handleTitleChange}
                classNameProp="formTitleProp"
              />

              {/* content */}
              <CommonTextarea
                value={currentData.content}
                onChange={handleContentChange}
                text="MESSAGE"
                name="content"
              />

              {/* COMPONENT */}
              <TitleSmall title="UPLOAD IMAGE" className="uploadImgTitle" />

              {/* SELFIE COMPONENT (Pass the function )*/}
              <Selfie selfieImage={selfieImage} />

              {/*//* DISPLAY IMG  画像があれば表示 */}
              <div className="imageWrap">
                {!selectedImage && (
                  <img src={currentData.imgUrl} alt="no Image" />
                )}
                {selectedImage && (
                  <img src={displayImg} alt="chosen Image" />
                )}
              </div>

              {/*//* IMAGE SELECT */}
              <Form.Group controlId="formFileLg">
                <h3>From Your Local File</h3>
                <Form.Control
                 ref={fileInputRef}
                  className="imgChooseBtn"
                  type="file"
                  size="lg"
                  accept="image/*" // 画像ファイルのみを選択できるようにする
                  // onChange={handleImageChange}
                  onChange={handleImageUpload}
                  name="img"
                />
              </Form.Group>

              {/*//* Paste Image URL */}
              <h3>Paste Image URL</h3>
              <input
                name="imgUrl"
                type="text"
                placeholder="Paste the image URL here"
                className="pasteImgUrl"
                onChange={pasteImage}
              />
              {/* //! COMPONENT */}
              <GoogleSearch />

              {/* Button COMPONENT*/}
              <CommonBtn type="submit" className="submitBtn">
                <span className="w-100">UPDATE</span>
              </CommonBtn>
            </form>
          )}

        </div>
      </div>
    </main>
  );
};

export default EditPostPage;
