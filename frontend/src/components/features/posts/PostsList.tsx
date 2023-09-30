import PostItem from "./PostItem";

// components
import BackButton from "../../common/BackButton";

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

function PostsList() {
  return (
    <>
    <BackButton />
    <h1 className="text-center m-5">Monthly Posts List</h1>

    {/* MAPPING */}
    <PostItem imagesProp={images}/>
    
    </>

  );
}

export default PostsList;