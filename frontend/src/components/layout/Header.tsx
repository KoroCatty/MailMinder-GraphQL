// import { useNavigate } from "react-router-dom";
import { useState } from "react";

// Bootstrap
import { Navbar, Nav, Container } from "react-bootstrap";

// Emotion
import { css } from "@emotion/react";
const headerStyles = css`
  @media screen and (min-width: 991px) {
      height: 90px !important;
  }
  .container {
    height: 60px;
  }
`;

import { Link } from 'react-router-dom';
// import ToggleBtn from "../common/ToggleBtn";


//! ==============================================
function Header() {

  // const navigate = useNavigate();

  // ログインチェック (ローカルストレージ)
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem("token_GraphQL") ? true : false);
  // console.log(loggedIn)

  return (
    <>
      <Navbar css={headerStyles} expand="lg" className="bg-body-tertiary" >
        <Container>
          <Navbar.Brand as={Link} to="/">MailMinder</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {loggedIn ? (
                <>
                  <Nav.Link as={Link} to="/">Home</Nav.Link>
                  <Nav.Link as={Link} to="/postlist">Posts</Nav.Link>
                  <Nav.Link as={Link} to="/settings">Settings</Nav.Link>
                </>
              ) : (
                // <Nav.Link as={Link} to="/Login">Login</Nav.Link>
                ""
              )}
            </Nav>

            {/* //! LOGOUT / LOGIN */}
            <div style={{color: "black", fontSize: "2rem"}}>
              {loggedIn ? (
                <button onClick={() => {
                  localStorage.removeItem("token_GraphQL");
                  // navigate("/login")
                  setLoggedIn(false);
                }}>LOGOUT
                </button>
              ) : (
                <Nav.Link as={Link} to="/Login">Login</Nav.Link>
              )}
            </div>

            {/* avatar Icon */}
            <Nav.Link as={Link} to="/settings">
              <img src="https://picsum.photos/200" alt="avatar" className="rounded-circle" style={{ width: "40px", height: "40px" }} />
            </Nav.Link>

          </Navbar.Collapse>

        </Container>
      </Navbar>
    </>
  );
}

export default Header;