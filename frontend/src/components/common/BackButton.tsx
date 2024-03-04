import { useNavigate } from 'react-router-dom';

// Emotion
import { css } from '@emotion/react';
const BackButtonStyle = css`
    button {
    margin: 20px 0;
    padding: 10px 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #fff;
    cursor: pointer;
    text-align: start;
    text-align: left;
    display: inline;
  }
`;

// TYPES (from NotFound.tsx)
type BackButtonProps = {
  classNameProp?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ classNameProp }) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    navigate(-1);
  };

  return (
    <div css={BackButtonStyle} className={`backButton ${classNameProp}`}>
      <button onClick={handleGoBack}>Go Back</button>
    </div>
  );
}

export default BackButton;

