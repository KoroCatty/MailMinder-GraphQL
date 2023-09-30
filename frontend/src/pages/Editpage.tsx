import { useParams } from 'react-router-dom';
import { useState } from 'react';

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
const data = [
  {
    id: 1,
    src: '/imgs/Diamond.jpg',
    title: "expensive computation",
    content: "This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.",
    timeCreated: "2021-09-01T00:00:00.000Z",
  },
  {
    id: 2,
    src: '/imgs/smile_design.jpg',
    title: "Card title",
    content: "This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.",
    timeCreated: "2021-09-01T00:00:00.000Z",
  },
  {
    id: 3,
    src: '/imgs/universal.jpg',
    title: "Card title",
    content: "This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.",
    timeCreated: "2021-09-01T00:00:00.000Z",
  },
  {
    id: 4,
    src: '/imgs/noImg.jpeg',
    title: "Card title",
    content: "This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.",
    timeCreated: "2021-09-01T00:00:00.000Z",
  },
];

//! ======================================================
//! Main
//! ======================================================
const Editpage = () => {
  // useparam のIDを使い各項目を更新する
  const { id } = useParams<{ id: string }>();
  const [currentData, setCurrentData] = useState(data);

  //* titleを更新するための関数
  const handleTitleChange = (updatedId: number, newTitle: string) => {
    const updatedTitle = currentData.map(item =>
      // idが一致したらtitleを更新 (コピーすることで、更新が可能になる)
      item.id === updatedId ? { ...item, title: newTitle } : item
    );
    setCurrentData(updatedTitle);
  };

  //*  contentを更新するための関数
  const handleContentChange = (updatedId: number, newContent: string) => {
    const updatedContent = currentData.map(item =>
      item.id === updatedId ? { ...item, content: newContent } : item
    );
    setCurrentData(updatedContent);
  }

  //* 画像を更新するための関数
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

  //! ======================================================
  //! JSX
  //! ======================================================
  return (
    <main css={editPageStyle}>
      <h2 className="text-center m-4">Edit Your reminder</h2>

      <div className="container">
        <div className="row">
          {/* MAPPING */}
          {currentData.map((item) => {
            if (item.id === Number(id)) {
              return (
                <div key={item.id} className='detailItem'>

                  {/* Title */}
                  <input
                    className='titleInput'
                    type="text"
                    value={item.title}
                    // 2つの引数を上の関数に渡す
                    onChange={(e) => handleTitleChange(item.id, e.target.value)}
                  />

                  {/* Image */}
                  <img
                    src={item.src}
                    alt={`post image ${id}`}
                    className='mx-auto d-block'
                  />

                  <input
                    className="imgChooseBtn"
                    type="file"
                    accept="image/*" // 画像ファイルのみを選択できるようにする
                    onChange={(e) => handleImageChange(item.id, e)}
                  />

                  {/* content */}
                  <textarea
                    value={item.content}
                    onChange={(e) => handleContentChange(item.id, e.target.value)}
                  />
                  <p>{item.content}</p>
                </div>
              );
            } else {
              return null;
            }
          })}
        </div>
      </div>
    </main>
  );
}

export default Editpage;