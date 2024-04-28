import { useState, useRef } from "react";
import axios from "axios";
// Apollo Client
import { useMutation } from "@apollo/client";
import { CREATE_POST } from "../../../graphql/mutations";

// components
import GoogleSearch from "./GoogleSearch";
import Selfie from "../../common/Selfie";
import { TitleLarge, TitleSmall } from "../../common/Titles";
import { CommonForm, CommonTextarea } from "../../common/Forms";
import { CommonBtn } from "../../common/CommonBtn";
import LoadingSpinner from "../../common/LoadingSpinner";
// bootstrap
import { Form } from "react-bootstrap";
// CSS
import { formStylesCSS } from "../../../styles/FormsCSS";

// TYPES
interface RefetchProps {
  refetch: () => void;
}

//? TYPES (For Form Data)
interface FormDataProps {
  title?: string;
  content?: string;
  imgUrl?: string;
  imgCloudinaryUrl?: string;
  [key: string]: string | undefined; // This makes it indexable for dynamic keys
}

const HomeForms = ({ refetch }: RefetchProps) => {
  // For Selfie & Paste Image URL
  const [, setSelectedImage] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormDataProps>({});
  // which image to preview
  const [displayImg, setDisplayImg] = useState<string>("/imgs/noImg.jpeg");
  // Get local selected image value
  const fileInputRef = useRef<HTMLInputElement>(null);
  // local selected image
  const [selectedLocalFile, setSelectedLocalFile] = useState<File | null>(null);

  // Reset the local selected image input value
  const resetLocalFileSelectValue = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  //* Mutations (CreatePost は mutation.ts で定義)
  const [CreatePost, { loading, error }] = useMutation(CREATE_POST);

  // btn loading state
  const [loadingState, setLoadingState] = useState<boolean>(loading);

  if (error) {
    alert(error.message);
    <h1>Uploading Error!!</h1>;
  }

  if (loading) return <LoadingSpinner loading={true} />;

  //! ======================================================
  //! When forms typed (input & textarea)
  //! ======================================================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value, // name attribute
    });
  };

  //! ======================================================
  //! FORM SUBMIT !!
  //! ======================================================
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingState(true); // 送信処理開始時に送信ボタンの loadingをtrueに設定

    // SERVER URL
    const SERVER_URL =
      import.meta.env.VITE_PUBLIC_SERVER_URL || "http://localhost:5001/uploads";

    // Define a variable for asyncronous data to save DB
    let imageUrlForDB: string | undefined = formData.imgUrl;
    // 初期化
    let cloudinaryUrl;
    let cloudinaryId;

    //! 1. Upload the image to the server using AXIOS
    if (selectedLocalFile) {
      const formData = new FormData();
      formData.append("img", selectedLocalFile);
      try {
        const response = await axios.post(SERVER_URL, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        // console.log(response.data.url); // /uploads/img-1697934272148.jpg

        // CLOUDINARY ID (Backend から返したもの)
        await console.log(response.data.cloudinary_id);

        //  CLOUDINARY URL  (Backend から返したもの)
        await console.log(response.data.cloudinaryUrl);

        // 初期化した変数に値を代入
        cloudinaryUrl = await response.data.cloudinaryUrl;
        cloudinaryId = await response.data.cloudinary_id;

        // 値がない場合はエラー
        if (!cloudinaryUrl) {
          await console.error("Error: Cloudinary URL is missing ありません.😿");
          return;
        }
        if (!cloudinaryId) {
          await console.error("Error: Cloudinary ID is missing ありません.😿");
          return;
        }
        // make tis absolute path and get rid of double 'uploads/'
        imageUrlForDB = `${SERVER_URL}${response.data.url.replace("uploads/", "")}`;
        // get rid of double '//' in a server (Local is fine)
        imageUrlForDB = imageUrlForDB.replace("uploads//", "uploads/");
        setFormData((prevFormData) => ({
          ...prevFormData,
          // これらを追加
          imgUrl: imageUrlForDB,
        }));
      } catch (error) {
        console.error("Error uploading the file:", error);
        setLoadingState(false);
        return;
      }
    }

    //! 1. Save post to the database using Apollo Client's mutation.
    try {
      await CreatePost({
        variables: {
          postNew: {
            title: formData.title,
            content: formData.content,
            imgUrl: imageUrlForDB,
            imgCloudinaryUrl: cloudinaryUrl,
            imgCloudinaryId: cloudinaryId,
          },
        },
      });
      refetch(); // Props で受け取った refetch を実行
      await refetch();
      console.log("Refetched!");
      window.alert("Reminder added Successfully!");
    } catch (error) {
      console.error("Error saving post to database🫡:", error);
      return;
    }
    setLoadingState(false); // 処理が完了したらloadingをfalseに設定
  };

  //* ===================================================
  //* Choose image from local file (画像を選択した時に発火する関数)
  //* ===================================================
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    // Set the selected file to state for later use in handleSubmit
    setSelectedLocalFile(file);
    // Create a local URL for the file to display it in an img tag
    const localImageUrl = URL.createObjectURL(file);
    // console.log(localImageUrl) // blob:http://localhost:3000/9ad32e0f-6952-45c7-99c9-051430a562a9
    // Update the display image
    setDisplayImg(localImageUrl);
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

  //! ======================================================
  //! JSX
  //! ======================================================
  return (
    <section css={formStylesCSS}>
      {/* COMPONENT */}
      <TitleLarge title="YOUR REMINDER" />

      <form onSubmit={handleSubmit}>
        <TitleSmall title="TEXTS" />
        {/* TITLE COMPONENT */}
        <CommonForm
          onChange={(e) => handleChange(e)}
          text="TITLE"
          type="text"
          name="title"
          required
        />

        {/*//! CONTENT */}
        <CommonTextarea
          onChange={(e) => handleChange(e)}
          text="MESSAGE"
          name="content"
          required
        />

        {/* COMPONENT */}
        <TitleSmall title="UPLOAD IMAGE" className="uploadImgTitle" />

        {/* SELFIE COMPONENT (Pass the function )*/}
        <Selfie selfieImage={selfieImage} />

        {/*//* DISPLAY IMG  画像があれば表示 */}
        <div className="imageWrap">
          <img src={displayImg} alt="Displayed Image" />
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
            onChange={handleImageUpload}
            name="img"
          />
        </Form.Group>

        {/*//* Paste Image URL */}
        <h3>Paste Image URL</h3>
        <div className="googleImgSearchForms">
          <input
            name="imgUrl"
            type="text"
            placeholder="Paste the image URL here"
            className="pasteImgUrl"
            onChange={pasteImage}
          />
          <GoogleSearch />
        </div>

        {/* Button COMPONENT*/}
        <CommonBtn
          type="submit"
          className={`submitBtn` + (loadingState ? " loading" : "")}
          disabled={loadingState}
        >
          <span className="w-100">
            {" "}
            {loadingState ? "Uploading..." : "Create Post"}
          </span>
        </CommonBtn>
      </form>
    </section>
  );
};

export default HomeForms;
