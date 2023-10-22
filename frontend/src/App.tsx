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
import EditPostPage from "./pages/EditPostPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Contact from "./pages/Contact";


// bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'

// react-bootstrap
import 'react-bootstrap/dist/react-bootstrap.min.js'

function App() {
  // Login Check By Token in LocalStorage
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem("token_GraphQL") ? true : false);
  
  return (
    <>
      <BrowserRouter>

        {loggedIn ? (
          // LOGGED IN
          <>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route path="/" index={true} element={<HomePage />} />
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
          </>
        ) : (
          // NOT LOGIN
          <>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route path="/" index={true} element={<HomePage />} />
                <Route path="/login" element={<AuthPage setLoggedIn={setLoggedIn} />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/contact" element={<Contact />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </>
        )}


      </BrowserRouter >

    </>
  )
}

export default App
