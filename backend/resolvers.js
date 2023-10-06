// プリズマのクライアントをインポート
import PC from '@prisma/client';

import bcrypt from 'bcryptjs';

import jwt from 'jsonwebtoken';

import fs from 'fs'; // file system module (built-in) これは、ファイルを読み書きするためのモジュール

// プリズマクライエントのインスタンスを格納
const prisma = new PC.PrismaClient();

//! ==========================================================
//! Resolvers (what do you wanna resolve? query? mutation?)
//! ==========================================================
const resolvers = {
  Query: {
    //* -----------------------------------------------
    //* GET ALL USERS
    //* -----------------------------------------------
    // context は server.js で定義済みで、ログインしていると、そのユーザーの情報が入っている
    users: async (_, args, context) => {
      console.log(context.userId + "🥶🐴")
      console.log(context)

      // forbidden error means you are not allowed to do this
      if (!context.userId) throw Error("You must be logged in 😱")

      // 自分以外のユーザーを全て取得
      const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" }, // 新しい順に並べる
        where: {
          id: {
            not: context.userId
          }
        },  // 自分以外のユーザーを取得
      });
      return users;
    },

    //* -----------------------------------------------
    //* GET ALL POSTS BY USER ID
    //* -----------------------------------------------
    PostsByUser: async (_, args, context) => {
      console.log(context.userId + "🥶🐣") // ログイン者のID
      console.log(context)

      // Error means you are not allowed to do this
      if (!context.userId) throw Error("You must be logged in 😱")

      // 自分の投稿を全て取得 (postはPostモデル in typeDefs.js)
      const posts = await prisma.post.findMany({
        orderBy: { updatedAt: "desc" }, // 更新された順（または新しく作成された順）に並べる
        where: {
          userId: context.userId // 自分の投稿を取得(ログイン者)
        },
      });
      return posts;
    },


    //* -----------------------------------------------
    //* GET ALL POSTS BY USER ID LIMIT 4
    //* -----------------------------------------------
    PostsByUserLimit: async (_, args, context) => {
      console.log(context.userId + "🥶") // ログイン者のID
      console.log(context)
      console.log(args.limit + "🥶👀")

      // Error means you are not allowed to do this
      if (!context.userId) throw Error("You must be logged in 😱")

      // 自分の投稿を全て取得 (postはPostモデル in typeDefs.js)
      const posts = await prisma.post.findMany({
        orderBy: { updatedAt: "desc" }, // 更新された順（または新しく作成された順）に並べる
        where: {
          userId: context.userId // 自分の投稿を取得(ログイン者)
        },
        take: args.limit, // 追加: limitの適用 
      });
      return posts;
    },

  },



  Mutation: {
    //* ===============================================
    //* CREATE USER
    //* ===============================================
    signupUser: async (_, args) => {
      await console.log(args.userNew);// typeDefsで定義済み

      // email が重複してないかチェック (args~は front から送られてきたデータ)
      // user は prisma.schema で定義済みのモデル
      const user = await prisma.user.findUnique({ where: { email: args.userNew.email } });

      if (user) {
        throw new Error("Email already exists😂");
      }

      // パスワードをハッシュ化
      const hashedPassword = await bcrypt.hash(args.userNew.password, 10)

      // Save to DB (Promise で 返ってくるので,await 忘れない!)
      const newHashedUser = await prisma.user.create({
        data: {
          ...args.userNew, // shallow copy 
          password: hashedPassword, // ハッシュ化したパスワードを追加
        }
      });
      return newHashedUser;
    },

    //* ===============================================
    //* Sign in USER (Login)
    //* ===============================================
    signinUser: async (_, args) => {
      // console.log(args.userSignin.email + "😁");// typeDefsで定義済み

      // email が重複してないかチェック (args~は front から送られてきたデータ)
      const user = await prisma.user.findUnique({ where: { email: args.userSignin.email } });

      // ユーザーが存在しない場合
      if (!user) {
        throw new Error("Email does not exist🫡");
      }
      // DB内のhash化されたパスと, 入力されたパスを比較 (Promiseで返却)
      await bcrypt.compare(args.userSignin.password, user.password, (err, res) => {
        if (res) {
          console.log("Login success👍");
        }
      });

      // Generate token out of this user.id 
      // 第一にはトークンに入れたいデータ, 第二にはシークレットキー, 第三にはオプション
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '3h' });
      console.log(token + " 🤬Tokenを作りました🤬");
      return { token: token };
    },

    //* ===============================================
    //* CREATE A POST
    //* ===============================================
    createPost: async (_, args, context) => {
      console.log(args.postNew.title + "😈")
      console.log(args.postNew.content + "🤫")
      console.log(args.postNew.imgUrl + "👹")
      console.log(context.userId + "👹")

      console.log(args.postNew.imgFile + "💀👻");

      // ログインしてなかったらエラー(contextで先に確認できる)
      if (!context.userId) {
        throw new Error("You must be logged in (Contextにトークンがありません)😱");
      }

      // ファイルをサーバーに保存
      // const { createReadStream, filename } = await args.postNew.imgFile;
      // const pathToSave = join(process.cwd(), 'uploads', filename);
      // const stream = createReadStream();

      // await new Promise((resolve, reject) => {
      //   stream.pipe(createWriteStream(pathToSave))
      //     .on('finish', resolve)
      //     .on('error', reject);
      // });

      //! save to DB
      // post は prisma.schema で定義済みのモデル
      const newPost = await prisma.post.create({
        data: {
          title: args.postNew.title,
          content: args.postNew.content,
          // imgUrl: args.postNew.imgUrl,
          imgUrl: args.postNew.imgUrl ? args.postNew.imgUrl : "/imgs/noImg.jpeg",  // <-- default image added
          userId: context.userId
        }
      })
      return newPost;
    },

    //* ===============================================
    //* DELETE A POST
    //* ===============================================
    deletePost: async (_, args, context) => {
      console.log(args.id + "🦋")
      console.log(context.userId + "🐝")

      // ログインしてなかったらエラー(contextで先に確認できる)
      if (!context.userId) {
        throw new Error("You must be logged in (Contextにトークンがありません)😱");
      }

      // post は prisma.schema で定義済みのモデル
      const deletedPost = await prisma.post.delete({
        where: {
          id: parseInt(args.id)
        }
      });
      return deletedPost;
    },

    //* ===============================================
    //* UPDATE A POST
    //* ===============================================
    updatePost: async (_, args, context) => {
      console.log(args.id + "🦋")
      console.log(args.postUpdate.title + "🐝 - UPDATED -")
      console.log(args.postUpdate.content + "🐝")
      console.log(args.postUpdate.imgUrl + "🐝")
      console.log(context.userId + "🐝")

      // ログインしてなかったらエラー(contextで先に確認できる)
      if (!context.userId) {
        throw new Error("You must be logged in (Contextにトークンがありません)😱");
      }

      // post は prisma.schema で定義済みのモデル
      const updatedPost = await prisma.post.update({
        where: {
          id: parseInt(args.id)
        },
        data: {
          title: args.postUpdate.title,
          content: args.postUpdate.content,
          imgUrl: args.postUpdate.imgUrl,
          updatedAt: new Date().toISOString(), // 更新日時を追加
        }
      });
      return updatedPost;
    },

  }
}

export default resolvers;