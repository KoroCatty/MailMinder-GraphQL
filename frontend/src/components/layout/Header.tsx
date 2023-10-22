import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

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

    /* LOGO */
    .navbar-brand {
      margin-right: 0;
    }

    // MENU ITEM
    .navbar-nav {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2rem;
      margin-right: 0;

      // MENU LINK
      .nav-link {
        &:hover {
          transform: scale(1.25);
          transition: all 0.3s ease-in-out;
        }
      }
    }

    // MENU ITEMS WRAPPER
    .navbar-collapse {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      gap: 2rem;
    }
  }

  //!
  //! MENU ITEMS HAMBURGER (1200px以下の操作はこれより下)
  //!
  .navbar-collapse.collapse {
    // 990px〜1200px
    ${min[3] + max[3]} {
      justify-content: space-between;
    }

    .nav-link {
      // 1px〜479px
      ${min[0] + max[0]} {
        margin: 0.6rem 0;
        width: fit-content;
      }
      // 480px〜767px
      ${min[1] + max[1]} {
        margin: 0.6rem 0;
        width: fit-content;
      }
      // 768px〜989px
      ${min[2] + max[2]} {
        margin: 0.6rem 0;
        width: fit-content;

        &:hover {
          color: #c32626;
          transition: all 0.3s ease-in-out;
        }
      }

      // 990px〜1200px
      ${min[3] + max[3]} {
        &:hover {
          transform: scale(1.25);
          transition: all 0.3s ease-in-out;
        }
      }
    }
  }

  /* Logout Btn & User Icon */
  .navRight {
    @media screen and (min-width: 989px) {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
    }

    @media screen and (min-width: 1201px) {
      flex-direction: column;
      gap: 2rem;
    }

    &__logoutBtn {
      background-color: rgba(39, 39, 39, 0.9);
      color: #ffffff;
      font-size: 1.2rem;
      letter-spacing: 1px;
      border: 1px solid #4d4d4d;
      padding: 12px 16px;
      transition: all 0.3s ease-in-out;
      border-radius: 4px;

      &:hover {
        background-color: white;
        color: #4d4d4d;
        transition: all 0.3s ease-in-out;
        transform: scale(1.05);
      }
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
  // 990px〜1200
  ${min[3] + max[3]} {
    background-color: yellow;
  } */
`;


//! ==============================================
function Header() {

  const navigate = useNavigate();

  // ログインチェック (ローカルストレージ)
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("token_GraphQL") ? true : false
  );
  // console.log(loggedIn)

  const toTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  };

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
                  <Nav.Link as={Link} to="/" onClick={() => toTop()}>
                    Home
                  </Nav.Link>
                  <Nav.Link as={Link} to="/postlist" onClick={() => toTop()} >
                    Posts
                  </Nav.Link>
                  <Nav.Link as={Link} to="/settings" onClick={() => toTop()} >
                    Settings
                  </Nav.Link>
                  <Nav.Link as={Link} to="/contact" onClick={() => toTop()} >
                    Contact
                  </Nav.Link>
                </>
              ) : (
                // <Nav.Link as={Link} to="/Login">Login</Nav.Link>
                ""
              )}
            </Nav>

            {/* //! LOGOUT / LOGIN */}
            <div className="navRight">
              {loggedIn ? (
                <button
                  className="navRight__logoutBtn"
                  onClick={() => {
                    localStorage.removeItem("token_GraphQL");
                    setLoggedIn(false);
                    navigate("/login");
                    window.location.reload();
                  }}
                >
                  LOGOUT
                </button>
              ) : (
                <>
                  <Nav.Link as={Link} to="/Login">
                    Login
                  </Nav.Link>
                  <Nav.Link as={Link} to="/contact" onClick={() => toTop()} >
                    Contact
                  </Nav.Link>
                </>
              )}

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
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;
