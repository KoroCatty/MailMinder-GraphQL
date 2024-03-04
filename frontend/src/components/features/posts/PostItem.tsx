import { useMutation } from "@apollo/client";
import { Link } from "react-router-dom";

// color schema
import colorSchema from "../../../utils/colorSchema";

// queries & mutations
import { DELETE_POST_BY_ID } from "../../../graphql/mutations";
import { DELETE_CLOUDINARY_IMAGE_FILE } from "../../../graphql/mutations";

// Emotion CSS (Responsive Design)
import { css } from "@emotion/react";
const postItemCss = css`
  .card {
    border: none;
    box-shadow: 1px 2px 2px rgba(0, 0, 0, 0.2);
    background-color: transparent;
    transition: all 0.3s ease-in-out;
    min-height: 100%;
    max-height: 100%;

    img {
      width: 100%;
      min-height: 160px;
      max-height: 160px;
      border-radius: 0.3rem 0.3rem 0 0;
    }

    &-body {
      padding: 0.8rem 0.6rem;
    }

    &-title {
      font-size: 1.1rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      line-height: 1.3;
    }

    &-content {
      font-size: 1rem;
      line-height: 1.3;
      overflow-wrap: break-word;
      max-height: 60px;
    }
  }

  time {
    font-size: 0.8rem;
    color: rgba(0, 0, 0, 0.5);
    margin: 0.6rem 0;
    display: block;
  }

  // BUTTONS
  button {
    display: block;
    width: 100%;
  }

.deleteBtn {
  background-color: ${colorSchema.darkLight};
  color: white;
  margin-bottom: 0.5rem;
}
`;

// TYPES
export type PostPropType = {
  id: string | number;
  title: string;
  content: string;
  imgUrl: string;
  imgCloudinaryUrl: string;
  imgCloudinaryId: string;
  createdAt: string;
};

type PostPropTypeComponent = {
  postProp: PostPropType;
};

const PostCard: React.FC<PostPropTypeComponent> = ({ postProp }) => {
  // DELETE CLOUDINARY IMAGE FILE
  const [deleteCloudinaryImageFile] = useMutation(DELETE_CLOUDINARY_IMAGE_FILE);

  // CLOUDINARY 画像を削除するための関数
  const handleCloudinary_deleteImg = (publicId: string) => {
    deleteCloudinaryImageFile({ variables: { publicId } });
  };

  //! DELETE POST MUTATION
  // `useMutation` フックを使用して、投稿の削除を行うmutationをセットアップ
  const [deletePostById, { error, loading }] = useMutation(DELETE_POST_BY_ID, {
    // 削除する投稿のIDを変数としてセット
    variables: { id: postProp.id },
    awaitRefetchQueries: true, // mutationが完了するのを待ってから、refetchQueriesを実行

    // キャッシュを更新するための関数
    update(cache, { data: { deletePost } }) {
      // キャッシュの中の特定のフィールドを変更
      cache.modify({
        fields: {
          // `PostsByUser` フィールドを変更
          PostsByUser(existingPostsByUser = []) {
            // 削除した投稿をキャッシュから削除
            cache.evict({ id: cache.identify(deletePost) });
            // 削除した投稿を除外して、更新後の投稿リストを返す
            return existingPostsByUser.items.filter(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (postRef: any) => postRef.__ref !== deletePost.__ref
            );
          },
        },
      });
    },
  });

  if (error) {
    window.alert(error.message);
  }

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div css={postItemCss}>
      <Link to={`/postdetails/${postProp.id}`} className="card">
        <img
          src={postProp.imgUrl}
          onError={(e) => {
            const imgElement = e.target as HTMLImageElement;
            if (imgElement.src !== postProp.imgCloudinaryUrl) {
              imgElement.src = postProp.imgCloudinaryUrl;
            }
          }}
        />
      </Link>

      <div className="card-body">
        <h5 className="card-title">
          {postProp.title.length > 20
            ? postProp.title.slice(0, 20) + "..."
            : postProp.title}
        </h5>
        {/* 40文字まで、改行を削除 */}
        <p className="card-content">
          {postProp.content.replace(/\n/g, '').length > 40
            ? postProp.content.replace(/\n/g, '').slice(0, 40).trim() + "..."
            : postProp.content.replace(/\n/g, '').trim()}
        </p>

        <time>{new Date(postProp.createdAt).toLocaleString()}</time>

        {/* EDIT BUTTON */}
        <Link
          to={`/editpost/${postProp.id}`}
          onClick={() => {
            scrollTop();
          }}
        >
          <button className="deleteBtn btn btn-sm" style={{ width: "100%" }}>
            Edit
          </button>
        </Link>

        {/*//! DELETE BUTTON */}
        <button
          className="btn btn-danger btn-sm"
          onClick={(e) => {
            e.preventDefault();
            window.confirm("Are you sure you want to delete this post?") &&
              deletePostById();

            //! Delete Cloudinary Image File that much with Post ID
            handleCloudinary_deleteImg(postProp.imgCloudinaryId);
          }}
        >
          {loading ? "Deleting..." : "Delete"}
        </button>
      </div>
      {error && <p>Error! {error.message}</p>}
    </div>
  );
};

export default PostCard;
