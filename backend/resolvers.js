// To get the current directory path (ESM module)
import { promises as fs } from 'fs';
import { URL, fileURLToPath } from 'url';

import bcrypt from 'bcryptjs';
import Joi from 'joi'; // Validation
import jwt from 'jsonwebtoken';


// プリズマクライエントのインスタンスを格納
import { PrismaClient } from '../prisma/generated/client/index.js'
const prisma = new PrismaClient()

// Define DELETE FILE Function (Get the file path from Delete resolver)
async function deleteFile(filePath) {
  try {
    await fs.unlink(filePath); // Delete the file method
    console.log('File deleted successfully'.red);
  } catch (err) {
    console.error(err.red);
  }
}

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
      console.log(context.userId + "👤 user ID")
      console.log(context)

      // forbidden error means you are not allowed to do this
      if (!context.userId) throw Error("You must be logged in 😱")

      // 自分以外のユーザーを全て取得
      const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" }, // 新しい順に並べる
        where: {
          id: {
            not: context.userId // 自分以外のユーザーを取得
          }
        },
      });
      return users;
    },

    //* -----------------------------------------------
    //* GET ALL POSTS BY USER ID
    //* -----------------------------------------------
    PostsByUser: async (_, args, context) => {
      // console.log(context.userId + "👤 user ID") // ログイン者のID
      // console.log(context)

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
      // console.log(context.userId + "👤 user ID") // ログイン者のID
      // console.log(args.limit + " - Limit 4 Posts -")

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

      // Joi Validation
      const schema = Joi.object({
        firstName: Joi.string().required().min(5).max(30).alphanum(),// alphanum() は英数字のみ
        lastName: Joi.string().required().min(5).max(30),
        email: Joi.string().email().required(),
        password: Joi.string()
          .required()
          .pattern(new RegExp('^[a-zA-Z0-9]{4,30}$')) // 英数字のみ Only Number and Alphabet
          .messages({
            'string.pattern.base': 'パスワードは英数字のみで、4文字以上30文字以下である必要があります。'
          }),
      })

      // Joi Error Handling
      const { error } = schema.validate(args.userNew);
      if (error) {
        throw new Error(error.details[0].message);
      }

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
      // await console.log(args.userSignin);// typeDefsで定義済み

      // Joi Validation
      const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string()
          .required()
          .pattern(new RegExp('^[a-zA-Z0-9]{4,30}$')) // 英数字のみ Only Number and Alphabet
          .messages({
            'string.pattern.base': 'Password is only Number & Alphabet and more than 4 to 30 characters - パスワードは英数字のみで、4文字以上30文字以下である必要があります。'
          }),
      })
      // Joi Error Handling
      const { error } = schema.validate(args.userSignin);
      if (error) {
        throw new Error(error.details[0].message);
      }

      // email が重複してないかチェック (args~は front から送られてきたデータ)
      const user = await prisma.user.findUnique({ where: { email: args.userSignin.email } });

      // ユーザーが存在しない場合
      if (!user) {
        throw new Error("Email does not exist🫡");
      }
      // DB内のhash化されたパスと, 入力されたパスを比較 (Promiseで返却)
      const isPasswordCorrect = await bcrypt.compare(args.userSignin.password, user.password);
      if (!isPasswordCorrect) {
        throw new Error("Credential is incorrect🤬");
      }

      // Generate token out of this user.id 
      // 第一にはトークンに入れたいデータ, 第二にはシークレットキー, 第三にはオプション
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '3h' });
      console.log(token + " - Token Generated".red.underline + "🔑 - ");
      return { token: token };
    },

    //* ===============================================
    //* CREATE A POST
    //* ===============================================
    createPost: async (_, args, context) => {
      await console.log(args) // typeDefsで定義済み
      await console.log(args.postNew.imgUrl + " - 💀👻 Image URL💀👻")
      // await console.log(args.postNew.imgFile + "- 🌃 imgFile -".red);

      // Joi Validation
      const schema = Joi.object({
        title: Joi.string().required().max(255)
          .messages({
            'string.max': '255文字以下で入力してください。'
          }),
        content: Joi.string().required().max(3000)
          .messages({
            'string.max': '3000文字以下で入力してください。'
          }),
        imgUrl: Joi.string(),
        // imgFile: Joi.string(),
      })
      // Joi Error Handling
      const { error } = schema.validate(args.postNew);
      if (error) {
        throw new Error(error.details[0].message);
      }

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
          imgUrl: args.postNew.imgUrl ? args.postNew.imgUrl : "/imgs/noImg.jpeg", // use the uploaded file URL or default
          // imgUrl: args.postNew.imgUrl ? args.postNew.imgUrl : `${import.meta.url}/uploads/noImg.jpeg`,
          userId: context.userId
        }
      })
      return newPost;
    },

    //* ===============================================
    //* DELETE A POST
    //* ===============================================
    deletePost: async (_, args, context) => {
      console.log(args.id + " - PostID Deleted📨")

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

      // Delete the actual File if the post exists
      if (deletedPost) {
        const url = deletedPost.imgUrl;
        // console.log(url); // ex) http://localhost:5001/uploads/img-1698041204833.jpg

        
        // http://localhost:5001/imgs/ 以外なら実際のファイルは存在しないので、削除しない処理を記載
        if (url !== "http://localhost:5001/imgs/**" || `${import.meta.url}/uploads/**`) {
          return deletedPost;
        }

   
        // もし、デフォルトの画像だったら実際のファイルは存在しないので、削除しない処理を記載
        // if (url === "/imgs/noImg.jpeg"){
        //   return deletedPost;
        // }

        //! This is for CommonJS module -----------------------------------------------
        // const path = new URL(url).pathname.replace(/^\/+/, __dirname); // remove leading slashes
        // const currentURL = __dirname + '../' // need to get current directory path
        // console.log(currentURL);
        //! ---------------------------------------------------------------------------

        // Get the current directory path (ESM module)
        // '.' は現在のディレクトリを示し、それを import.meta.url の基準として解釈することで、ディレクトリのフルURLが得られる
        const __dirname = fileURLToPath(new URL('.', import.meta.url));
        // console.log(__dirname);

        // goes up one level
        const currentURL = __dirname + '../'
        // console.log(currentURL);

        // 正規表現 ^\/+ を使用して、文字列の先頭にある1つ以上のスラッシュ (/) を検出し、currentURL に置き換える
        const path = new URL(url).pathname.replace(/^\/+/, currentURL); 
        // console.log(path); // /Full-Stack/MailMinder-GraphQL/backend/../uploads/img-1698041204305.jpg

        // Pass the path defined above to the Function
        deleteFile(path); 
      }
      return deletedPost;
    },

    //* ===============================================
    //* UPDATE A POST
    //* ===============================================
    updatePost: async (_, args, context) => {
      await console.log(args.id + " - PostID 📨")
      await console.log(args.postUpdate.title + " - Title -")
      await console.log(args.postUpdate.content + "- Content -")
      await console.log(args.postUpdate.imgUrl + "- imgUrl -")
      await console.log(context.userId + " 👤 user ID")

      // Joi Validation
      const schema = Joi.object({
        title: Joi.string().required().max(255)
          .messages({
            'string.max': '255文字以下で入力してください。'
          }),
        content: Joi.string().required().max(3000)
          .messages({
            'string.max': '3000文字以下で入力してください。'
          }),
        imgUrl: Joi.string(),
        createdAt: Joi.date(),
        updatedAt: Joi.date(),
        // imgFile: Joi.string(),
      })
      // Joi Error Handling
      const { error } = schema.validate(args.postUpdate);
      if (error) {
        throw new Error(error.details[0].message);
      }

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