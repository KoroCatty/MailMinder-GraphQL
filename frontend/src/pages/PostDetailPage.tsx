import { useParams } from 'react-router-dom';

// bootstrap
import { Container } from 'react-bootstrap';

// components
import BackButton from '../components/common/BackButton';



// Emotion
import { css } from '@emotion/react';
const PostDetailPageStyle = css`
  max-width: 800px;
  margin: 0 auto;
  text-align: center;

  img {
    width: 100%;
    height: auto;
  }

  p {
    max-width: 600px;
    text-align: center;
    margin: 0 auto;
  }
  .backButton {
    text-align: left;
  }
`;

// 画像のURLを配列に保存
const images = [
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

const PostsDetailPage = () => {
  // useParamsは文字列を返すので、Number()を使うことで数値に変換すること
  const { id } = useParams<{ id: string }>();
  // console.log(typeof id)

  return (
    <main css={PostDetailPageStyle}>
      <Container>
        <h1 className="text-center m-5">Posts Detail Page</h1>

        {/* component */}
        <BackButton />
        

        {/* MAPPING */}
        {images.map((item) => {
          if (item.id === Number(id)) {// Number()を使うことで文字列を数値に変換
            return (
              <div key={item.id} className='detailItem'>
                <p>{item.timeCreated.substring(0, 10)}</p>
                <h2>{item.title}</h2>
                <img
                  src={item.src}
                  alt={`post image ${id}`}
                  className='mx-auto d-block'
                />
                <p>{item.content}</p>
              </div>
            )
          }
        })}

      </Container>
    </main>
  )
}

export default PostsDetailPage