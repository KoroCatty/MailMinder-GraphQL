import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

// COMPONENTS
import BackButton from '../components/common/BackButton';
import Selfie from '../components/common/Selfie';
import GoogleSearch from '../components/features/home/GoogleSearch';

// Apollo client
import { useQuery } from '@apollo/client';
import { useMutation } from '@apollo/client';

import { GET_POSTS_BY_ID } from '../graphql/queries';
import { UPDATE_POST_BY_ID } from '../graphql/mutations';

// bootstrap
import { Form } from "react-bootstrap";

// Emotion CSS
import { css } from '@emotion/react';
const editPageStyle = css`

  .titleInput {
    width: 80%;
    margin: 0 auto;
    display: block;
    }
  
  img {
    width: 40%;
    height: 50vh;
    object-fit: cover;

    @media screen and (max-width: 990px) {
      width: 70%;
    }
  }
  
  textarea {
    width: 100%;
    height: 200px;
  }
`;

//! ======================================================
//! Main
//! ======================================================
const EditPostPage = () => {
  // useParam 
  const { id: idUrl } = useParams<{ id: string }>();

  //* GET POSTS BY ID (Apollo Client)
  const { data, } = useQuery(GET_POSTS_BY_ID, {
    variables: {
      uid: Number(idUrl), // queries.ts で uid を定義している
    }
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
    // user: {
    //   id: 0,
    //   name: "",
    //   email: "",
    //   createdAt: "",
    //   updatedAt: "",
    // }
  });

  // TYPES (data.PostsByUser)
  type FormDataType = {
    id: number;
    title: string;
    content: string;
    imgUrl: string;
    createAt: string;
    updateAt: string;
  }

  //* useState
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({});

  //* useEffect
  useEffect(() => {
    if (data && data.PostsByUser) {
      const idToFind = Number(idUrl); // 特定のID
      const filteredData = data?.PostsByUser.filter((item: FormDataType) => Number(item.id) === idToFind);

      setCurrentData(filteredData[0]);
    }
  }, [data, idUrl]);// ここで指定した変数が変更されたら実行される

  // console.log(data)
  // console.log(currentData)

  //? ======================================================
  //? Title 
  //? ======================================================
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setCurrentData(prevData => ({ ...prevData, title: newTitle }));
  };
  //? ======================================================
  //? Content 
  //? ======================================================
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setCurrentData(prevData => ({ ...prevData, content: newContent }));
  };

  //* ===================================================
  //* Choose Image from local file 画像を選択した時に発火する関数 
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
  //? ================================================
  //? Submit (UPDATE BUTTON)
  //? ================================================
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // prevent default form submission
  
    try {
      const response = await updatePostById({
        variables: {
          updatePostId: currentData.id, // ここで指定したIDのデータを更新する
          postUpdate: {
            title: currentData.title,
            content: currentData.content,
            imgUrl: selectedImage || currentData.imgUrl, // Use selectedImage if it's available, else use currentData.imgUrl
            updatedAt: new Date().toISOString(),
          }
          
        }
      });
  
      if (response.data) {
        // Handle success. Maybe redirect user or show success message.
        console.log("Post updated successfully", response.data);
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
    <main css={editPageStyle}>
      <h2 className="text-center m-4">Edit Your Post</h2>
      <small>Created At: {currentData.createdAt.substring(0, 16).replace("T", " ")}</small>
      <h2>{currentData?.updatedAt.substring(0, 16).replace("T", " ")}</h2>

      {/* COMPONENT */}
      <BackButton />

      <div className="container">
        <div className="row">
          {data?.PostsByUser.length === 0 && (
            <p className="text-center">No posts to display</p>
          )}

          {currentData && (
            <form  onSubmit={handleSubmit} className='detailItem'>

              <h1>USER ID: {currentData.id}</h1>

              {/* Title */}
              <input
                name="title"
                type="text"
                className="titleInput"
                style={{ width: "60%", height: "40px" }}
                value={currentData.title}
                onChange={handleTitleChange}
              />

              {/* content */}
              <textarea
                value={currentData.content}
                onChange={handleContentChange}
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
                  onChange={pasteImage}
                />

                {/* DISPLAY IMG  画像があれば表示 */}
                <div className="imageWrap d-flex">
                  {!selectedImage && <img src={currentData.imgUrl} alt="no Image" />}
                  {selectedImage && <img src={selectedImage} alt="chosen Image" />}

                  {/* COMPONENT (Pass the function )*/}
                  <Selfie selfieImage={selfieImage} />
                </div>
              </div>

              {/* Button */}
              <button type="submit" className="RegisterBtn">UPDATE</button>
            </form>
          )}
          {/* //! COMPONENT */}
          <GoogleSearch />

        </div>
      </div>
    </main>
  );
}

export default EditPostPage;