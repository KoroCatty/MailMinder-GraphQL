import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// components
import { CommonBtn } from "../components/common/CommonBtn";

// Apollo
import { useMutation } from "@apollo/client";

// mutation queries
import { SIGNUP_USER } from "../graphql/mutations";
import { LOGIN_USER } from "../graphql/mutations";
// TYPE
type IsLoggedInPropsType = {
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

// Emotion CSS (Responsive Design)
import { css } from "@emotion/react";
import { min, max } from "../utils/mediaQueries";
const authPageCss = css`
  min-height: 74vh;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;

  h1 {
    font-size: 2.5rem;
    margin-bottom: 40px;
    letter-spacing: 1px;
  }

  input {
    padding: 10px;
    margin: 10px;
    border-radius: 5px;
    border: 1px solid #ddd;
    outline: none;
    width: 50%;

    &:focus {
      border: 1px solid #323232;
    }
  }

  // 1 px 〜 479 px
  ${min[0] + max[0]} {
  }
  // 480 px 〜 767 px
  ${min[1] + max[1]} {
  }
  // 768 px 〜 989 px
  ${min[2] + max[2]} {
  }
  // 990 px 〜
  ${min[3] + max[3]} {
  }

  .authLink {
    color: #4d4d4d;
    cursor: pointer;
    text-decoration: underline;
    margin: 60px auto;
    font-size: 1.2rem;
    width: fit-content;

    &:hover {
      color: #5358d0;
      transform: scale(1.05);
      transition: all 0.3s ease-in-out;
    }
  }
`;

//! ======================================================
// const AuthPage: React.FC<AuthPageProps> = ({ setLoggedIn }) => {
const AuthPage = ({ isLoggedIn, setIsLoggedIn }: IsLoggedInPropsType) => {
  // HOOKS
  const [showLogin, setShowLogin] = useState(true); // true = login, false = signup
  const [formData, setFormData] = useState({});

  const authForm = useRef<HTMLFormElement>(null);

  const navigate = useNavigate();

  // ログインしてたらホームに飛ばす
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");

      // if there is a path in sessionStorage, go to that path
      // if (sessionStorage.getItem("postPath")) {
      //   navigate(sessionStorage.getItem("postPath")!);
      // } else {
      //   navigate("/");
      // }
    }
  }, [isLoggedIn, navigate]);


  // Mutations (Sign Up)
  const [signupUser, { data: signupData, loading, error }] =
    useMutation(SIGNUP_USER);

  // Mutations (Login)
  const [
    loginUser,
    { data: loginData, loading: loginLoading, error: loginError },
  ] = useMutation(LOGIN_USER, {
    // onCompleted は mutation が完了した後に実行される
    // onCompleted(data) {
    onCompleted() {
      window.scrollTo(0, 0);
      setIsLoggedIn(true);  // Update the state 

      // if there is a path in sessionStorage, go to that path (Emailパス対応)
      if (sessionStorage.getItem("postPath")) {
        navigate(sessionStorage.getItem("postPath")!);
      } else {
        navigate("/");
      }
    },
  });

  //! ======================================================
  //! When loading
  //! ======================================================
  if (loading || loginLoading) {
    <h1>Loading...</h1>;
  }

  //! ======================================================
  //! When forms typed
  //! ======================================================
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value, // name attribute
    });
  };

  //! ======================================================
  //! When form submitted
  //! ======================================================
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (showLogin) {
      // login
      loginUser({
        variables: {
          userSignin: formData, // フォームに入力されたデータを送る (mutation.ts 定義)
        },
      });
    } else {
      // Signup
      signupUser({
        variables: {
          userNew: formData, // mutation.ts で定義したもの
        },
      });
    }
  };

  return (
    <div css={authPageCss}>
      {showLogin && <h1>LOGIN</h1>}
      {!showLogin && <h1>SIGN UP</h1>}

      <div>
        {/* サインアップ時 */}
        {signupData && <h1>{signupData.signupUser.firstName}You Signed Up!</h1>}

        {/* ログイン時 */}
        {loginData && <h1>{loginData.signinUser.firstName}You Logged In!</h1>}

        {/* エラー時 */}
        {error && <div>{error.message}</div>}
        {loginError && <div>{loginError.message}</div>}

        <form onSubmit={handleSubmit} ref={authForm}>
          {!showLogin && (
            <>
              <input
                name="firstName"
                type="text"
                placeholder="First Name"
                onChange={(e) => handleChange(e)}
              />
              <br />
              <br />
              <input
                name="lastName"
                type="text"
                placeholder="Last Name"
                onChange={(e) => handleChange(e)}
              />
              <br />
              <br />
            </>
          )}

          {/* email */}
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={(e) => handleChange(e)}
          />
          <br />
          <br />
          {/* Password */}
          <input
            name="password"
            type="password"
            autoComplete="on"
            placeholder="Password"
            onChange={(e) => handleChange(e)}
          />
          <br />
          <br />

          {/* link */}
          <div
            onClick={() => {
              setShowLogin((preValue) => !preValue); // toggle login/signup
              setFormData({}); // clear form data
              authForm?.current?.reset(); // clear form inputs
            }}
            className="authLink"
          >
            {showLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Login"}
          </div>

          {/* BUTTON */}
          <CommonBtn type="submit">{showLogin ? "Login" : "Sign Up"}</CommonBtn>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
