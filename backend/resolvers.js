// プリズマのクライアントをインポート
import PC from '@prisma/client';

// Apollo エラーハンドリング
// import { ApolloError, AuthenticationError, ForbiddenError } from 'apollo-server';
// import { ForbiddenError,  } from '@apollo/server';


import bcrypt from 'bcryptjs';

import jwt from 'jsonwebtoken';

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
    //* GET ALL MESSAGES BY USER
    //* -----------------------------------------------
    messagesByUser: async (_, args, context) => {
      await console.log(args.receiverId + "🥶")
      console.log(context.userId + "🤠")

      // ログインチェック (context使用)
      if(!context.userId) { throw new Error("You must be logged in 😱") }

      const messages = await prisma.message.findMany({
        // 2つのユーザー間のすべてのメッセージを取得 (複数の条件をOR論理で結合)
        where: {
          OR: [
            {senderId: context.userId,  receiverId: args.receiverId},
            {senderId: args.receiverId, receiverId: context.userId}
          ]
        },
        orderBy: { createdAt: "desc" } // 新しい順に並べる
      })
      return messages;
    },

    //* GET SINGLE USER
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
    //* CREATE A MESSAGE
    //* ===============================================
    // これら parent, args, context は ApolloServer(ユーザから) 渡される
    createMessage: async (_, args, context) => {
      console.log(args.receiverId + "😈")
      console.log(args.text + "🤫")
      console.log(context.userId + "👹")

      // ログインしてなかったらエラー(contextで先に確認できる)
      if (!context.userId) {
        throw new Error("You must be logged in (Contextにトークンがありません)😱");
      }

      //! save to DB
       // message は prisma.schema で定義済みのモデル
      const newMessage = await prisma.message.create({
        data: {
          text: args.text,
          receiverId: args.receiverId,
          senderId: context.userId
        }
      })
      return newMessage;

    }
  }
}

export default resolvers;