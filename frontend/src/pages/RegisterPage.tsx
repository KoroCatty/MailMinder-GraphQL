import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import LoadingSpinner from "../components/common/LoadingSpinner";
// components
import { CommonBtn } from "../components/common/CommonBtn";
// Apollo
import { useMutation } from "@apollo/client";
// mutation queries
import { SIGNUP_USER } from "../graphql/mutations";
import { LOGIN_USER } from "../graphql/mutations";
// CSS
import { authPageCss } from "../styles/authPageCSS";

// TYPE
type IsLoggedInPropsType = {
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
};

// Form TYPE 
type FormDataType = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const RegisterPage = ({ isLoggedIn, setIsLoggedIn }: IsLoggedInPropsType) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormDataType>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [submitLoading, setSubmitLoading] = useState(false);

  // Mutations (Sign Up)
  const [
    signupUser,
    // { data: signupData, loading, error }
  ] = useMutation(SIGNUP_USER);

  // Mutations (Login)
  const [
    loginUser,
    // { data: loginData, loading: loginLoading, error: loginError },
  ] = useMutation(LOGIN_USER, {
    onCompleted() {
      window.scrollTo(0, 0);
      setIsLoggedIn(true); // Update the state
      // if there is a path in sessionStorage, go to that path (Emailパス対応)
      if (sessionStorage.getItem("postPath")) {
        navigate(sessionStorage.getItem("postPath")!);
      } else {
        navigate("/");
      }
    },
  });

  // ログインしてたらホームに飛ばす
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

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
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setSubmitLoading(true);
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Password does not match");
      setSubmitLoading(false);
      return;
    }

    // confirmPassword を除外 (QraphQL に送らないため)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...rest } = formData; 

    try {
      // Signup
      signupUser({
        variables: {
          userNew: rest, // mutation.ts で定義したもの
        },
      });
      navigate("/login");
      alert("Sign Up Success! Please Login");
    } catch (error) {
      console.log("error", error);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <>
      {submitLoading ? (
        <div style={{ margin: "8rem 0" }}>
          <LoadingSpinner loading={true} />
        </div>
      ) : (
        <>
          <div css={authPageCss} style={{ marginTop: "2rem" }}>
            <h1>SIGN UP</h1>

            <form onSubmit={handleSubmit}>
              <input
                name="firstName"
                type="text"
                placeholder="First Name"
                onChange={(e) => handleChange(e)}
                required
              />
              <input
                name="lastName"
                type="text"
                placeholder="Last Name"
                onChange={(e) => handleChange(e)}
              />
              {/* email */}
              <input
                name="email"
                type="email"
                placeholder="Email"
                onChange={(e) => handleChange(e)}
                required
              />
              {/* Password */}
              <input
                name="password"
                type="password"
                autoComplete="on"
                placeholder="Password"
                onChange={(e) => handleChange(e)}
                required
              />
              {/* Confirm Password */}
            <input
              name="confirmPassword"
              type="password"
              autoComplete="on"
              placeholder="Confirm Password"
              onChange={handleChange}
              required
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
                <Link to="/login">Already have an account?</Link>
              </div>

              {/* BUTTON */}
              <CommonBtn type="submit">Register</CommonBtn>
            </form>
          </div>
        </>
      )}
    </>
  );
};

export default RegisterPage;
