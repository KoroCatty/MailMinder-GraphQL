import Container from "react-bootstrap/Container";

// components
import PostsList from "../components/features/posts/PostsList";

function ProductsPage() {
  return (
    <main>
      <Container>
        <PostsList />
      </Container>
    </main>
  );
}

export default ProductsPage;
