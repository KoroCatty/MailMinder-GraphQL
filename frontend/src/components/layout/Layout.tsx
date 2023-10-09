import { Outlet } from "react-router-dom"

// component for layout
import Header from "./Header"
import Footer from "./Footer"

// Emotion CSS (Responsive Design)
import { css } from "@emotion/react";
import { min, max } from "../../utils/mediaQueries";
const aaa = css`


  // 1px〜479px
  ${min[0] + max[0]} {
  }
  // 480px〜767px
  ${min[1] + max[1]} {
  }
  // 768px〜989px
  ${min[2] + max[2]} {
  }
  // 990px〜
  ${min[3] + max[3]} {
  }
  `;

const Layout = () => {
  return (
    <>
      <Header />

      <div css={aaa}>
      {/* この Outlet が Layout で囲ってる全てのコンポーネントを監視 Outlet を使い、ネストされたルートをレンダリングする */} 
      <Outlet /> 
      
      </div>
      <Footer /> 
    </>
  )
}

export default Layout