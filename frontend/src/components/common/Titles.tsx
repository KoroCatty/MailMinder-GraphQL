// Emotion CSS (Responsive Design)
import { css } from "@emotion/react";
import { min, max } from "../../utils/mediaQueries";

// TYPE
type TitlePropType = {
  title: string;
  className?: string;
};

//? Emotion CSS (Responsive Design)
const titleSmallCss = css`
  //! =================================================
  //! SMALL
  //! =================================================
  padding: 0.8rem 1.1rem;
  border-left: 4px solid #6d6d6d;
  font-size: 1.5rem;
  margin-bottom: 4rem;
  color: #434343;
  letter-spacing: 0.1rem;

  // 1px〜479px
  ${min[0] + max[0]} {
    font-size: 1.2rem;
    margin-bottom: 2rem;
  }
  // 480px〜767px
  ${min[1] + max[1]} {
    font-size: 1.4rem;
    margin-bottom: 3.5rem;
  }
  // 768px〜989px
  ${min[2] + max[2]} {
  }
  // 990px〜
  ${min[3] + max[3]} {
  }
`;

//! =================================================
//! Medium
//! =================================================
const titleMediumCss = css`
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
//! =================================================
//! Large
//! =================================================
const titleLargeCss = css`
  font-size: 2.5rem;
  margin: 3rem auto 2rem auto;
  text-align: center;
  width: fit-content;
  letter-spacing: 0.1rem;

  position: relative;
  display: block;
  padding: 0 80px;

  :before {
    left: 0;
  }
  :after {
    right: 0;
  }

  // 1px〜479px
  ${min[0] + max[0]} {
    margin: 40px auto 2rem auto;
    font-size: 1.4rem;
    padding: 0 4rem;
  }
  // 480px〜767px
  ${min[1] + max[1]} {
    margin: 0 auto 2rem auto;
    font-size: 2rem;
    padding: 0 4rem;
  }
  // 768px〜989px
  ${min[2] + max[2]} {
  }
  // 990px〜
  ${min[3] + max[3]} {
  }
`;

export const TitleSmall = ({ title, className }: TitlePropType) => {
  return (
    <h2 className={className} css={titleSmallCss}>
      {title}
    </h2>
  );
};

export const TitleMedium = ({ title }: TitlePropType) => {
  return <h2 css={titleMediumCss}>{title}</h2>;
};

export const TitleLarge = ({ title }: TitlePropType) => {
  return <h2 css={titleLargeCss}>{title}</h2>;
};
