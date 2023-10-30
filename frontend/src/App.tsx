// import { useState, useEffect } from "react"; 

import { BrowserRouter, Routes, Route } from "react-router-dom"

// Layout component
import Layout from './components/layout/Layout';
import PrivateRoutes from "./components/common/PrivateRoutes";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

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

import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
const IS_LOGGED_IN_QUERY = gql`
  query IsLoggedIn {
    isLoggedIn
  }
`;

function App() {
  // Login Check Query
  const { data, loading, error } = useQuery(IS_LOGGED_IN_QUERY, {
    fetchPolicy: 'network-only' // キャッシュを使わない
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const isLoggedIn = data?.isLoggedIn;
  console.log(isLoggedIn) // true or false

  return (
    <>
      <BrowserRouter>
        <Header isLoggedIn={isLoggedIn} />
        <>
          <Routes>
            <Route path="/" element={<Layout isLoggedIn={isLoggedIn} />}>
              <Route path="/" index={true} element={<HomePage isLoggedIn={isLoggedIn} />} />
              <Route path="/login" element={<AuthPage />} />
                <Route path="/contact" element={<Contact />} />

              {/* //! ログインユーザーのみ */}
              <Route path="" element={<PrivateRoutes isLoggedIn={isLoggedIn} />}>
              <Route path="/" index={true} element={<HomePage isLoggedIn={isLoggedIn} />} />
                <Route path="/postlist" element={<PostsPage />} />
                <Route path="/postsDays" element={<PostsDays />} />
                <Route path="/postdetails/:id" element={<PostsDetailPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/editpost/:id" element={<EditPostPage />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </>

        <Footer />

        {/* //! ADMIN ユーザーのみ */}
        {/* <Route path="" element={<AdminRoute />}>
        <Route path="/admin/orderlist" element={<OrderListScreen />} />
        <Route path="/admin/productlist" element={<ProductListScreen />} />
        <Route path="/admin/product/:id/edit" element={<ProductEditScreen />} />
        <Route path="/admin/userlist" element={<UserListScreen />} />
        <Route path="/admin/user/:id/edit" element={<UserEditScreen />} />
      </Route> */}


        {/* {isLoggedIn ? (
          // LOGGED IN
          <>
            <Route path="" element={<PrivateRoutes isLoggedIn />}>
              <Routes>
                <Route path="/" element={<Layout isLoggedIn={isLoggedIn} />}>
                  <Route path="/" index={true} element={<HomePage isLoggedIn={isLoggedIn} />} />
                  <Route path="/postlist" element={<PostsPage />} />
                  <Route path="/postsDays" element={<PostsDays />} />
                  <Route path="/postdetails/:id" element={<PostsDetailPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/editpost/:id" element={<EditPostPage />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/contact" element={<Contact />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Route>
          </>
        ) : (
          // NOT LOGIN
          <>
            <Routes>
              <Route path="/" element={<Layout isLoggedIn={isLoggedIn} />}>
                <Route path="/" index={true} element={<HomePage isLoggedIn={isLoggedIn} />} />
                <Route path="/login" element={<AuthPage />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/contact" element={<Contact />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </>
        )} */}


      </BrowserRouter >

    </>
  )
}

export default App
