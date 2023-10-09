import { Outlet } from "react-router-dom"

// component for layout
import Header from "./Header"
import Footer from "./Footer"

// Emotion CSS (Responsive Design)



const Layout = () => {
  return (
    <>
      <Header />
      {/* この Outlet が Layout で囲ってる全てのコンポーネントを監視 Outlet を使い、ネストされたルートをレンダリングする */} 
      <Outlet /> 
      <Footer /> 
    </>
  )
}

export default Layout