import React, { useState } from "react";

// Emotion
import { css } from "@emotion/react";
const toggleSwitch = css`
  margin: 60px 0;

  .toggleButton_input {
    position: absolute;
    z-index: -10;
    opacity: 0;

    :checked + .toggleButton_label {
      background: blue;
    }
    :checked + .toggleButton_label:after {
      left: 3px;
    }
  }

  .toggleButton_label {
    position: relative;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    display: inline-block;
    width: 80px;
    height: 40px;
    cursor: pointer;
    background: red;
    border-radius: 20px;
    -webkit-transition: 0.3s;
    transition: 0.3s;

    :after {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 43px;
      z-index: 2;
      width: 34px;
      height: 34px;
      margin: auto;
      cursor: pointer;
      content: "";
      background: white;
      border-radius: 100%;
      -webkit-transition: 0.3s;
      transition: 0.3s;
    }
  }

  .onOff {
    user-select: none; /* 標準のブラウザ */
    -webkit-user-select: none; /* Safari */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
  }
`;

// types
interface ToggleSwitchProps {
  id: string;
  initial?: boolean;
  onChange?: (checked: boolean) => void;
}

const ToggleBtn: React.FC<ToggleSwitchProps> = ({
  id,
  initial = false,
  onChange,
}) => {
  const [checked, setChecked] = useState(initial);

  const handleToggle = () => {
    const newChecked = !checked;
    setChecked(newChecked);

    if (onChange) {
      onChange(newChecked);
    }
  };
  return (
    <label css={toggleSwitch}>
      <input
        id={id}
        onChange={handleToggle}
        className="toggleButton_input"
        type="checkbox"
        checked={checked}
      />
      <label htmlFor={id} className="toggleButton_label"></label>

      <span className="onOff">{checked ? "On" : "Off"}</span>
    </label>
  );
};

export default ToggleBtn;
