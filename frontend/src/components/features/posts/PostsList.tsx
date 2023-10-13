// components
import BackButton from "../../common/BackButton";
import PostItem from "./PostItem";

// Apollo Client
import { useQuery } from '@apollo/client';
import { GET_POSTS_BY_ID } from '../../../graphql/queries';

import { Row, Col } from 'react-bootstrap';

// TYPES
type PostPropType = {
  id: string | number;
  title: string;
  content: string;
  imgUrl: string;
};

// Emotion CSS (Responsive Design)
import { css } from "@emotion/react";
import { min, max } from "../../../utils/mediaQueries";
const PostListCss = css`

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
  // GET All POSTS by User ID
  const { data, loading, error } = useQuery(GET_POSTS_BY_ID, {
    variables: {
      uid: 1
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data || !data.PostsByUser || data.PostsByUser.length === 0) return <p>No posts found.</p>;

  return (
    <div css={PostListCss}>
      <BackButton />

      <Row xs={1} md={2} className="g-4">
        {data.PostsByUser.map((item: PostPropType) => (
          <Col key={item.id}>

            {/* Component (Give a Prop) */}
            <PostItem postProp={item} />

          </Col>
        ))}
      </Row>

    </div>
  );
}

export default PostsList;