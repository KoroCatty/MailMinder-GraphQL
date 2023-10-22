import { Outlet } from "react-router-dom";
import { useState } from "react";
import { useLocation } from "react-router-dom";

// component for layout
import Header from "./Header";
import Footer from "./Footer";
import Hero from "../common/Hero";
import ContactHero from "../features/contact/ContactHero";

// Emotion CSS (Responsive Design)
import { css } from "@emotion/react";
import { min, max } from "../../utils/mediaQueries";

//! ================================================
const Layout = () => {
  const location = useLocation();
  // console.log(location.pathname); // ex) /about

  // Login Check 
  const [loggedIn] = useState(localStorage.getItem("token_GraphQL") ? true : false);


  //? Emotion CSS (Responsive Design)
  const LayoutCss = css`
    // '/postlist' パスの場合のみ背景画像を適用
    ${location.pathname === "/postlist" &&
    `
        background-image: url('./imgs/marbleBg.jpg');
      `}

    // 1201px 以上の場合
    @media screen and (min-width: 1201px) {
      margin-left: 16%; // header の幅分だけ右にずらす
      padding: 40px 100px;
    }

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
  return (
    <>
      <Header />

      {/* Only Logged in, show Hero */}
      {loggedIn &&
        (
          location.pathname === "/postlist" ? <Hero />
            : null
        )
      }

      {/* Always show Hero in those pages */}
      { location.pathname === "/contact" ? <ContactHero /> : null}
      { location.pathname === "/" ? <Hero /> : null}

      <div css={LayoutCss}>
        {/* この Outlet が Layout で囲ってる全てのコンポーネントを監視 Outlet を使い、ネストされたルートをレンダリングする */}
        <Outlet />
      </div>

      <Footer />
    </>
  );
};

export default Layout;
