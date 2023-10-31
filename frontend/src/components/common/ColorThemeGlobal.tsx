// components
import colorSchema from "../../utils/colorSchema";

// Emotion CSS GLOBAL
import { Global, css } from "@emotion/react";
const globalCss = css`
  body {
    background-color: #242424 ;
    color: white;
  }
  h2, h3, h4, h5, h6 {
    color: white !important;
  }

  a {
    color: white !important;
  }

  button {
    /* background-color: white !important ; */
    /* color: black !important;
    border: 1px solid white ;
    border-color: white ;
    border-radius: 5px ;
    padding: 5px 10px ;
    font-size: 1.2em ;
    cursor: pointer ; */
  }

  p {
    color: white !important;
  }

  .openBtn {
    border: 1px solid white !important;
    border-color: white !important;
    color: white !important;
  }

  img {
    filter: brightness(0.8);
  }

.navbar {
  background-color: #242424 !important;
}
`;

function ColorThemeGlobal() {



  return (
    <>
      <Global styles={globalCss} />
    </>
  );
}
export default ColorThemeGlobal;