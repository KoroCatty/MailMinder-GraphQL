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

// Loading
import LoadingSpinner from "../components/common/LoadingSpinner";

// Apollo client
import { useQuery } from "@apollo/client";
import { useMutation } from "@apollo/client";

// mutations & queries
import { GET_POSTS_BY_ID } from "../graphql/queries";
import { UPDATE_POST_BY_ID } from "../graphql/mutations";
import { DELETE_POST_IMAGE_FILE } from "../graphql/mutations";
import { DELETE_CLOUDINARY_IMAGE_FILE } from "../graphql/mutations";

// bootstrap
import { Form } from "react-bootstrap";
// CSS
import { formStylesCSS } from "../styles/FormsCSS";

const EditPostPage = () => {
  const { id: idUrl } = useParams<{ id: string }>();

  // Get local selected image value
  const fileInputRef = useRef<HTMLInputElement>(null);

  //* GET POSTS BY ID
  const { data, refetch } = useQuery(GET_POSTS_BY_ID, {
    variables: {
      uid: Number(idUrl), // queries.ts で uid を定義している
    },
  });

  //* UPDATE POST BY ID
  const [updatePostById, { loading, error }] = useMutation(UPDATE_POST_BY_ID);
  if (error) {
    alert(error.message);
  }
  // Button loading state
  const [loadingState, setLoadingState] = useState<boolean>(loading);

  //! DELETE POST IMAGE FILE
  const [deletePostImage] = useMutation(DELETE_POST_IMAGE_FILE);

  //! DELETE CLOUDINARY IMAGE FILE
  const [deleteCloudinaryImageFile] = useMutation(DELETE_CLOUDINARY_IMAGE_FILE);

  // CLOUDINARY 画像を削除するための関数
  const handleCloudinary_deleteImg = (publicId: string) => {
    deleteCloudinaryImageFile({ variables: { publicId } });
  };

  // Initialize with an empty array or a suitable default value.
  const [currentData, setCurrentData] = useState({
    id: 0 as number,
    title: "",
    content: "",
    imgUrl: "",
    imgCloudinaryUrl: "",
    imgCloudinaryId: "",
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
    imgCloudinaryUrl: string;
    imgCloudinaryId: string;
    createAt: string;
    updateAt: string;
  };

  //? TYPES (For Form Data)
  interface FormDataProps {
    title?: string;
    content?: string;
    imgUrl?: string;
    imgCloudinaryUrl?: string;
    imgCloudinaryId?: string;
    [key: string]: string | undefined; // This makes it indexable for dynamic keys
  }

  //* useState
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormDataProps>({});
  // local selected image
  const [selectedLocalFile, setSelectedLocalFile] = useState<File | null>(null);
  // Reset the local selected image input value
  const resetLocalFileSelectValue = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Cloudinary URL & ID (response by selfieImage function)
  const [cloudinaryUrlSelfie, setCloudinaryUrlSelfie] = useState<string | null>(
    null,
  );
  const [cloudinaryIdSelfie, setCloudinaryIdSelfie] = useState<string | null>(
    null,
  );

  //* useEffect
  // DB から post id と同じ 投稿データを取得
  useEffect(() => {
    if (data && data.PostsByUser) {
      const idToFind = Number(idUrl); // 特定のID
      const filteredData = data?.PostsByUser.items.filter(
        (item: FormDataType) => Number(item.id) === idToFind,
      );

      setCurrentData(filteredData[0]);
    }
  }, [data, idUrl]); // ここで指定した変数が変更されたら実行される

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
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    // Set the selected file to state for later use in handleSubmit
    setSelectedLocalFile(file);
    // Create a local URL for the file to display it in an img tag
    const localImageUrl = URL.createObjectURL(file);
    console.log(localImageUrl); // blob:http://localhost:3000/9ad32e0f-6952-45c7-99c9-051430a562a9
    setSelectedImage(localImageUrl);
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
  };

  //! ================================================
  //! FORM SUBMIT !! (UPDATE BUTTON)
  //! ================================================
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingState(true); // 送信処理開始時に送信ボタンの loadingをtrueに設定

    // SERVER URL
    const SERVER_URL =
      import.meta.env.VITE_PUBLIC_SERVER_URL || "http://localhost:5001/uploads";
    //  console.log(SERVER_URL + "🫡") // http://localhost:5001/uploads

    // Define a variable for asyncronous data to save DB
    // 初期化
    let imageUrlForDB: string | undefined = formData.imgUrl;
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
        console.log("😂", response.data.url); // /uploads/img-1697934272148.jpg

        // CLOUDINARY Image URL (backendから返したもの)
        // console.log(response.data.cloudinaryUrl);
        // console.log(response.data.cloudinary_id);

        // 初期化してた変数に値を入れる
        cloudinaryUrl = response.data.cloudinaryUrl;
        cloudinaryId = response.data.cloudinary_id;

        // 値がない場合はエラー
        if (!cloudinaryUrl) {
          await console.error("Error: Cloudinary URL is missing ありません.😿");
          return;
        }
        if (!cloudinaryId) {
          await console.error("Error: Cloudinary ID is missing ありません.😿");
          return;
        }

        // make this absolute path and get rid of double 'uploads/'
        imageUrlForDB = `${SERVER_URL}${response.data.url.replace("uploads/", "")}`;

        // get rid of double '//' in a server (Local is fine)
        imageUrlForDB = imageUrlForDB.replace("uploads//", "uploads/");

        setFormData((prevFormData) => ({
          ...prevFormData, // shallow copy
          imgUrl: imageUrlForDB, // add or update the imgUrl property
        }));
      } catch (error) {
        console.error("Error uploading the file:", error);
        setLoadingState(false); // 処理が完了したらloadingをfalseに設定
        return;
      }
    }

    // Delete Image File
    deletePostImage({
      variables: {
        id: Number(idUrl),
        imgUrl: currentData.imgUrl,
        imgCloudinaryUrl: currentData.imgCloudinaryUrl,
        imgCloudinaryId: currentData.imgCloudinaryId,
      },
    });

    // If an image URL was pasted, Cloudinary URL and ID are pointless
    if (selectedImage && !selectedLocalFile) {
      cloudinaryUrl = "nothing"; // not allowed empty so set "nothing"
      cloudinaryId = "nothing";
    }

    //! 2. Update the post in the database
    try {
      const response = await updatePostById({
        variables: {
          updatePostId: currentData.id, // ここで指定したIDのデータを更新する
          postUpdate: {
            // typeDefs.jsで定義
            title: currentData.title,
            content: currentData.content,
            // 300文字までにし、MySQLのDB保存の容量を減らす (image64対策)
            imgUrl:
              imageUrlForDB?.slice(0, 300) || currentData.imgUrl.slice(0, 300),
            updatedAt: new Date().toISOString(),
            // Selfie を取った場合は状態にセットされているのでそれを使用（selfieImageで requestの結果をセットしここでサーバーに送りMySQL に画像のパスが保存）
            imgCloudinaryUrl: cloudinaryUrlSelfie
              ? cloudinaryUrlSelfie
              : cloudinaryUrl,
            imgCloudinaryId: cloudinaryIdSelfie
              ? cloudinaryIdSelfie
              : cloudinaryId,
          },
        },
      });

      // Success message
      if (response.data) {
        window.alert("Post updated successfully");
        console.log("Post updated successfully", response.data);
        await refetch(); // Props で受け取った refetch を実行
        console.log("Refetched!");
        setLoadingState(false); // 処理が完了したらloadingをfalseに設定
      }

      //! Delete Cloudinary Image File that much with Post ID
      // if File or Img Address is not empty, don't delete CLOUDINARY IMG
      if (
        fileInputRef.current &&
        !fileInputRef.current.value &&
        !selectedImage
      ) {
        console.log("Not Image File is chosen");
        return;
      }
      const cloudinaryId_muchWithPostId = data.PostsByUser.items.find(
        (item: FormDataType) => Number(item.id) === Number(idUrl),
      );
      if (cloudinaryId_muchWithPostId) {
        handleCloudinary_deleteImg(cloudinaryId_muchWithPostId.imgCloudinaryId);
      }
    } catch (error) {
      console.error("Error updating post - アップデートエラー:", error);
      setLoadingState(false); // 処理が完了したらloadingをfalseに設定
    }
    setLoadingState(false); // 処理が完了したらloadingをfalseに設定
  };

  //* ===================================================
  //*  Selfie Image
  //* ===================================================
  const selfieImage = async (image64: string | null) => {
    if (image64 && image64.length > 10000) {
      setFormData((prev) => ({ ...prev, imgUrl: image64 }));
      resetLocalFileSelectValue();
      setSelectedImage(image64);
      // blob に変換し、フォームデータに追加
      const blob = await fetch(image64).then((res) => res.blob());
      const formData = new FormData();
      formData.append("img", blob, "image.png"); // img はバックエンドと一致させる

      const SERVER_URL =
        import.meta.env.VITE_PUBLIC_SERVER_URL ||
        "http://localhost:5001/uploads";

      try {
        //! Save to Cloudinary REST API
        const response = await axios.post(SERVER_URL, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (response.data.cloudinaryUrl) {
          setCloudinaryUrlSelfie(response.data.cloudinaryUrl);
          setCloudinaryIdSelfie(response.data.cloudinary_id);
        }
        console.log(
          "Image uploaded successfully:",
          response.data.cloudinaryUrl,
        );
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    } else {
      console.log("Image too large");
      alert("Image too large");
    }
  };

  //! ======================================================
  //! JSX
  //! ======================================================
  return (
    // <main css={EditPostCss}>
    <main css={formStylesCSS}>
      <div className="container">
        <BackButton />
        <div className="row">
          {/* If no exist the post, error message */}
          {!currentData ||
          Object.keys(currentData).length === 0 ||
          !currentData.id ? (
            <LoadingSpinner loading={true} />
          ) : (
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

              {/*//* DISPLAY IMG  画像があれば表示 (Local or Cloudinary) */}
              <div className="imageWrap">
                {!selectedImage && (
                  <img
                    src={
                      // If Cloudinary URL exists, use it
                      currentData.imgCloudinaryUrl
                        ? currentData.imgCloudinaryUrl
                        : // Else, check if there's another URL provided and use it
                          currentData.imgUrl
                          ? currentData.imgUrl
                          : // If neither is available, use a local fallback image
                            "./images/no-image.png"
                    }
                    onError={(e) => {
                      const imgElement = e.target as HTMLImageElement;
                      if (imgElement.src !== currentData.imgUrl) {
                        imgElement.src = currentData.imgUrl;
                      }
                    }}
                    alt="no Image"
                  />
                )}
                {selectedImage && (
                  <img src={selectedImage} alt="chosen Image" />
                )}

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
                </Form.Group>
              </div>

              {/* Button COMPONENT*/}
              <CommonBtn
                type="submit"
                className={`submitBtn` + (loadingState ? " loading" : "")}
                disabled={loadingState}
              >
                <span className="w-100">
                  {" "}
                  {loadingState ? "Updating..." : "Update Post"}
                </span>
              </CommonBtn>
            </form>
          )}
        </div>
      </div>
    </main>
  );
};

export default EditPostPage;
