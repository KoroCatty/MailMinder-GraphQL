import cloudinary from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// プリズマクライエントのインスタンスを格納
import { PrismaClient } from "../../prisma/generated/client/index.js";
const prisma = new PrismaClient();

// MongoDB モデル
import Image from "../mongo/mongodb.js";

const queries = {
  Query: {
    //! -----------------------------------------------
    //! MongoDB - GET USER IMAGE
    //! -----------------------------------------------
    getUserImgByUserId: async (_, args, context) => {
      // ログイン確認
      if (!context.userId) throw Error("You must be logged in 😱");

      // MongoDBからユーザーの画像情報を取得
      try {
        const image = await Image.findOne({ userId: String(args.userId) });

        if (!image) {
          // throw new Error("No image found for this user😅");
          return {
            imageUrl: "/imgs/default_icon.png",
          };
        }
        return image;
      } catch (error) {
        console.error("Error fetching image from MongoDB:", error);
        throw new Error("Failed to retrieve image.");
      }
    },

    //* -----------------------------------------------
    //* CHECK LOGIN STATUS
    //* -----------------------------------------------
    isLoggedIn: (_, args, context) => {
      return Boolean(context.userId); // httpOnly で取得したトークンがあるかどうか
    },

    //* -----------------------------------------------
    //* GET LOGGED IN USER INFO
    //* -----------------------------------------------
    getLoggedInUserDetails: async (_, args, context) => {
      // forbidden error means you are not allowed to do this
      if (!context.userId) throw Error("You must be logged in 😱");

      // 自分の情報を取得
      const LoggedInUser = await prisma.user.findUnique({
        where: {
          id: context.userId,
        },
      });
      return LoggedInUser;
    },

    //* -----------------------------------------------
    //* GET ALL USERS
    //* -----------------------------------------------
    // context は server.js で定義済みで、ログインしていると、そのユーザーの情報が入っている
    users: async (_, args, context) => {
      // forbidden error means you are not allowed to do this
      if (!context.userId) throw Error("You must be logged in 😱");

      // 自分以外のユーザーを全て取得
      const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" }, // 新しい順に並べる
        where: {
          id: {
            not: context.userId, // 自分以外のユーザーを取得
          },
        },
      });
      return users;
    },

    //* -----------------------------------------------
    //* GET ALL POSTS BY USER ID
    //* -----------------------------------------------
    PostsByUser: async (_, args, context) => {
      // Error means you are not allowed to do this
      if (!context.userId) throw Error("You must be logged in 😱");
      // 自分の投稿を全て取得 (postはPostモデル in typeDefs.js)
      const posts = await prisma.post.findMany({
        take: args.first, // 取得する投稿の数
        skip: args.skip, // スキップする投稿の数
        totalCount: args.totalCount, // 全ての投稿の数
        orderBy: { updatedAt: "desc" }, // 更新された順（または新しく作成された順）に並べる
        where: {
          userId: context.userId, // 自分の投稿を取得(ログイン者)
        },
      });

      // 全投稿数をDBから取得
      const totalCount = await prisma.post.count({
        where: { userId: context.userId },
      });
      return {
        items: posts,
        totalCount: totalCount,
      };
    },

    //* -----------------------------------------------
    //* GET ALL POSTS BY USER ID LIMIT 4
    //* -----------------------------------------------
    PostsByUserLimit: async (_, args, context) => {
      // Error means you are not allowed to do this
      if (!context.userId) throw Error("You must be logged in 😱");

      // 自分の投稿を全て取得 (postはPostモデル in typeDefs.js)
      const posts = await prisma.post.findMany({
        orderBy: { updatedAt: "desc" }, // 更新された順（または新しく作成された順）に並べる
        where: {
          userId: context.userId, // 自分の投稿を取得(ログイン者)
        },
        take: args.limit, // limitの適用
      });
      return posts;
    },
  },
};

export default queries;
