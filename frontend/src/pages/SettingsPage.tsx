// component:
import SettingsForms from "../components/features/settings/SettingsForms"
import EmailToggle from "../components/features/settings/EmailToggle"
import SettingsAvatar from "../components/features/settings/SettingsAvatar"

// Emotion CSS (Responsive Design)
import { css } from "@emotion/react";
import { min, max } from "../utils/mediaQueries";
const settingPageCss = css`
  position: relative;
  /* height: 80vh; */
  

  &:before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-image: url("./imgs/settingBg.png");
    opacity: 0.08;
    z-index: -1;  
    background-size: cover;
    background-position: center;
  }
  
    // 1px〜479px
    ${min[0] + max[0]} {
      height: auto;
    }
    // 480px〜767px
    ${min[1] + max[1]} {
      height: auto;
    }
    // 768px〜989px
    ${min[2] + max[2]} {
    }
    // 990px〜
    ${min[3] + max[3]} {
    }
`;


// bootstrap
import { Container } from "react-bootstrap"

const Settings = () => {
  return (
    <main css={settingPageCss}>
      <Container>
        <h1 className="text-center">Settings (Coming Soon)</h1>
        <SettingsForms />
        <EmailToggle />
        <SettingsAvatar />
      </Container>
    </main>
  )
}

export default Settings