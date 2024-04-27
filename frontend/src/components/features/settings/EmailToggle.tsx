// Emotion
import { css } from "@emotion/react";
import ToggleBtn from "../../common/ToggleBtn";
const toggleSwitch = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 60px 0;
  border-bottom: 01px solid #8b8b8b;
`;

// types
interface ToggleSwitchProps {
  initial?: boolean;
  onChange?: (checked: boolean) => void;
}

const EmailToggle: React.FC<ToggleSwitchProps> = () => {
  return (
    <section css={toggleSwitch}>
      <h2>Stop Sending Emails</h2>

      {/* Toggle button component */}
      <ToggleBtn id="toggleEmailStop" />
    </section>
  );
};

export default EmailToggle;
