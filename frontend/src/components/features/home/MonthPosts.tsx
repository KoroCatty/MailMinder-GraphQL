import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

const MonthPosts = () => {
  return (
    <>
      <h2 className='text-center m-6'>Monthly Posts</h2>

      <Row xs={1} md={2} className="g-4">
        {Array.from({ length: 2 }).map((_, idx) => (
          <Col key={idx}>
            <Card>
              <Card.Img variant="top" src="holder.js/100px160" />
              <Card.Body>
                <Card.Title>Card title</Card.Title>
                <Card.Text>
                  This is a longer card with supporting text below as a natural
                  lead-in to additional content. This content is a little bit
                  longer.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

    </>
  )
}

export default MonthPosts