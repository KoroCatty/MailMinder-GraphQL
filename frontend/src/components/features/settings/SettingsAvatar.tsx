import { useState } from "react";

// Emotion
import { css } from "@emotion/react";
import { min, max } from "../../../utils/mediaQueries";

const settingAvatarStyles = css`
  display: flex;
  /* text-align: center; */
  justify-content: space-between;
  align-items: center;

  // 1px〜479px
  ${min[0] + max[0]} {
    flex-direction: column-reverse;
    margin-bottom: 4rem;
  }

  // 480px〜767px
  ${min[1] + max[1]} {
    flex-direction: column-reverse;
    margin-bottom: 4rem;
  }

  input {
    display: block;
    padding: 10px 20px;
    margin: 32px 0;
    color: black;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #fff;
    cursor: pointer;
  }
  button {
    display: block;
    padding: 10px 20px;
    margin: 32px 0;
    color: black;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #fff;
    cursor: pointer;

    // 1px〜479px
    ${min[0] + max[0]} {
      margin: 0 auto;
    }
  }

  img {
    width: 140px;
    height: 140px;
    border-radius: 50%;
  }
`;

const SettingsAvatar = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  //* 画像を選択した時に発火する関数
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // <input type="file">から選択されたファイルのリストを提供するFileListオブジェクトを返し、[0]は選択されたファイルのリストの最初のファイルを指し、あれば返す
    const file = e.target.files && e.target.files[0];
    if (file) {
      // URL.createObjectURL(file)は、選択されたファイルのURLを生成。このURLは、<img>タグなどのsrc属性でファイルを直接参照するために使用できます。
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  //! CREATE A USER PROFILE IMAGE
  // const logout = async () => {
  //   try {
  //     const { data } = await client.mutate({ mutation: LOGOUT_MUTATION });
  //     if (data.logout) {
  //       setIsLoggedIn(false); // Update the state
  //       navigate("/login");
  //     }
  //   } catch (error) {
  //     console.error("ログアウト中にエラーが発生しました:", error);
  //   }
  // };

  return (
    <div css={settingAvatarStyles}>
      <form>
        {/* accept="image/*" は、画像ファイルのみを選択できるようにするためのもの */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className=""
        />
        {/* Button */}
        <button type="submit" className="">
          SAVE
        </button>
      </form>

      {/* 画像があれば表示 */}
      <div className="">
        {!selectedImage && <img src="/imgs/noImg.jpeg" alt="no Image" />}
        {selectedImage && <img src={selectedImage} alt="chosen Image" />}
      </div>
    </div>
  );
};

export default SettingsAvatar;
