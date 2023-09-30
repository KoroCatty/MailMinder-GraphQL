import { useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"

// Layout component
import Layout from './components/layout/Layout';

// pages
import AuthPage from "./pages/AuthPage"
import HomePage from "./pages/HomePage"
import NotFound from "./pages/NotFound"
import PostsPage from './pages/PostsPage';
import PostsDays from "./pages/PostsDays";
import SettingsPage from "./pages/SettingsPage";
import PostsDetailPage from "./pages/PostDetailPage";


// bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'

// react-bootstrap
import 'react-bootstrap/dist/react-bootstrap.min.js'

function App() {
  // ログインチェック
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem("token_GraphQL") ? true : false);

  return (
    <>
      <BrowserRouter>

        {loggedIn ? (
          // ログイン時
          <>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route path="/" index element={<HomePage />} />
                <Route path="*" element={<NotFound />} />

                <Route path="/posts" element={<PostsPage />} />
                <Route path="/postsDays" element={<PostsDays />} />
                <Route path="/postdetails/:id" element={<PostsDetailPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
            </Routes>
          </>
        ) : (
          // ログインしていない時
          <>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route path="/" index element={<HomePage />} />
                <Route path="/login" element={<AuthPage setLoggedIn={setLoggedIn} />} />
                <Route path="*" element={<NotFound />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </>
        )}


      </BrowserRouter >

    </>
  )
}

export default App
