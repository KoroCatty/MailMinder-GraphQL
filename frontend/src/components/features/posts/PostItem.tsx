import { useMutation } from '@apollo/client';

// queries & mutations
import { DELETE_POST_BY_ID } from '../../../graphql/mutations';
// import { GET_POSTS_BY_ID } from '../../../graphql/queries';  // Import the query

import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';

// TYPES
export type PostPropType = {
  id: string | number;
  title: string;
  content: string;
  imgUrl: string;
};

type PostPropTypeComponent = {
  postProp: PostPropType;
};

// type PostsQueryCacheResult = {
//   PostsByUser: PostPropType[];
// };

const PostCard: React.FC<PostPropTypeComponent> = ({ postProp, refetch }) => {

  //! DELETE POST MUTATION
  // `useMutation` フックを使用して、投稿の削除を行うmutationをセットアップ
  const [deletePostById, { error, loading }] = useMutation(DELETE_POST_BY_ID, {
    // 削除する投稿のIDを変数としてセット
    variables: { id: postProp.id },
    awaitRefetchQueries: true, // mutationが完了するのを待ってから、refetchQueriesを実行

    // キャッシュを更新するための関数
    update(cache, { data: { deletePost } }) {
      // キャッシュの中の特定のフィールドを変更
      cache.modify({
        fields: {
          // `PostsByUser` フィールドを変更
          PostsByUser(existingPostsByUser = []) {
            // 削除した投稿をキャッシュから削除
            cache.evict({ id: cache.identify(deletePost) });
            // 削除した投稿を除外して、更新後の投稿リストを返す
            return existingPostsByUser.filter(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (postRef: any) => postRef.__ref !== deletePost.__ref
            );
          }
        }
      })
    }

  //   update(cache, { data: { deletePost } }) {
  //     const data = cache.readQuery<PostsQueryCacheResult>({ query: GET_POSTS_BY_ID, variables: { uid: Number() } });
  //     console.log(data)
  //     if (!data) return; 

  //     // console.log(deletePost.id)
      
  //     const { PostsByUser } = data;
  //     console.log(PostsByUser)
  //     cache.writeQuery({ // writeQueryでキャッシュを更新
  //       query: GET_POSTS_BY_ID,
  //       data: { PostsByUser: PostsByUser.filter(post => post.id !== deletePost.id) },
  //     });
  //     console.log(PostsByUser)
  //     if (error) console.log(error);
  //   }
  });

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  return (
    <Card>
      <Link to={`/postdetails/${postProp.id}`}>
        <Card.Img variant="top" src={postProp.imgUrl} style={{ width: "300px", height: "300px", margin: "0 auto", display: "block" }} />
        <Card.Body>
          <Card.Title>{postProp.title}</Card.Title>
          <Card.Text>
            {postProp.content}
          </Card.Text>
        </Card.Body>
      </Link>
      {error && <p>Error! {error.message}</p>}

      {/* EDIT BUTTON */}
      <Link to={`/editpost/${postProp.id}`} onClick={()=>{scrollTop()}}>
        <button className="btn btn-primary mb-4" style={{width:"100%"}} >Edit</button>
      </Link>

      {/*//! DELETE BUTTON */}
      <button
        className="btn btn-danger btn-sm"
        onClick={(e) => {
          e.preventDefault();
          window.confirm('Are you sure you want to delete this post?') &&
            deletePostById();

            // refetch(); // From parent component
        }}
      >
        {loading ? 'Deleting...' : 'Delete'}
      </button>

    </Card>
  );
};

export default PostCard;
