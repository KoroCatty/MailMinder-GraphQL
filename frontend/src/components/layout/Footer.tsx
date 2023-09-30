
// Emotion
import { css } from '@emotion/react'

const footerStyles = css`
  background-color: #fff;
  color: #333;
  padding: 20px 0;
  text-align: center;
  font-size: 0.8rem;
  margin-top: 20px;
  border-top: 1px solid #ddd;

`;

function Footer() {
  return (
    <footer css={footerStyles} >

        <div>&copy; 2023 K-Dev</div>

    </footer>
  )
}


export default Footer