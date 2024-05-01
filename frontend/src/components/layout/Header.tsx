import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
// components
import ToggleThemeBtn from "../common/ToggleThemeBtn";
// Bootstrap
import { Navbar, Nav, Container } from "react-bootstrap";
// Apollo client
import { useApolloClient, useQuery } from "@apollo/client"; // Main.tsx で wrapしたもの
import { LOGOUT_MUTATION } from "../../graphql/mutations";
import { GET_LOGGEDIN_USER_DETAILS } from "../../graphql/queries";
import { GET_USER_IMG_BY_USER_ID } from "../../graphql/queries";

// TYPE
type PropsType = {
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  darkTheme: boolean;
  setDarkTheme: (themeUpdater: (prevTheme: boolean) => boolean) => void;
};

// Emotion CSS (Responsive Design)
import { css } from "@emotion/react";
import { min, max } from "../../utils/mediaQueries";

function Header({
  isLoggedIn,
  setIsLoggedIn,
  darkTheme,
  setDarkTheme,
}: PropsType) {
  const navigate = useNavigate();
  const client = useApolloClient(); // main.tsx で wrapしたもの

  const headerCss = css`
    // MENU LINK
    .nav-link {
      &:hover {
        transform: scale(1.25);
        transition: all 0.3s ease-in-out;
      }
    }

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
      }

      // MENU ITEMS WRAPPER
      .navbar-collapse {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        ${isLoggedIn ? "gap: 1.5rem;" : "gap: 0"}
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

    /* Logout Btn & User Icon & Toggle Btn */
    .navRight {
      @media screen and (min-width: 989px) {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 2rem;
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

        @media screen and (max-width: 992px) {
          margin: 2rem 0;
        }

        &:hover {
          background-color: white;
          color: #4d4d4d;
          transition: all 0.3s ease-in-out;
          transform: scale(1.05);
        }
      }
    }

    .loggedInUserInfo {
      color: #4d4d4d;
      text-align: center;

      @media screen and (max-width: 1199px) {
        text-align: left;
      }

      p {
        font-weight: 600;
        margin-bottom: 0.5rem;
        font-size: 1.2rem;

        @media screen and (max-width: 1199px) {
          margin-bottom: 0.1rem;
        }
      }
    }

    //! Control the Theme Toggle Button
    .ToggleThemeBtn__PC {
      display: none;

      @media screen and (min-width: 1201px) {
        display: block;
      }
    }

    .ToggleThemeBtn__SP {
      display: block;

      @media screen and (max-width: 992px) {
        margin: 2rem 0;
      }

      @media screen and (min-width: 1201px) {
        display: none;
      }
    }
  `;

  // Scroll to Top
  const toTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  //! ログアウト処理
  const logout = async () => {
    try {
      const { data } = await client.mutate({ mutation: LOGOUT_MUTATION });
      if (data.logout) {
        setIsLoggedIn(false); // Update the state
        navigate("/login");
      }
    } catch (error) {
      console.error("ログアウト中にエラーが発生しました:", error);
    }
  };

  //! ログイン中のユーザー情報を取得
  const { data: userData, loading: userLoading } = useQuery(
    GET_LOGGEDIN_USER_DETAILS,
    {
      skip: !isLoggedIn, // クエリをスキップ (前者が残ったまま更新されない事を防ぐ)
      fetchPolicy: "cache-and-network", // キャッシュから読み込みつつ、ネットワークからも更新を試みる
    },
  );

  //! ユーザーのプロフィール画像を取得
  const { data: userImgData } = useQuery(GET_USER_IMG_BY_USER_ID, {
    // ログイン中のユーザーIDを渡し、それを引数にして GraphQLで MongoDB から取得
    variables: { userId: userData?.getLoggedInUserDetails.id }, // ex) userId: 2
    skip: !isLoggedIn,
    fetchPolicy: "cache-and-network",
  });

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
              {isLoggedIn ? (
                <>
                  <Nav.Link as={Link} to="/" onClick={() => toTop()}>
                    Home
                  </Nav.Link>
                  <Nav.Link as={Link} to="/postlist" onClick={() => toTop()}>
                    All Posts
                  </Nav.Link>
                  <Nav.Link as={Link} to="/contact" onClick={() => toTop()}>
                    Contact
                  </Nav.Link>
                </>
              ) : (
                ""
              )}
            </Nav>

            {/*//!  User info */}
            {userLoading ? (
              <p>Loading...</p>
            ) : (
              <div className="loggedInUserInfo">
                {isLoggedIn ? (
                  <div>
                    <p>{userData?.getLoggedInUserDetails.firstName}</p>
                    <address>{userData?.getLoggedInUserDetails.email}</address>
                  </div>
                ) : (
                  ""
                )}
              </div>
            )}

            {/* //! User Profile Image  */}
            {!isLoggedIn ? (
              ""
            ) : (
              <Nav.Link as={Link} to={isLoggedIn ? `/settings` : `/login`}>
                <img
                  style={{ width: "52px", height: "52px" }}
                  className="rounded-circle"
                  src={
                    userImgData?.getUserImgByUserId?.imgCloudinaryUrl ||
                    // "/imgs/noImg.jpeg"
                    "/imgs/default_icon.png"
                  }
                  onError={(e) => {
                    const imgElement = e.target as HTMLImageElement;
                    if (imgElement) {
                      // imgElement.src = "/imgs/noImg.jpeg";
                      ("/imgs/default_icon.png");
                    }
                  }}
                  alt="Profile Img"
                />
              </Nav.Link>
            )}

            <div className="navRight">
              {/* //! TOGGLE BUTTON */}
              <div className="ToggleThemeBtn__SP">
                <ToggleThemeBtn
                  darkTheme={darkTheme}
                  setDarkTheme={setDarkTheme}
                />
              </div>

              {/* //! LOGOUT / LOGIN */}
              {isLoggedIn ? (
                <button
                  className="navRight__logoutBtn"
                  onClick={() => {
                    logout(); // ログアウト処理
                  }}
                >
                  LOGOUT
                </button>
              ) : (
                // ログインしていない場合
                <>
                  <Nav.Link as={Link} to="/Login">
                    Login
                  </Nav.Link>
                  <Nav.Link as={Link} to="/contact" onClick={() => toTop()}>
                    Contact
                  </Nav.Link>
                </>
              )}
            </div>
          </Navbar.Collapse>

          {/* //! TOGGLE BUTTON */}
          <div className="ToggleThemeBtn__PC">
            <ToggleThemeBtn darkTheme={darkTheme} setDarkTheme={setDarkTheme} />
          </div>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;
