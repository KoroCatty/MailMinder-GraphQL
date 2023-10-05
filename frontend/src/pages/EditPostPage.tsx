import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

import BackButton from '../components/common/BackButton';

// Apollo client
import { useQuery } from '@apollo/client';
import { GET_POSTS_BY_ID } from '../graphql/queries';

// Emotion
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

// 画像のURLを配列に保存
// const data = [
//   {
//     id: 64,
//     src: '/imgs/Diamond.jpg',
//     title: "expensive computation",
//     content: "This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.",
//     createdAt: "2021-09-01T00:00:00.000Z",
//   },
//   {
//     id: 2,
//     src: '/imgs/smile_design.jpg',
//     title: "Card title",
//     content: "This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.",
//     timeCreated: "2021-09-01T00:00:00.000Z",
//   },
//   {
//     id: 3,
//     src: '/imgs/universal.jpg',
//     title: "Card title",
//     content: "This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.",
//     timeCreated: "2021-09-01T00:00:00.000Z",
//   },
//   {
//     id: 4,
//     src: '/imgs/noImg.jpeg',
//     title: "Card title",
//     content: "This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.",
//     timeCreated: "2021-09-01T00:00:00.000Z",
//   },
// ];





//! ======================================================
//! Main
//! ======================================================
const EditPostPage = () => {
  // useparam のIDを使い各項目を更新する
  const { id: idUrl } = useParams<{ id: string }>();
  console.log(idUrl)

  // GET POSTS BY ID (Apollo Client)
  const { data, loading, error } = useQuery(GET_POSTS_BY_ID, {
    variables: {
      uid: Number(idUrl), // queries.ts で uid を定義している
    }
  });




  // Initialize with an empty array or a suitable default value.
  const [currentData, setCurrentData] = useState<any[]>([]);

  useEffect(() => {
    if (data && data.PostsByUser) {
      setCurrentData([data.PostsByUser]);
    }
  }, [data]);
  // console.log(data)



  // //* titleを更新するための関数
  const handleTitleChange = (updatedId: number, newTitle: string) => {
    const updatedTitle = currentData.map(item =>
      // idが一致したらtitleを更新 (コピーすることで、更新が可能になる)
      item.id === updatedId ? { ...item, title: newTitle } : item
    );
    setCurrentData(updatedTitle);
  };

  // //*  contentを更新するための関数
  const handleContentChange = (updatedId: number, newContent: string) => {
    const updatedContent = currentData.map(item =>
      item.id === updatedId ? { ...item, content: newContent } : item
    );
    setCurrentData(updatedContent);
  }

  // //* 画像を更新するための関数
  const handleImageChange = (
    updatedId: number, e: React.ChangeEvent<HTMLInputElement>
  ) => {
    // 画像が選択された場合のみ実行
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const updatedImageURL = URL.createObjectURL(file);
    const updateImage = currentData.map(item =>
      item.id === updatedId ? { ...item, src: updatedImageURL } : item
    );
    setCurrentData(updateImage);
    console.log(updateImage);
  };



  //* ================================================
  //   // HOOKS
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const [formData, setFormData] = useState({});

  // // Paste Image URL
  const handleImageChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageUrl = e.target.value;
    setSelectedImage(imageUrl);
    setFormData({
      ...formData,
      imgUrl: imageUrl
    });
  }
  //* ================================================
  // const aaa = data?.PostsByUser.map(item => item.title)
  // console.log(aaa)

  // console.log(currentData[0][0].title)

  // 特定のIDのデータを抽出
  // const filteredData = currentData?.filter(item => item.id === Number(idUrl))  
  // console.log(filteredData)

  // console.log(data?.PostsByUser)

  const idToFind = Number(idUrl); // 特定のID
  const filteredData = data?.PostsByUser.filter(item => Number(item.id) === idToFind);

  // const foundPost = filteredData[0]; // 配列の最初の要素を取得
  // console.log(foundPost)


  if (filteredData?.length > 0) {
    const foundPost = filteredData[0]; // 配列の最初の要素を取得
    console.log(foundPost);
  } else {
    console.log("IDに一致するデータは見つかりませんでした。");
  }
  //! ======================================================
  //! JSX
  //! ======================================================
  return (
    <main css={editPageStyle}>
      <h2 className="text-center m-4">Edit Your Post</h2>

      <BackButton />

      <div className="container">
        <div className="row">
          {data?.PostsByUser.length === 0 && (
            <p className="text-center">No posts to display</p>
          )}

          {filteredData?.length > 0 && (

            <form className='detailItem'>

              <h1>USER ID: {filteredData[0].id}</h1>


              {/* Title */}
              <input
                name="title"
                type="text"
                className="titleInput"
                value={filteredData[0].title}
                // value={currentData[0].title}
                onChange={(e) => handleTitleChange(filteredData[0].id, e.target.value)}
              />
              {/* Image */}
              <img src={filteredData[0].imgUrl}
                alt={filteredData[0].id}
                className='mx-auto d-block'
              />

              {/* Paste Image URL */}
              <label style={{ fontSize: "2rem", marginTop: "40px" }}>Paste Image URL</label>
                  <input
                    name="imgUrl"
                    type="text"
                    placeholder="Paste the image URL here"
                    style={{ width: "100%", height: "40px", marginBottom: "40px" }}
                    onChange={handleImageChange2}
                  />

              <input
                className="imgChooseBtn"
                type="file"
                accept="image/*" // 画像ファイルのみを選択できるようにする
                onChange={(e) => handleImageChange(filteredData[0].id, e)}
              />

              {/* content */}
              <textarea
                value={filteredData[0].content}
                onChange={(e) => handleContentChange(filteredData[0].id, e.target.value)}
              />


              {/* Button */}
              <button type="submit" className="RegisterBtn">UPDATE</button>
            </form>


          )}

        </div>
      </div>



    </main>
  );
}

export default EditPostPage;