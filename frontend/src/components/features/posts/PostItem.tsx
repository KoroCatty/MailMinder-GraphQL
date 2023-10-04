import { Link } from 'react-router-dom';

// bootstrap
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

// Apollo Client
import { useMutation } from '@apollo/client';
import { DELETE_POST_BY_ID } from '../../../graphql/mutations';

//* types 
type PostPropType = {
  id: string ;
  title: string;
  content: string;
  imgUrl: string;
  createdAt: string;
  updatedAt: string;
};

// 配列で渡ってきた prop なので、それに配列の型を指定
type PostProp = {
  postProp: PostPropType[];
}

// Looping through the Prop
const PostItem: React.FC<PostProp> = ({ postProp }) => {
  console.log(postProp)



  const [deletePostById, { data, error, loading }] = useMutation(DELETE_POST_BY_ID, {
    variables: {
      id: postProp.id
    },
    // これらを refetch する
    refetchQueries: [ 'GET_POSTS_BY_ID' ],
  });
console.log(data)

  return (
    <Row xs={1} md={2} className="g-4">
      {postProp.map((item) => (

        
        <Col key={item.id}>
          <Card>
            <Link to={`/postdetails/${item.id}`}>
              <Card.Img variant="top" src={item.imgUrl} style={{ width: "100px", height: "100px" }} />
              <Card.Body>
                <Card.Title>Card title</Card.Title>
                <Card.Text>
                  This is a longer card with supporting text below as a natural
                  lead-in to additional content. This content is a little bit
                  longer.
                </Card.Text>



                {error && <p>Error! ${error.message}</p>}
                <button
                  className="btn btn-danger btn-sm"
                  // onClickハンドラはマウスイベントオブジェクトを引数として受け取ります。そのため、直接 deletePostById をonClickにアサインすることはできないので、アロー関数を使って、e.preventDefault()を実行してから deletePost を実行するようにします。
                  onClick={(e) => {
                    e.preventDefault();
                    window.confirm('Are you sure you want to delete this post?') &&
                    deletePostById();
                  }}
                >
                  {/* {loading ? 'Deleting...' : <FaTrash />} */}
                  {loading ? 'Deleting...' : 'Delete'}
                </button>

              </Card.Body>
            </Link>
          </Card>
        </Col>
      ))}
    </Row>
  )
}

export default PostItem