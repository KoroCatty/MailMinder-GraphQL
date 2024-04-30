import { useState } from "react";
import axios from "axios";
import { css } from "@emotion/react";
import { min, max } from "../../../utils/mediaQueries";

import { useMutation, useQuery } from "@apollo/client";
import {
  CREATE_USER_PROFILE_IMAGE_MONGO,
  UPDATE_USER_PROFILE_IMAGE_MONGO,
  DELETE_CLOUDINARY_IMAGE_FILE,
} from "../../../graphql/mutations";
import { GET_LOGGEDIN_USER_DETAILS } from "../../../graphql/queries";
import { GET_USER_IMG_BY_USER_ID } from "../../../graphql/queries";
const settingAvatarStyles = css`
  display: flex;
  justify-content: space-between;
  align-items: center;

  ${min[0] + max[0]} {
    flex-direction: column-reverse;
    margin-bottom: 4rem;
  }

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

    ${min[0] + max[0]} {
      margin: 0 auto;
    }
    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
    &:hover {
      transform: scale(1.2);
      opacity: 0.8;
      transition: all 0.3s ease-in-out;
    }
  }

  img {
    width: 140px;
    height: 140px;
    border-radius: 50%;
  }
`;

const SettingsAvatar = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [createUserProfileImage, { loading: mutationLoading, error }] =
    useMutation(CREATE_USER_PROFILE_IMAGE_MONGO);

  //! ログイン中のユーザー情報を取得
  const { data: userData } = useQuery(GET_LOGGEDIN_USER_DETAILS, {
    fetchPolicy: "cache-and-network",
  });

  //! ユーザーのプロフィール画像を取得
  const { data: userImgData, loading: userImgLoading } = useQuery(
    GET_USER_IMG_BY_USER_ID,
    {
      // ログイン中のユーザーIDを渡し、それを引数にして GraphQLで MongoDB から取得
      variables: { userId: userData?.getLoggedInUserDetails.id }, // ex) userId: 2
      // skip: !isLoggedIn,
      fetchPolicy: "cache-and-network",
    },
  );

  //! ユーザーのプロフィール画像を更新
  const [updateUserProfileImage, { loading: updatingUserImgLoading }] =
    useMutation(UPDATE_USER_PROFILE_IMAGE_MONGO);

  //! ユーザーが画像を選択したとき
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  //! DELETE CLOUDINARY IMAGE FILE
  const [deleteCloudinaryImageFile] = useMutation(DELETE_CLOUDINARY_IMAGE_FILE);

  //! ============================================
  //! REST API(Cloudinary) + GraphQL(MongoDB)
  //! ============================================
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append("img", selectedFile); //! multer の設定した名前と一致させる

    // cloudinary endpoint (defined in server.js)
    const SERVER_URL =
      import.meta.env.VITE_PUBLIC_SERVER_URL || "http://localhost:5001/uploads";

    try {
      //! DELETE it from Cloudinary If there is an existing image,
      if (userImgData?.getUserImgByUserId?.imgCloudinaryId) {
        await deleteCloudinaryImageFile({
          variables: {
            publicId: userImgData.getUserImgByUserId.imgCloudinaryId,
          },
        });
      }

      //! REST API
      const response = await axios.post(SERVER_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // console.log(response.data); // debug

      const { cloudinaryUrl, cloudinary_id } = response.data; // destructuring the response data

      const input = {
        userId: userData.getLoggedInUserDetails.id,
        imgCloudinaryUrl: cloudinaryUrl,
        imgCloudinaryId: cloudinary_id,
      };

      if (!cloudinaryUrl || !cloudinary_id) {
        console.error("Cloudinary URL or ID is missing.");
        return;
      }
      //! GraphQL UPDATE
      // DB 内にすでに画像がある場合、それをupdateする
      if (userImgData?.getUserImgByUserId?.imgCloudinaryUrl) {
        await updateUserProfileImage({
          variables: { input },
        });
        window.alert("Profile image uploaded successfully.");
        window.location.reload();
      } else {
        //! GraphQL CREATE
        //! Save Response data to MongoDB
        await createUserProfileImage({
          variables: { input },
        });
        window.alert("Profile image created successfully.");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error uploading the file:", error);
    } finally {
      setLoading(false);
    }
  };

  if (mutationLoading) return <p>Loading...</p>;
  if (error) return <p>Error occurred: {error.message}</p>;

  return (
    <div css={settingAvatarStyles}>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button type="submit" disabled={loading || updatingUserImgLoading}>
          Save
        </button>
      </form>
      <div>
        {/* 設定中のアイコンを表示 */}
        {userImgLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            {!selectedFile && (
              <img
                src={
                  userImgData
                    ? userImgData.getUserImgByUserId.imgCloudinaryUrl ||
                      "/imgs/noImg.jpeg"
                    : "/imgs/noImg.jpeg"
                }
                onError={(e) => {
                  const imgElement = e.target as HTMLImageElement;
                  if (imgElement) {
                    imgElement.src = "/imgs/noImg.jpeg";
                    // imgElement.src = "./imgs/default_icon.png";
                  }
                }}
                alt="no Image"
              />
            )}
          </>
        )}
        {selectedFile && (
          <img src={URL.createObjectURL(selectedFile)} alt="Selected" />
        )}
      </div>
    </div>
  );
};

export default SettingsAvatar;
