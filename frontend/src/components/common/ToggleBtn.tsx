import React, { useState, useEffect } from "react";

import { UPDATE_EMAIL_SEND_STATUS } from "../../graphql/mutations";
import { GET_LOGGEDIN_USER_DETAILS } from "../../graphql/queries";
import { useMutation, useQuery } from "@apollo/client";

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
    background: rgba(60, 60, 60, 0.6);
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
    margin-left: 10px;
    font-size: 1.8rem;
    letter-spacing: 1px;
  }
`;

// types
interface ToggleSwitchProps {
  id: string;
  initial?: boolean;
}

const ToggleBtn: React.FC<ToggleSwitchProps> = ({ id, initial = false }) => {
  const [checked, setChecked] = useState(initial);
  const [updateEmailSendStatus, { loading: toggleLoading }] = useMutation(
    UPDATE_EMAIL_SEND_STATUS,
  );

  //! ログイン中のユーザー情報を取得
  const { data: userData } = useQuery(GET_LOGGEDIN_USER_DETAILS, {
    fetchPolicy: "cache-and-network",
  });
  // console.log(userData?.getLoggedInUserDetails.emailSend); // true / false

  useEffect(() => {
    if (userData) {
      setChecked(userData.getLoggedInUserDetails.emailSend);
    }
  }, [userData]);

  //! When toggled
  const handleToggle = async () => {
    const newChecked = !checked;
    setChecked(newChecked);
    try {
      await updateEmailSendStatus({
        variables: {
          emailSend: newChecked, // true or false
          userId: userData.getLoggedInUserDetails.id, // mutation にuserId を渡す
        },
      });
      window.alert(
        `Email notifications have been ${newChecked ? "turned on" : "turned off"}.`,
      );
    } catch (error) {
      console.log(error);
      window.alert("Failed to update email notification settings😞");
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
        disabled={toggleLoading}
      />
      <label htmlFor={id} className="toggleButton_label"></label>
      <span className="onOff">{checked ? "ON" : "OFF"}</span>
    </label>
  );
};

export default ToggleBtn;
