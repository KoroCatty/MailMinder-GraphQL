//! GLOBAL STYLE CSS

// components
import colorSchema from "../../utils/colorSchema";

// Emotion CSS GLOBAL
import { Global, css } from "@emotion/react";
const globalCss = css`
  body {
    background-color: ${colorSchema.dark};
    color: white;
  }
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: white !important;
  }

  a {
    color: white !important;
  }

  p {
    color: white !important;
  }

  img {
    filter: brightness(0.8);
  }

  input {
    filter: brightness(0.8);
  }

  textarea {
    filter: brightness(0.8);
  }

  // CAMERA BUTTON
  .openBtn {
    border: 1px solid white !important;
    border-color: white !important;
    color: white !important;
  }

  // left side menu
  .navbar {
    background-color: ${colorSchema.darkLight} !important;
    box-shadow: 0 4px 4px rgba(186, 186, 186, 0.5) !important;
  }

  // Hamburger Button
  .navbar-toggler {
    color: ${colorSchema.lightDark} !important;
    border-color: ${colorSchema.lightDark} !important;
    background-color: ${colorSchema.lightDark} !important;

    span {
      color: ${colorSchema.lightDark} !important;
      border-color: ${colorSchema.lightDark} !important;
    }
  }

  // Recent Card
  .card-title,
  .card-text {
    color: ${colorSchema.lightDark} !important;
  }

  // Big Submit Button
  .submitBtn {
    background-color: ${colorSchema.danger} !important;
  }

  // Post card
  .card {
    background-color: ${colorSchema.darkLight} !important;
    box-shadow: 1px 2px 4px rgba(186, 186, 186, 0.2) !important;

    p {
      color: ${colorSchema.fontLight} !important;
    }
  }

  time {
    color: ${colorSchema.fontLight} !important;
    opacity: 0.8;
  }

  // Not Found Page
  .notFoundBackBtn {
    background-color: ${colorSchema.dark} !important;
    box-shadow: 0 0 12px rgba(255, 255, 255, 1) !important;
    
    &:hover {
      color: ${colorSchema.danger} !important;
      box-shadow: none !important;
      transition: all 0.3s ease;
    }
  }

  // Pagination
  .pagination-ellipsis {
    color: ${colorSchema.fontLight} !important;
  }

  .pagination-link {
    &.is-current {
      background-color: #c84343 !important;
      color: #f1f1f1 !important;
    }
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
