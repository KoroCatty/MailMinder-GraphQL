import { useState } from "react";

// Bootstrap
import { Navbar, Nav, Container } from "react-bootstrap";

// Emotion CSS (Responsive Design)
import { css } from "@emotion/react";
import { min, max } from "../../utils/mediaQueries";
const headerCss = css`
  @media screen and (min-width: 1201px) {
    background-color: #fdfdfd;
    height: 100vh;
    width: 16%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);

    .container {
      margin-top: -100px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      row-gap: 2rem;
      column-gap: 2rem;
    }

    .navbar-brand {
      margin-right: 0;
    }

    .navbar-nav {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2rem;
      margin-right: 0;

      a {
        &:hover {
          transform: scale(1.25);
          transition: all 0.3s ease-in-out;
        }
      }
    }

    .navbar-collapse {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      gap: 2rem;
    }
  }

  .logoutBtn {
    background-color: rgba(39, 39, 39, 0.9);
    color: #ffffff;
    font-size: 1.2rem;
    letter-spacing: 1px;
    border: 1px solid #4d4d4d;
    padding: 16px 20px;
    transition: all 0.3s ease-in-out;
    border-radius: 4px;

    &:hover {
      background-color: white;
      color: #4d4d4d;
      transition: all 0.3s ease-in-out;
      transform: scale(1.05);
    }
  }

  // 1px〜479px
  /* ${min[0] + max[0]} {
    background-color: #c32626;
  }
  // 480px〜767px
  ${min[1] + max[1]} {
    background-color: blue;
  }
  // 768px〜989px
  ${min[2] + max[2]} {
    background-color: green;
  }
  // 990px〜
  ${min[3] + max[3]} {
    background-color: yellow;
  } */
`;

import { Link } from "react-router-dom";
// import ToggleBtn from "../common/ToggleBtn";

//! ==============================================
function Header() {
  // const navigate = useNavigate();

  // ログインチェック (ローカルストレージ)
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("token_GraphQL") ? true : false
  );
  // console.log(loggedIn)

  return (
    <>
      <Navbar css={headerCss} expand="lg" className="">
        <Container>
          <Navbar.Brand as={Link} to="/">
            MailMinder
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav>
              {loggedIn ? (
                <>
                  <Nav.Link as={Link} to="/">
                    Home
                  </Nav.Link>
                  <Nav.Link as={Link} to="/postlist">
                    Posts
                  </Nav.Link>
                  <Nav.Link as={Link} to="/settings">
                    Settings
                  </Nav.Link>
                  <Nav.Link as={Link} to="/contact">
                    Contact
                  </Nav.Link>
                </>
              ) : (
                // <Nav.Link as={Link} to="/Login">Login</Nav.Link>
                ""
              )}
            </Nav>

            {/* //! LOGOUT / LOGIN */}
            <div style={{ color: "black", fontSize: "2rem" }}>
              {loggedIn ? (
                <button
                  className="logoutBtn"
                  onClick={() => {
                    localStorage.removeItem("token_GraphQL");
                    setLoggedIn(false);
                  }}
                >
                  LOGOUT
                </button>
              ) : (
                <Nav.Link as={Link} to="/Login">
                  Login
                </Nav.Link>
              )}
            </div>

            {/* avatar Icon */}
            {loggedIn ? (
              <Nav.Link as={Link} to="/settings">
                <img
                  src="https://picsum.photos/200"
                  alt="avatar"
                  className="rounded-circle"
                  style={{ width: "40px", height: "40px" }}
                />
              </Nav.Link>
            ) : (
              ""
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;
