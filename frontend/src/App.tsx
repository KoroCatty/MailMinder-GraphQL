import { useState, useEffect } from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom"

// components
import Layout from './components/layout/Layout';
import PrivateRoutes from "./components/common/PrivateRoutes";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import ColorThemeGlobal from "./components/common/ColorThemeGlobal";


// pages
import AuthPage from "./pages/AuthPage"
import HomePage from "./pages/HomePage"
import NotFound from "./pages/NotFound"
import PostsPage from './pages/PostsPage';
import PostsDays from "./pages/PostsDays";
import SettingsPage from "./pages/SettingsPage";
import PostsDetailPage from "./pages/PostDetailPage";
import EditPostPage from "./pages/EditPostPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Contact from "./pages/Contact";

// bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'

// react-bootstrap
import 'react-bootstrap/dist/react-bootstrap.min.js'

// Apollo client
import { useQuery } from '@apollo/client';
import { IS_LOGGED_IN_QUERY } from "./graphql/queries";


function App() {
  // Login Check 
  const { data, loading, error } = useQuery(IS_LOGGED_IN_QUERY, {
    fetchPolicy: 'network-only', // キャッシュを使わない
    //   onCompleted: (data) => setIsLoggedIn(data.isLoggedIn)// ログイン状態を更新
  });

  // ログイン状態
  const [isLoggedIn, setIsLoggedIn] = useState(data?.isLoggedIn || false);

  // Theme Color Toggle
  const [darkTheme, setDarkTheme] = useState(localStorage.getItem('Theme-color') === 'true');

  // ログイン状態を更新 (If there's data)
  useEffect(() => {
    setIsLoggedIn(data?.isLoggedIn || false);
  }, [data]);

  //! if user tried to access 'postdetails:id' from Email
  useEffect(() => {
    if (window.location.pathname.includes("postdetails")) {
      sessionStorage.setItem("postPath", window.location.pathname);
    }
  }, []);

  if (loading) return <p>読み込み中</p>;
  if (error) return <p>Error: {error.message}</p>;


  return (
    <>
      {/* Toggle Dark Theme */}
      {darkTheme ? <ColorThemeGlobal /> : null}

      <BrowserRouter>
        <Header
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          darkTheme={darkTheme}
          setDarkTheme={setDarkTheme}
        />

        <>
          <Routes>
            <Route path="" element={<Layout isLoggedIn={isLoggedIn} darkTheme={darkTheme} />}>
              <Route path="/" index={true} element={<HomePage isLoggedIn={isLoggedIn} />} />
              <Route path="/login" element={<AuthPage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />

              {/* //! ログインユーザーのみ */}
              <Route path="" element={<PrivateRoutes isLoggedIn={isLoggedIn} />}>
                <Route path="/postlist" element={<PostsPage />} />
                <Route path="/postsDays" element={<PostsDays />} />
                <Route path="/postdetails/:id" element={<PostsDetailPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/editpost/:id" element={<EditPostPage />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </>

        <Footer isLoggedIn={isLoggedIn} />

        {/* //! ADMIN ユーザーのみ */}
        {/* <Route path="" element={<AdminRoute />}>
            </Route> */}
      </BrowserRouter >

    </>
  )
}

export default App
