import { useState, useRef } from "react"

// Apollo
import { useMutation } from "@apollo/client";

// mutation queries
import { SIGNUP_USER } from "../graphql/mutations";
import { LOGIN_USER } from "../graphql/mutations";

// TYPES
type AuthPageProps = {
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
}


const AuthPage: React.FC<AuthPageProps> = ({ setLoggedIn }) => {
  const [showLogin, setShowLogin] = useState(true) // true = login, false = signup
  const [formData, setFormData] = useState({});

  const authForm = useRef<HTMLFormElement>(null);

  // Mutations
  const [signupUser, { data: signupData, loading, error }] = useMutation(SIGNUP_USER);

  const [loginUser, { data: loginData, loading: loginLoading, error: loginError }] = useMutation(LOGIN_USER, {
    onCompleted(data) {
      console.log(data)
      // mutaion.ts で定義したものを取得しローカルに保存
      localStorage.setItem("token_GraphQL", data.signinUser.token);
      setLoggedIn(true);
    }
  });

  //! ======================================================
  //! When loading
  //! ======================================================
  if (loading || loginLoading) { <h1>Loading...</h1> }

  //! ======================================================
  //! When forms typed
  //! ======================================================
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value // name attribute
    })
  };

  //! ======================================================
  //! When form submitted
  //! ======================================================
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);

    if (showLogin) {
      // login 
      loginUser({
        variables: {
          userSignin: formData // フォームに入力されたデータを送る
        }
      })
    } else {
      // Signup
      signupUser({ // mutation.ts で定義したもの
        variables: { // お決まり 
          userNew: formData // mutation.ts で定義したもの
        }
      })
    }
  }


  return (
    <>
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
          {/* {showLogin ? (
            <Link to ="/signup">Don't have an account? Sign up</Link>
          ) : (
            <Link to ="/login">Already have an account? Login</Link>
          )} */}

          <div onClick={() => {
            setShowLogin((preValue) => !preValue) // toggle login/signup
            setFormData({}) // clear form data
            authForm?.current?.reset() // clear form inputs
          }}>
            {showLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
          </div>

          {/* BUTTON */}
          <button type="submit">{showLogin ? "Login" : "Sign Up"}</button>
        </form>
      </div>
    </>
  )
}

export default AuthPage