import { Link } from 'react-router-dom';

// bootstrap
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

//* types 
type PostPropType = {
  id: string;
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
              </Card.Body>
            </Link>
          </Card>
        </Col>
      ))}
    </Row>
  )
}

export default PostItem