import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

// 画像のURLを配列に保存
const images = [
  {
    id: 1,
    src: '/imgs/Diamond.jpg',
    title: "expensive computation",
    content: "This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.",
    timeCreated: "2021-09-01T00:00:00.000Z",
  },
  {
    id: 2,
    src: '/imgs/smile_design.jpg',
    title: "Card title",
    content: "This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.",
    timeCreated: "2021-09-01T00:00:00.000Z",
  },
  {
    id: 3,
    src: '/imgs/universal.jpg',
    title: "Card title",
    content: "This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.",
    timeCreated: "2021-09-01T00:00:00.000Z",
  },
  {
    id: 4,
    src: '/imgs/noImg.jpeg',
    title: "Card title",
    content: "This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.",
    timeCreated: "2021-09-01T00:00:00.000Z",
  },
];

const RecentPosts = () => {
  return (
    <div className="container">

      <h2>Recent Posts</h2>
    <div className="row">
      {images.map((image) => (
        <div className="col-md-3 col-12 mb-4" key={image.id}>
          <div className="card">
            <img src={image.src} className="card-img-top" alt={image.title} />
            <div className="card-body">
              <h5 className="card-title">{image.title}</h5>
              <p className="card-text">{image.content}</p>
              <p className="card-text"><small className="text-muted">{image.timeCreated}</small></p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
  )
}

export default RecentPosts