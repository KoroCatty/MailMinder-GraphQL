import { Link } from 'react-router-dom';
import { useEffect } from 'react';

// Apollo Client
import { useQuery } from '@apollo/client';
import { GET_POSTS_BY_ID_LIMIT } from '../../../graphql/queries';

// components
import { TitleLarge } from '../../common/Titles';

// TYPES
type PostType = {
  id: number,
  title: string,
  content: string,
  imgUrl: string,
  createdAt: string,
  updatedAt: string,
  // user: {
  //   id: number,
  //   name: string,
  //   email: string,
  //   createdAt: string,
  //   updatedAt: string
  // }
}

// Emotion CSS (Responsive Design)
import { css } from "@emotion/react";
import { min, max } from '../../../utils/mediaQueries'
const recentPostsCss = css`
  padding: 3rem 0 10rem 0;

    // 1px〜479px
    ${min[0] + max[0]}{
    }
    // 480px〜767px
    ${min[1] + max[1]}{
    }
    // 768px〜989px
    ${min[2] + max[2]}{
    }
    // 990px〜
    ${min[3] + max[3]}{
    }
`;

//! =========================================================
const RecentPosts = () => {

  const { data, loading, error, refetch } = useQuery(GET_POSTS_BY_ID_LIMIT, {
    variables: {
      uid: Number(), // backend (resolver) で id を指定しているので、空にする
      limit: Number(4),
    },
  },
  );

// refetch posts 
useEffect(() => {
  refetch({ uid: Number() })
}
, [refetch])


  // destructuring
  const { PostsByUserLimit } = data ? data : [];

  if (loading) return <p>Loading...</p>;
  if (error) return <p>エラー: {error.message}</p>;
  if (data && !PostsByUserLimit) return <p>No posts found.</p>;


  return (
    <div css={recentPostsCss} className="container">
      {/* // TODO Fix this later */}
      {data && loading ? (<h1>Loading...</h1>) : ("")}
      {data && error ? (<h1>Error...</h1>) : ("")}

      {data ? (
        <>
          <TitleLarge title="RECENT POSTS" />

          <button onClick={() => refetch({ uid: Number() })}>
            Refetch up to date!
          </button>

          <div className="row">
            {PostsByUserLimit.map((item: PostType) => (
              <div className="col-md-3 col-6 col-sm-6 mb-4 " key={item.id}>

                <Link to={`/postdetails/${item.id}`} className="card" style={{ height: "252px" }}>
                  <img src={item.imgUrl} className="card-img-top" style={{ width: "100%", height: "160px", objectFit: "cover" }} alt={item.title} />

                  <div className="card-body">
                    <h5 className="card-title">{item.title}</h5>
                    <p className="card-text">{item.content}</p>
                    <p className="card-text"><small className="text-muted">{new Date(item.createdAt).toLocaleString()}</small></p>
                  </div>

                </Link>
              </div>
            ))}
          </div>
        </>
      ) : ("")}




    </div>
  )
}

export default RecentPosts