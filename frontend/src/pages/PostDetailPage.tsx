import { useParams } from 'react-router-dom';

// bootstrap
import { Container } from 'react-bootstrap';

// components
import BackButton from '../components/common/BackButton';

// Apollo Client
import { useQuery } from '@apollo/client';
import { GET_POSTS_BY_ID } from '../graphql/queries';

// Emotion CSS
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


//! ============================================================
const PostsDetailPage = () => {
  // useParamsは文字列を返すので、Number()を使うことで数値に変換すること
  const { id } = useParams<{ id: string }>();
  // console.log(typeof id) // string

  // GET All POSTS by User ID
  const { data, loading, error } = useQuery(GET_POSTS_BY_ID, {
    variables: {
      uid: id
    },
  });

//* types 
type postProp = {
  id: string;
  title: string;
  content: string;
  imgUrl: string;
  createdAt: string;
  updatedAt: string;
};


  return (
    <main css={PostDetailPageStyle}>
      <Container>
        <h1 className="text-center m-5">Posts Detail Page</h1>

        {/* component */}
        <BackButton />

        {/* URL の id と DB の id を比較し一致するものを取得 */}
        {data ? (data?.PostsByUser.filter((item: postProp) => Number(item.id) === Number(id)).map((filteredItem: postProp) => (
          <div key={filteredItem.id} className='detailItem'>
            {/* <p>{cat.createdAt.substring(0, 10)}</p> */}

            <p>{new Date(filteredItem.createdAt).toLocaleString()}</p>
            <h2>{filteredItem.title}</h2>
            <img
              src={filteredItem.imgUrl}
              alt={`post image ${id}`}
              className='mx-auto d-block'
            />
            <p>{filteredItem.content}</p>
          </div>
        )))
          : (loading
            ? (<p>Loading...</p>)
            : (error)
              ? (<p>Error: {error.message}</p>)
              : (<p>No posts found.</p>))
        }




        {/* MAPPING */}
        {/* {images.map((item) => {
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
        }
        )} */}

      </Container>
    </main>
  )
}

export default PostsDetailPage