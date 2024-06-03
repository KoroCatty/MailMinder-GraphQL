import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";

// component for layout
import Hero from "../common/Hero";
import ContactHero from "../features/contact/ContactHero";

// Emotion CSS (Responsive Design)
import { css } from "@emotion/react";
// TYPE
type PropsType = {
  isLoggedIn: boolean;
  darkTheme: boolean;
};

const Layout = ({ isLoggedIn, darkTheme }: PropsType) => {
  const location = useLocation();
  // console.log(location.pathname); // ex) /about

  //? Emotion CSS (Responsive Design)
  const LayoutCss = css`
    // when the URL -> /postlist & darkTheme is false
    ${location.pathname === "/postlist" &&
    !darkTheme &&
    ` background-image: url("./imgs/marbleBg.jpg");`}

    // 1201px 以上の場合
    @media screen and (min-width: 1201px) {
      margin-left: 16%; // header の幅分だけ右にずらす
      padding: 0 60px;
    }
  `;
  return (
    <>
      {/* Only Logged in, show Hero */}
      {isLoggedIn && (location.pathname === "/postlist" ? <Hero /> : null)}

      {/* show Hero in those pages  */}
      {location.pathname === "/contact" ? <ContactHero /> : null}
      {/* {location.pathname === "/" ? <Hero isLoggedIn={isLoggedIn} /> : null} */}
      {location.pathname === "/" && !isLoggedIn ? <Hero /> : null}

      <div css={LayoutCss}>
        {/* この Outlet が Layout で囲ってる全てのコンポーネントを監視 Outlet を使い、ネストされたルートをレンダリングする */}
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
