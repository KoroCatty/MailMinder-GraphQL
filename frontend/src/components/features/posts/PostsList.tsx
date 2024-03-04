import { useEffect, useState } from "react";
// components
import BackButton from "../../common/BackButton";
import PostItem from "./PostItem";
import PaginationBar from "../../common/PaginationBar";

// Apollo Client
import { useQuery } from '@apollo/client';
import { GET_POSTS_BY_ID } from '../../../graphql/queries';

import { Row } from 'react-bootstrap';

// TYPES
type PostPropType = {
  id: string | number;
  title: string;
  content: string;
  imgUrl: string;
  imgCloudinaryUrl: string;
  imgCloudinaryId: string;
  createdAt: string;
};

// Emotion CSS (Responsive Design)
import { css } from "@emotion/react";
import { min, max } from "../../../utils/mediaQueries";
const PostListCss = css`

.eachCard {
  border: 1px solid #ddd;
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

//! ============================================================
function PostsList() {

  const POSTS_PER_PAGE = 12;

  // pagination
  // 第二引数はoffsetで、何件目から取得するかを指定する
  const [currentPage, setCurrentPage] = useState(1);

  // GET All POSTS by User ID (pagination 実装)
  const { data, loading, error, refetch } = useQuery(GET_POSTS_BY_ID, {
    variables: {
      uid: Number(), // backend (resolver) で id を指定しているので、空にする
      first: POSTS_PER_PAGE, // Post表示数。この数値を backend に渡す
      skip: (currentPage - 1) * 12, // 何件目から取得するかを指定。 この数値を backend に渡す
    },
    fetchPolicy: "cache-first"
  });

  // Total number of pages (ex. 50 / 20 = 2.5 => 3 pages)
  // Total number of pages を計算する前にデータの存在をチェック
  const totalCount = data?.PostsByUser?.totalCount;
  const totalPages = totalCount ? Math.ceil(totalCount / POSTS_PER_PAGE) : 0;

  // refetch posts
  useEffect(() => {
    refetch({ uid: Number() })
  }, [refetch]);


  return (
    <div css={PostListCss}>
      <BackButton />

      <PaginationBar currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      {/* 1.loading  2.error 3.post existence  */}
      {loading ? <p>Loading...</p> :
        error ? <p>Error: {error.message}</p> :
          !data || !data.PostsByUser || data.PostsByUser.length === 0 ? <p>No posts found.</p> :
            (
              <Row xs={1} md={2} className="g-4">
                {data.PostsByUser.items.map((item: PostPropType) => (
                  <div className="eachCard col-6 col-md-3 sm-3" key={item.id}>

                    {/* Component (Give a Prop) */}
                    <PostItem postProp={item} />
                  </div>
                ))}
              </Row>
            )}
    </div>
  );
}

export default PostsList;