import { useParams, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

// bootstrap
import { Container } from 'react-bootstrap';

// components
import BackButton from '../components/common/BackButton';

// Apollo Client
import { useQuery } from '@apollo/client';
import { useMutation } from '@apollo/client';

// queries & mutations
import { GET_POSTS_BY_ID } from '../graphql/queries';
import { DELETE_POST_BY_ID } from '../graphql/mutations';


//* types 
type postProp = {
  id: string;
  title: string;
  content: string;
  imgUrl: string;
  createdAt: string;
  updatedAt: string;
};
type PostsQueryCacheResult = {
  PostsByUser: postProp[];
};


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
  // useParams
  // useParamsは文字列を返すので、Number()を使うことで数値に変換すること
  const { id } = useParams<{ id: string }>();
  // console.log(typeof id) // string

  // GET All POSTS by User ID
  const { data, loading, error } = useQuery(GET_POSTS_BY_ID, {
    variables: {
      uid: id
    },
  });

  // useNavigate
  const navigate = useNavigate();

  // DELETE POST MUTATION
  const [deletePostById, { error: deleteErr, loading: deleteLoading }] = useMutation(DELETE_POST_BY_ID, {
    variables: {
      id: id
    },
    // refetchQueries: ['GET_POSTS_BY_ID'],
    // awaitRefetchQueries: true, // refetchQueriesを実行する前にmutationを完了させる

    update(cache, { data: { deletePost } }) {
      const data = cache.readQuery<PostsQueryCacheResult>({ query: GET_POSTS_BY_ID });
      if (!data) return;

      const { PostsByUser } = data;
      cache.writeQuery({
        query: GET_POSTS_BY_ID,
        data: { PostsByUser: PostsByUser.filter(post => post.id !== deletePost.id) },
      });
    }

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

  //! ============================================================
  //! JSX
  //! ============================================================
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

        {/* EDIT BUTTON */}
        <Link to={`/editpost/${id}`}>
          <button className="btn btn-primary mb-4" style={{ width: "100%" }} >Edit</button>
        </Link>



        {/* DELETE BUTTON */}
        <button
          className="btn btn-danger btn-sm"
          onClick={(e) => {
            e.preventDefault();
            window.confirm('Are you sure you want to delete this post?') &&
              deletePostById();
            navigate("/postlist")
          }}
        >
          {deleteErr ? 'Deleting...' : 'Delete'}
          {deleteLoading ? 'Deleting...' : 'Delete'} 
        </button>

      </Container>
    </main>
  )
}

export default PostsDetailPage