import { useRef, useEffect } from "react";
import { css } from "@emotion/react";
import { min, max } from "../../utils/mediaQueries";

// TYPE
type Props = {
  children: React.ReactNode;
  type: "button" | "submit" | "reset" | undefined;
  className? : string;
};

// Emotion CSS (Responsive Design)
const commonBtnCss = css`
    background-color: rgba(0, 0, 0, 0.9);
    color: #ffffff;
    text-shadow: 1px 1px 6px black;
    font-size: 1.2rem;
    letter-spacing: 1px;
    border: 1px solid #4d4d4d;
    padding: 16px 20px;
    width: 40%;
    transition: all 0.3s ease-in-out;
    border-radius: 4px;
  

  // 1 px 〜 479 px
  ${min[0] + max[0]} {
  }
  // 480 px 〜 767 px
  ${min[1] + max[1]} {
  }
  // 768 px 〜 989 px
  ${min[2] + max[2]} {
  }
  // 990 px 〜
  ${min[3] + max[3]} {
  }
`;
//! ===============================================================
//! Regular
//! ===============================================================
export const CommonBtn: React.FC<Props> = ({ children, className }) => {
  //HOOKS
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const button = buttonRef.current; // DOM にアクセス
    // console.log(button) // <button>Sign Up</button>

    if (!button) return; // Do nothing

    // Mouse Move Event
    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect(); // DOM の位置を取得

      // マウスの位置を取得
      const x = ((e.clientX - rect.left) / button.clientWidth) * 100;
      const y = ((e.clientY - rect.top) / button.clientHeight) * 100;
      button.style.background = `radial-gradient(circle closest-corner 
        at ${x}% ${y}%,
        #f2f2f2, rgba(18, 18, 18, 0.8))`;
    };

    // Mouse Leave Event
    const handleMouseLeave = () => {
      button.style.removeProperty("background");
    };

    // Add Event Listener
    button.addEventListener("mousemove", handleMouseMove);
    button.addEventListener("mouseleave", handleMouseLeave);

    // Cleanup on unmount (by Returning a Function)
    return () => {
      button.removeEventListener("mousemove", handleMouseMove);
      button.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (

      <button className={className} ref={buttonRef} css={commonBtnCss}>{children}</button>

  );
};


//! ===============================================================
//! Large
//! ===============================================================
// export const CommonBtnLarge: React.FC<Props> = ({ children, className }) => {
//   //HOOKS
//   const buttonRef = useRef<HTMLButtonElement | null>(null);

//   useEffect(() => {
//     const button = buttonRef.current; // DOM にアクセス
//     // console.log(button) // <button>Sign Up</button>

//     if (!button) return; // Do nothing

//     // Mouse Move Event
//     const handleMouseMove = (e: MouseEvent) => {
//       const rect = button.getBoundingClientRect(); // DOM の位置を取得

//       // マウスの位置を取得
//       const x = ((e.clientX - rect.left) / button.clientWidth) * 100;
//       const y = ((e.clientY - rect.top) / button.clientHeight) * 100;
//       button.style.background = `radial-gradient(circle closest-corner 
//         at ${x}% ${y}%,
//         #f2f2f2, rgba(18, 18, 18, 0.8))`;
//     };

//     // Mouse Leave Event
//     const handleMouseLeave = () => {
//       button.style.removeProperty("background");
//     };

//     // Add Event Listener
//     button.addEventListener("mousemove", handleMouseMove);
//     button.addEventListener("mouseleave", handleMouseLeave);

//     // Cleanup on unmount (by Returning a Function)
//     return () => {
//       button.removeEventListener("mousemove", handleMouseMove);
//       button.removeEventListener("mouseleave", handleMouseLeave);
//     };
//   }, []);

//   return (

//       <button className={className} ref={buttonRef} css={commonBtnCss}>{children}</button>

//   );
// };


