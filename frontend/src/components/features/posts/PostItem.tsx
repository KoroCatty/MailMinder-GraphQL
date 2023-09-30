import { Link } from 'react-router-dom';


// bootstrap
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

//* types 
type ImageProp = {
  id: number;
  src: string;
};

//* types 
type PostItemProps = {
  imagesProp: ImageProp[];
};

const PostItem: React.FC<PostItemProps> = ({ imagesProp }) => {
  return (
    <Row xs={1} md={2} className="g-4">
      {imagesProp.map((item) => (
        // {Array.from({ length: 4 }).map((item, idx) => (
        <Col key={item.id}>
          <Card>
            <Link to={`/postdetails/${item.id}`}>
              <Card.Img variant="top" src={item.src} style={{ width: "100px", height: "100px" }} />
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