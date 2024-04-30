//! LOGIN PAGE
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import LoadingSpinner from "../components/common/LoadingSpinner";
// components
import { CommonBtn } from "../components/common/CommonBtn";

// Apollo
import { useMutation } from "@apollo/client";

// mutation queries
import { LOGIN_USER } from "../graphql/mutations";

// TYPE
type IsLoggedInPropsType = {
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
};

// CSS
import { authPageCss } from "../styles/authPageCSS";

//! ======================================================
const AuthPage = ({ isLoggedIn, setIsLoggedIn }: IsLoggedInPropsType) => {
  const [formData, setFormData] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);

  // useRef
  const authForm = useRef<HTMLFormElement>(null);

  const navigate = useNavigate();

  // ログインしてたらホームに飛ばす
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  // Mutations (Login)
  const [loginUser, { data: loginData, error: loginError }] = useMutation(
    LOGIN_USER,
    {
      onCompleted() {
        window.scrollTo(0, 0);
        setIsLoggedIn(true); // Update the state

        const setSessionStorageWithExpiry = (
          key: string,
          value: string,
          ttl: number,
        ) => {
          const now = new Date();
          // `ttl` はミリ秒で有効期限を設定
          const item = {
            value: value,
            expiry: now.getTime() + ttl,
          };
          sessionStorage.setItem(key, JSON.stringify(item));
        };

        // セッションストレージにパスを保存
        const path = sessionStorage.getItem("postPath");
        if (path) {
          setSessionStorageWithExpiry("postPath", path, 86400000); // 24時間後に期限切れ
          navigate(path);
        } else {
          navigate("/");
        }
      },

      // if there is a path in sessionStorage, go to that path (Emailパス対応)
      //   if (sessionStorage.getItem("postPath")) {
      //     navigate(sessionStorage.getItem("postPath")!);
      //   } else {
      //     navigate("/");
      //   }
      // },
    },
  );

  //! ======================================================
  //! DEMO ACCOUNT LOGIN
  //! ======================================================
  const demoCredential = () => {
    loginUser({
      variables: {
        userSignin: {
          email: "demo@demo.com",
          password: "1234",
        },
      },
    });
  };
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
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setSubmitLoading(true);
    e.preventDefault();
    try {
      // login
      await loginUser({
        variables: {
          userSignin: formData, // フォームに入力されたデータを送る (mutation.ts 定義)
        },
      });
    } catch (error) {
      console.error("Error during form submission:", error);
    } finally {
      setSubmitLoading(false);
    }
  };

  return submitLoading ? (
    <div style={{ margin: "8rem 0" }}>
      <LoadingSpinner loading={true} />
    </div>
  ) : (
    <div css={authPageCss}>
      <h1 style={{ marginTop: "2rem" }}>LOGIN</h1>
      <div>
        {/* ログイン時 */}
        {loginData && <h1>{loginData.signinUser.firstName}You Logged In!</h1>}
        {loginError && (
          <div style={{ color: "red" }}>{"Credential is incorrect..."}</div>
        )}

        <form onSubmit={handleSubmit} ref={authForm}>
          {/* email */}
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={(e) => handleChange(e)}
          />

          {/* Password */}
          <input
            name="password"
            type="password"
            autoComplete="on"
            placeholder="Password"
            onChange={(e) => handleChange(e)}
          />

          {/* //! DEMO */}
          <div
            onClick={() => {
              demoCredential();
              setSubmitLoading(true);
            }}
            className="demoLogin"
          >
            DEMO LOGIN
          </div>

          {/* link */}
          <div className="linkBtn">
            <Link to="/register">Don't have an account? Sign up</Link>
          </div>

          {/* BUTTON */}
          <CommonBtn type="submit">Login</CommonBtn>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
