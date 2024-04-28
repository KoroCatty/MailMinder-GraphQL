import { useState } from "react";
import axios from "axios";
import { css } from "@emotion/react";
import { min, max } from "../../../utils/mediaQueries";
import { useMutation } from "@apollo/client";
import { CREATE_USER_PROFILE_IMAGE_MONGO } from "../../../graphql/mutations";

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

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
      const response = await axios.post(SERVER_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(response.data);

      const { cloudinaryUrl, cloudinary_id } = response.data;
      if (!cloudinaryUrl || !cloudinary_id) {
        console.error("Cloudinary URL or ID is missing.");
      } else {
        // Save MongoDB
        await createUserProfileImage({
          variables: {
            userId: "11",
            imgCloudinaryUrl: cloudinaryUrl,
            imgCloudinaryId: cloudinary_id,
          },
        });
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
        <button type="submit" disabled={loading}>
          Save
        </button>
      </form>
      <div>
        {!selectedFile && <img src="/imgs/noImg.jpeg" alt="no Image" />}
        {selectedFile && (
          <img src={URL.createObjectURL(selectedFile)} alt="Selected" />
        )}
      </div>
    </div>
  );
};

export default SettingsAvatar;
