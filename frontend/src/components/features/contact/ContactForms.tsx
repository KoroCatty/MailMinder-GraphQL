import { useRef, useState } from "react";

// color schema
import colorSchema from "../../../utils/colorSchema";

// Emailjs
import emailjs from "@emailjs/browser";

// Validation Zod
import { validationSchema } from "./validationSchema";

// react hook form (these 2 set)
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Emotion sass in component
import { css } from "@emotion/react";
import { min, max } from "../../../utils/mediaQueries";

import Fireworks from "../../common/Fireworks";

const contactFormsCss = css`
  form {
    /* font-family: freight-display-pro, STKaiti, essonnes-display, serif; */
    margin: 0 auto;
    padding: 80px 0;
    width: 90%;
    max-width: 800px;
    border-radius: 20px;

    // 1px〜480px
    ${min[0] + max[0]} {
      width: 90%;
      padding: 40px 0;
    }
    // 481px〜768px
    ${min[1] + max[1]} {
      width: 90%;
    }

    .inputLabel {
      font-size: 1.4rem;
      margin-top: 16px;
      margin-bottom: 8px;
      display: block;
    }

    input {
      height: 40px;
      width: 100%;
      margin: 0.4rem 0 2rem 0;
    }

    textarea {
      width: 100%;
    }

    // input内フォント
    input[type="text"],
    textarea[type="text"] {
      font-size: 1.4rem;
      letter-spacing: 1px;
    }

    button {
      display: block;
      margin: 0 auto;
      width: fit-content;
      background-color: black;
      color: white;
      padding: 20px 40px;
      margin-top: 60px;
      cursor: pointer;
      box-shadow: 2px 1px 10px white;
      font-size: 1.2rem;
      border-radius: 5px;

      &:hover {
        transform: translate(0, 4px);
        transition: 0.6s all ease;
        background-color: ${colorSchema.success};
      }
    }
  }

  // Thanks Message
  h2 {
    text-align: center;
    font-size: 1.8rem !important;
    line-height: 1.4;
  }
`;
//? ====================================================
//? TYPES (各フォームから送られてくるデータの型)
//? ====================================================
type FormDataTypes = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

//! ====================================================
//! Main
//! ====================================================
const ContactForms = () => {
  // HOOKS
  const [showFireworks, setShowFireworks] = useState(false);

  // 全てのフォームの中の情報をobjectで全て取得 (Null も設定しておく)
  const form = useRef<HTMLFormElement | null>(null);
  // console.log(form);

  // 必要なIDをそれぞれ環境変数から取得
  // to use emailjs, you need to set up your own account and get these IDs
  const serviceID = import.meta.env.VITE_PUBLIC_EMAILJS_SERVICE_ID;
  const templateID = import.meta.env.VITE_PUBLIC_EMAILJS_TEMPLATE_ID;
  const userID = import.meta.env.VITE_PUBLIC_EMAILJS_USER_ID;

  //! ====================================================
  //! react-hook-form
  //! ====================================================
  // registerはinputのname属性に設定, handleSubmitはsubmit時に実行する関数, formStateはエラーを出すため
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataTypes>({
    // modeを切り替えて、いつエラー表示を出すのか変更可能
    // you can change when to show error by changing mode
    mode: "onChange",

    // validationSchema は別ファイルで設定
    resolver: zodResolver(validationSchema), // from validationSchema.ts
  });

  //! ====================================================
  //! Form Submit
  //! ====================================================
  const onSubmit = (formsData: FormDataTypes) => {
    console.log(formsData);

    // Emailjsの関数を実行
    sendEmail();
  };

  //! ====================================================
  //! From Emailjs
  //! ====================================================
  const sendEmail = () => {
    // e.preventDefault();

    // formオブジェクト内のcurrentを取ってEmailjsへ送る
    if (form.current) {
      emailjs.sendForm(serviceID, templateID, form.current, userID).then(
        (result) => {
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );

      // フォームを空にする
      // e.target.reset();

      // 成功時のみFireworksコンポーネントを表示
      setShowFireworks(true);

      // Display a Thank you message
      if (form.current) {
        form.current.innerHTML =
          "<h2>Thank You For Your Message! I will contact you ASAP!☺️</h2>";
      }
    } else {
      console.log("form.current is null");
    }
  };

  //! ====================================================
  //! JSX
  //! ====================================================
  return (
    <>
      <section css={contactFormsCss}>
        {/* <form ref={form} onSubmit={sendEmail}> */}

        <form ref={form} onSubmit={handleSubmit(onSubmit)}>
          {/* Name */}
          <label htmlFor="inputName" className="inputLabel">
            Name:
          </label>
          <input
            type="text"
            className="inputNam"
            {...register("name")} // react-hook-form
          />
          {/* this show an error when errors.nam.message is not null  */}
          <p style={{ color: "red", fontSize: "1.2rem" }}>
            {errors.name?.message}
          </p>

          {/* Email */}
          <label htmlFor="inputEmail" className="inputLabel">
            Email:
          </label>
          <input
            type="email"
            className="inputEmail"
            {...register("email")} // react-hook-form
          />
          <p style={{ color: "red", fontSize: "1.2rem" }}>
            {errors.email?.message}
          </p>

          {/* Subject */}
          <label htmlFor="inputSub" className="inputLabel">
            Subject:
          </label>
          <input
            type="text"
            className="inputSub"
            {...register("subject")} // react-hook-form
          />
          <p style={{ color: "red", fontSize: "1.2rem" }}>
            {errors.subject?.message}
          </p>

          {/* Message */}
          <label htmlFor="inputMes" className="inputLabel">
            Message:
          </label>
          <textarea
            {...register("message")} // react-hook-form
          ></textarea>
          <p style={{ color: "red", fontSize: "1.2rem" }}>
            {errors.message?.message}
          </p>

          {/* Submit Button  */}
          <button type="submit">SEND</button>
        </form>

        {/* Fireworks COMPONENT */}
        {showFireworks && <Fireworks />}
      </section>
    </>
  );
};

export default ContactForms;
