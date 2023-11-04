import { Link } from "react-router-dom";
import { useEffect } from "react";

// components
import { TitleLarge } from "../../common/Titles";

// TYPES
type PostType = {
  id: number;
  title: string;
  content: string;
  imgUrl: string;
  createdAt: string;
  updatedAt: string;
  imgCloudinaryUrl: string;
};

// TYPES Props
interface LimitPostsPropsType {
  data: {
    PostsByUserLimit: PostType[];
  };
  loading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  refetch: () => void;
}

// Emotion CSS (Responsive Design)
import { css } from "@emotion/react";
import { min, max } from "../../../utils/mediaQueries";
const recentPostsCss = css`
  padding: 3rem 0 10rem 0;

    /* @media screen and (max-width: 999px) {
      width: 1000px !important;
      max-width: 1000px !important;
      margin: 0 auto;
    } */
  

  .eachCard {
    margin-bottom: 1.5rem;

    @media screen and (max-width: 999px) {
      padding-right: 0.4rem !important;
    }
  }

  .card {
    border: none;
    box-shadow: 1px 2px 2px rgba(0, 0, 0, 0.2);
    background-color: transparent;
    transition: all 0.3s ease-in-out;
    min-height: 100%;
    max-height: 100%;

    img {
      width: 100%;
      min-height: 160px;
      max-height: 160px;
      border-radius: 0.3rem 0.3rem 0 0;
    }

    &-body {
      padding: 0.8rem 0.6rem;

      position: relative; /* For time tag */
      padding-bottom: 2rem; 
    }

    &-title {
      font-size: 1.1rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      line-height: 1.3;
    }

    &-content {
      font-size: 1rem;
      line-height: 1.3;
    }

    time {
      position: absolute; 
      bottom: 0;
      left: 0.6rem; /* card-body の左の padding と一致 */
      right: 0.6rem; /* card-body の右の padding と一致 */
      font-size: 0.8rem;
      color: rgba(0, 0, 0, 0.5);
      padding: 0.3rem 0; 
    }
  }

  // 1px〜479px
  ${min[0] + max[0]} {
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
`;

//! =========================================================
// Receive Props
const RecentPosts = (limitPostsProps: LimitPostsPropsType) => {
  // Destructure Props
  const { data, loading, error, refetch } = limitPostsProps;

  // refetch posts
  useEffect(() => {
    refetch();
  }, [refetch]);

  // if data exists PostsByUserLimit assigned
  const postsByUserLimit: PostType[] = data?.PostsByUserLimit || [];
  // console.log(PostsByUserLimit);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>エラー: {error.message}</p>;
  if (data && !postsByUserLimit) return <p>No posts found.</p>;

  return (
    <div css={recentPostsCss}>
      {/* // TODO Fix this later */}
      {data && loading ? <h1>Loading...</h1> : ""}
      {data && error ? <h1>Error...</h1> : ""}

      {data ? (
        <>
          <TitleLarge title="RECENT POSTS" />

          <div className="row">
            {postsByUserLimit.map((item: PostType) => (
              <div className="eachCard col-6 col-md-3 sm-3" key={item.id}>

                <Link to={`/postdetails/${item.id}`} className="card">
                  {/* uploads から画像ファイルが削除されても、CLOUDINARY から取得 */}
                  {/* onError で画像の読み込みに失敗したときの処理 */}
                  <img
                    src={item.imgUrl}
                    onError={(e) => {
                      const imgElement = e.target as HTMLImageElement;
                      if (imgElement.src !== item.imgCloudinaryUrl) {
                        imgElement.src = item.imgCloudinaryUrl;
                      }
                    }}
                    alt={item.title}
                  />

                  <div className="card-body">
                    <h5 className="card-title">
                      {" "}
                      {item.title.length > 20
                        ? item.title.slice(0, 20) + "..."
                        : item.title}
                    </h5>
                    {/* 60文字まで、改行を削除 */}
                    <p className="card-content">
                      {item.content.replace(/\n/g, '').length > 100
                        ? item.content.replace(/\n/g, '').slice(0, 100) + "..."
                        : item.content.replace(/\n/g, '')}
                    </p>

                    <time>{new Date(item.createdAt).toLocaleString()}</time>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default RecentPosts;
