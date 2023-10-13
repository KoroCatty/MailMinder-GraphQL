import { useParams, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

// bootstrap
import { Container } from "react-bootstrap";

// components
import BackButton from "../components/common/BackButton";

// Apollo Client
import { useQuery } from "@apollo/client";
import { useMutation } from "@apollo/client";

// queries & mutations
import { GET_POSTS_BY_ID } from "../graphql/queries";
import { DELETE_POST_BY_ID } from "../graphql/mutations";

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
import { css } from "@emotion/react";
import { min, max } from "../utils/mediaQueries";

const PostDetailPageStyle = css`
  max-width: 800px;
  margin: 0 auto;

  // CREATED DATE
  .created {
    display: flex;
    align-items: center;
    grid-gap: 0 0.7em;
    padding: 0.4rem 0.4rem;
    border-radius: 5px;
    background-color: #464646;
    color: #ffffff;
    width: 25%;

    // 1px〜479px
    ${min[0] + max[0]} {
      width: 50%;
      font-size: 0.8rem;
    }

    svg {
      width: 1rem;
      height: 1rem;

    // 1px〜479px
    ${min[0] + max[0]} {
      width: 0.8rem;
      height: 0.8rem;
    }
    }
  }

  time {
    margin: 0;
    padding: 0 0 0 0.7em;
    border-left: 1px solid #ffffff;
    
  }

  // TITLE
  h1 {
    font-size: 3rem;
    margin: 2rem 0;

    padding: 0.5em 0.7em;
    border-left: 5px solid #4f4f4f;
    border-bottom: 3px solid #d5d5d5;
    background-color: #f5f5f5;
    color: #4d4d4d;

    // 1px〜479px
    ${min[0] + max[0]} {
      font-size: 1.2rem;
      margin: 1rem 0;
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
  }

  img {
    width: 100%;
    height: auto;
  }

  // CONTENT BOX
  .contentBox {
    max-width: 800px;
    margin: 4rem auto;
    border: 2px solid #545454;
    border-radius: 5px;
    color: #333333;
    padding-bottom: 3rem;
    font-size: 1.7rem;
    letter-spacing: 1px;
    line-height: 1.4;
    height: auto;

    div {
      display: inline-flex;
      align-items: center;
      position: relative;
      top: -13px;
      left: 10px;
      margin: 0 7px;
      padding: 0 8px;
      background: #fff;
      color: #545454;
      font-weight: 600;
      vertical-align: top;
    }

    svg {
      padding-right: 4px;
      width: 1.5rem;
      height: 1.5rem;
    }

    p {
      margin: 0;
      padding: 0 0.4rem 0 2rem;
    }
  }

  // COMPONENT BACK BUTTON
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
      uid: id,
    },
  });

  // useNavigate
  const navigate = useNavigate();

  // DELETE POST MUTATION
  const [deletePostById, { error: deleteErr, loading: deleteLoading }] =
    useMutation(DELETE_POST_BY_ID, {
      variables: {
        id: id,
      },
      // refetchQueries: ['GET_POSTS_BY_ID'],
      // awaitRefetchQueries: true, // refetchQueriesを実行する前にmutationを完了させる

      update(cache, { data: { deletePost } }) {
        const data = cache.readQuery<PostsQueryCacheResult>({
          query: GET_POSTS_BY_ID,
        });
        if (!data) return;

        const { PostsByUser } = data;
        cache.writeQuery({
          query: GET_POSTS_BY_ID,
          data: {
            PostsByUser: PostsByUser.filter(
              (post) => post.id !== deletePost.id
            ),
          },
        });
      },
    });

  //* TYPES
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
        {/* <h1 className="text-center m-5">Posts Detail Page</h1> */}

        {/* component */}
        <BackButton />

        {/* URL の id と DB の id を比較し一致するものを取得 */}
        {data ? (
          data?.PostsByUser.filter(
            (item: postProp) => Number(item.id) === Number(id)
          ).map((filteredItem: postProp) => (
            <div key={filteredItem.id} className="detailItem">
              {/* <p>{cat.createdAt.substring(0, 10)}</p> */}

              {/*  CREATED DATE */}
              <div className="created">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    fill="#ffffff"
                    d="M13.6,4.4l6,6l-13,13L1.2,24c-0.7,0.1-1.3-0.5-1.2-1.2l0.6-5.4C0.6,17.4,13.6,4.4,13.6,4.4z M23.3,3.5l-2.8-2.8  c-0.9-0.9-2.3-0.9-3.2,0l-2.7,2.7l6,6l2.7-2.7C24.2,5.8,24.2,4.4,23.3,3.5z"
                  />
                </svg>
                <time>{new Date(filteredItem.createdAt).toLocaleString()}</time>
              </div>

              {/* TITLE */}
              <h1>{filteredItem.title}</h1>
              <img
                src={filteredItem.imgUrl}
                alt={`post image ${id}`}
                className="mx-auto d-block"
              />

              {/* CONTENT BOX */}
              <div className="contentBox">
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      fill="#545454"
                      d="M13.6,4.4l6,6l-13,13L1.2,24c-0.7,0.1-1.3-0.5-1.2-1.2l0.6-5.4C0.6,17.4,13.6,4.4,13.6,4.4z M23.3,3.5l-2.8-2.8  c-0.9-0.9-2.3-0.9-3.2,0l-2.7,2.7l6,6l2.7-2.7C24.2,5.8,24.2,4.4,23.3,3.5z"
                    />
                  </svg>
                  Your Sentence
                </div>
                <p>{filteredItem.content}</p>
              </div>
            </div>
          ))
        ) : loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error.message}</p>
        ) : (
          <p>No posts found.</p>
        )}

        {/* EDIT BUTTON */}
        <Link to={`/editpost/${id}`}>
          <button className="btn btn-primary mb-4" style={{ width: "100%" }}>
            Edit
          </button>
        </Link>

        {/* DELETE BUTTON */}
        <button
          className="btn btn-danger btn-sm"
          onClick={(e) => {
            e.preventDefault();
            window.confirm("Are you sure you want to delete this post?") &&
              deletePostById();
            navigate("/postlist");
          }}
        >
          {deleteErr ? "Deleting..." : "Delete"}
          {deleteLoading ? "Deleting..." : "Delete"}
        </button>
      </Container>
    </main>
  );
};

export default PostsDetailPage;
