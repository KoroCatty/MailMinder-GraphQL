import { Link } from "react-router-dom";
import { useEffect } from "react";
// components
import { TitleLarge } from "../../common/Titles";
// Loading
import LoadingSpinner from "../../common/LoadingSpinner";

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
const recentPostsCss = css`
  padding: 3rem 0 3rem 0;

  .noCardMsg {
    text-align: center;
    margin-top: 2rem;
    font-size: 1.5rem;
    color: #333;
  }

  .eachCard {
    margin-bottom: 2.5rem;

    @media screen and (max-width: 999px) {
      padding-right: 0.4rem !important;
    }
  }

  .card {
    margin-top: 1rem;
    border: none;
    box-shadow: 1px 2px 2px rgba(0, 0, 0, 0.2);
    background-color: transparent;
    transition: all 0.3s ease-in-out;
    min-height: 100%;
    max-height: 100%;

    &:hover {
      transform: translateY(-0.3rem);
      box-shadow: 2px 3px 3px rgba(30, 30, 30, 0.5);
      transition: all 0.3s ease-in-out;
      filter: brightness(0.8);
    }

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
  .caption {
    font-size: 0.9rem;
    color: rgba(0, 0, 0, 0.5);
    margin-top: 1rem;
  }
`;

//! =========================================================
// Receive Props
const RecentPosts = (limitPostsProps: LimitPostsPropsType) => {
  // Destructure Props
  const { data, loading, error, refetch } = limitPostsProps;
  // console.log(data.PostsByUserLimit)

  // refetch posts
  useEffect(() => {
    refetch();
  }, [refetch]);

  // if data exists PostsByUserLimit assigned
  const postsByUserLimit: PostType[] = data?.PostsByUserLimit || [];

  if (error) return <p>Sever Error occurred</p>;

  return (
    <div css={recentPostsCss}>
      <TitleLarge title="RECENT CARDS" />
      {!loading && data.PostsByUserLimit.length === 0 && (
        <p className="noCardMsg">No cards found.</p>
      )}
      {loading && <LoadingSpinner loading={true} />}
      {data ? (
        <>
          <div className="row">
            {postsByUserLimit.map((item: PostType) => (
              <div className="eachCard col-6 col-md-3 sm-3" key={item.id}>
                <Link to={`/postdetails/${item.id}`} className="card">
                  {/* uploads から画像ファイルが削除されても、CLOUDINARY から取得 */}
                  {/* onError で画像の読み込みに失敗したときの処理 */}
                  <img
                    // imageUrl が image64 である data:image から始まる場合は、Cloudinary から取得
                    src={
                      // If Cloudinary URL exists, use it
                      item.imgCloudinaryUrl
                        ? item.imgCloudinaryUrl
                        : // Else, check if there's another URL provided and use it
                          item.imgUrl
                          ? item.imgUrl
                          : // If neither is available, use a local fallback image
                            "./images/no-image.png"
                    }
                    onError={(e) => {
                      const imgElement = e.target as HTMLImageElement;
                      if (imgElement.src !== item.imgUrl) {
                        imgElement.src = item.imgUrl;
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
                      {item.content.replace(/\n/g, "").length > 100
                        ? item.content.replace(/\n/g, "").slice(0, 100) + "..."
                        : item.content.replace(/\n/g, "")}
                    </p>

                    <time>{new Date(item.createdAt).toLocaleString()}</time>
                  </div>
                </Link>
              </div>
            ))}
            <div className="caption">
              * Reminder sent at 10AM every day (Random 5 posts)
            </div>
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default RecentPosts;
