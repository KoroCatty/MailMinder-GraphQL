// components
import BackButton from "../../common/BackButton";
import PostItem from "./PostItem";

// Apollo Client
import { useQuery } from '@apollo/client';
import { GET_POSTS_BY_ID } from '../../../graphql/queries';

//! ============================================================
function PostsList() {
  // GET All POSTS by User ID
  const  { data, loading, error } = useQuery(GET_POSTS_BY_ID, {
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
      <h1 className="text-center m-5">Monthly Posts List</h1>

      {/* Give a Prop */}
      <PostItem postProp={data.PostsByUser} />
    </>
  );
}

export default PostsList;