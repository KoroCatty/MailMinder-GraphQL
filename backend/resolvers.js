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
      console.log(context.userId + "🥶")
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
      console.log(context.userId + "🥶") // ログイン者のID
      console.log(context)

      // Error means you are not allowed to do this
      if (!context.userId) throw Error("You must be logged in 😱")

      // 自分の投稿を全て取得 (postはPostモデル in typeDefs.js)
      const posts = await prisma.post.findMany({
        orderBy: { createdAt: "desc" }, // 新しい順に並べる
        where: {
          userId: context.userId // 自分の投稿を取得(ログイン者)
        },
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

      // ログインしてなかったらエラー(contextで先に確認できる)
      if (!context.userId) {
        throw new Error("You must be logged in (Contextにトークンがありません)😱");
      }

      //! save to DB
      // post は prisma.schema で定義済みのモデル
      const newPost = await prisma.post.create({
        data: {
          title: args.postNew.title,
          content: args.postNew.content,
          imgUrl: args.postNew.imgUrl,
          userId: context.userId
        }
      })
      return newPost;
    },

    //* ===============================================
    //! UPLOAD IMAGE FILE
    //* ===============================================
    uploadFile: async (_, { file }) => {
      // ファイル情報をコンソールに表示
      console.log(file + "👹");
      console.log(file.filename + "👹");
      console.log(file.mimetype + "👹");
      console.log(file.encoding + "👹");
      console.log(file.createReadStream + "👹");

      // 提供されたファイルから読み取りストリームと他の情報を取得
      const { createReadStream, filename, mimetype } = await file;
      const stream = createReadStream();

      // ディスクにファイルを保存するためのヘルパー関数
      const saveFile = (readableStream, pathToSave) => new Promise((resolve, reject) => {
        // 指定されたパスにストリームを書き込む
        const writeStream = fs.createWriteStream(pathToSave);
        readableStream
          .pipe(writeStream)
          .on("finish", () => resolve()) // 完了時にresolve
          .on("error", reject); // エラー時にreject
      });

      // ファイルを保存するためのパスを指定
      const pathToSave = `uploads/${filename}`;
      try {
        // ヘルパー関数を使ってファイルを保存
        await saveFile(stream, pathToSave);
      } catch (err) {
        // ファイル保存時のエラーをコンソールに表示
        console.error("Failed to save file:", err);
        // ユーザーへのエラーメッセージをスロー
        throw new Error("Failed to upload file.");
      }

      // 成功時にファイル情報を返す
      return { filename, mimetype, path: pathToSave };
    },


  }
}

export default resolvers;