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
    <>
      <BackButton />
      <h1 className="text-center m-5">All Posts List</h1>

      <Row xs={1} md={2} className="g-4">
        {data.PostsByUser.map((item: PostPropType) => (
          <Col key={item.id}>

            {/* Component (Give a Prop) */}
            <PostItem postProp={item} />

          </Col>
        ))}
      </Row>








    </>
  );
}

export default PostsList;