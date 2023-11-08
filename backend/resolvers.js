// To get the current directory path (ESM module)
import { promises as fs } from 'fs';
import { URL, fileURLToPath } from 'url';

import bcrypt from 'bcryptjs';
import Joi from 'joi'; // Validation
import jwt from 'jsonwebtoken';

// import cloudinaryConfig from './cloudinary.js'; 

import cloudinary from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


// プリズマクライエントのインスタンスを格納
import { PrismaClient } from '../prisma/generated/client/index.js'
const prisma = new PrismaClient()

//!  DELETE FILE Function (Get the file path from Delete resolver)
async function deleteFile(filePath) {
  try {
    await fs.unlink(filePath); // unlink でファイルを削除
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
    //* CHECK LOGIN STATUS
    //* -----------------------------------------------
    isLoggedIn: (_, __, context) => {
      return Boolean(context.userId); // httpOnly で取得したトークンがあるかどうか
    },

    //* -----------------------------------------------
    //* GET ALL USERS
    //* -----------------------------------------------
    // context は server.js で定義済みで、ログインしていると、そのユーザーの情報が入っている
    users: async (_, args, context) => {
      // console.log(context.userId + "👤 user ID")
      // console.log(context)

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
      console.log(context.userId + "👤 user ID") // ログイン者のID
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
      // await console.log(args.userNew);// typeDefsで定義済み

      // Joi Validation
      const schema = Joi.object({
        firstName: Joi.string().required().min(3).max(30).alphanum(),// alphanum() は英数字のみ
        lastName: Joi.string().required().min(1).max(30),
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
    // (resは HttpOnly Cookieで返ってきたもの)
    signinUser: async (_, args, { res }) => {
      console.log(res.cookie)

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

      //! GENERATE TOKEN
      // 第一にはトークンに入れたいデータ, 第二にはシークレットキー, 第三にはオプション
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '3h' });

      // Set token as an httpOnly cookie
      res.cookie('jwt_httpOnly', token, {
        httpOnly: true, // クッキーがJavaScriptからアクセスされるのを防ぐ
        secure: process.env.NODE_ENV === 'production', // Use 'secure' flag when in production mode
        sameSite: 'None',// ードパーティのコンテキストでクッキーを送信する方法を制御 (secureを true にする必要あり)
        maxAge: 3 * 60 * 60 * 1000 // 3 hours in milliseconds
      });

      console.log(token + " - Token Generated".blue.underline + "🔑 - ");
      return { token, user };
    },

    //* ===============================================
    //* LOGOUT USER 
    //* ===============================================
    // (HttpOnly Cookie内の token を削除)
    logout: (_, __, { res }) => {
      res.cookie('jwt_httpOnly', '', { expires: new Date(0), httpOnly: true });
      return true;
    },

    //* ===============================================
    //* CREATE A POST
    //* ===============================================
    createPost: async (_, args, context) => {
      // await console.log(args) // typeDefsで定義済み

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
        imgCloudinaryUrl: Joi.string(),
        imgCloudinaryId: Joi.string(),
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

      // DEMO LOGGED IN USER
      if (context.userId === 25 || context.userId === 2) {
        throw new Error("SORRY, DEMO USER CANNOT CREATE A POST🙏🏻");
      }

      //! save to DB
      // post は prisma.schema で定義済みのモデル
      const newPost = await prisma.post.create({
        data: {
          title: args.postNew.title,
          content: args.postNew.content,
          imgUrl: args.postNew.imgUrl ? args.postNew.imgUrl : "/imgs/noImg.jpeg", // use the uploaded file URL or default
          imgCloudinaryUrl: args.postNew.imgCloudinaryUrl, // CLOUDINARY URL
          imgCloudinaryId: args.postNew.imgCloudinaryId, // CLOUDINARY ID
          userId: context.userId
        }
      })
      return newPost;
    },

    //* ===============================================
    //* DELETE A POST
    //* ===============================================
    deletePost: async (_, args, context) => {
      await console.log(`👤 user ID: ${args.id} Deleted📨`)

      // ログインしてなかったらエラー(contextで先に確認できる)
      if (!context.userId) {
        throw new Error("You must be logged in (Contextにトークンがありません)😱");
      }

      // DEMO LOGGED IN USER
      if (context.userId === 25 || context.userId === 2) {
        throw new Error("SORRY, DEMO USER CANNOT DELETE A POST🙏🏻");
      }

      console.log(args.id + " - PostID 👆🏻")

      // post は prisma.schema で定義済みのモデル
      const deletedPost = await prisma.post.delete({
        where: {
          id: parseInt(args.id)
        }
      });

      // Delete the actual Image File if the post exists
      if (deletedPost) {
        const url = deletedPost.imgUrl;
        // console.log(url); // ex) http://localhost:5001/uploads/img-1698041204833.jpg

        // 実際の画像ファイルが存在しないpostがある場合処理をここで停止 (エラー対策)
        if (url.includes('noImg.jpeg')) {
          return deletedPost;
        }


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
      // await console.log(args.id + " - PostID 📨")
      // await console.log(args.postUpdate.title + " - Title -")
      // await console.log(args.postUpdate.content + "- Content -")
      // await console.log(args.postUpdate.imgUrl + "- imgUrl -")
      await console.log(args.postUpdate.imgCloudinaryUrl + "- imgCloudinaryUrl -")
      // await console.log(context.userId + " 👤 user ID")

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
        imgCloudinaryUrl: Joi.string(),
        imgCloudinaryId: Joi.string(),
        createdAt: Joi.date(),
        updatedAt: Joi.date(),
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

      // DEMO LOGGED IN USER
      if (context.userId === 25 || context.userId === 2) {
        throw new Error("SORRY, DEMO USER CANNOT UPDATE A POST🙏🏻");
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
          imgCloudinaryUrl: args.postUpdate.imgCloudinaryUrl, // CLOUDINARY URL
          imgCloudinaryId: args.postUpdate.imgCloudinaryId, // CLOUDINARY ID
          updatedAt: new Date().toISOString(), // 更新日時を追加
        }
      });
      return updatedPost;
    },

    //* ===============================================
    //* DELETE A POST's IMAGE FILE 
    //* When Updated the Image (LOCAL - uploads folder)
    //* ===============================================
    deletePostImage: async (_, args, context) => {
      // ログインしてなかったらエラー(contextで先に確認できる)
      if (!context.userId) {
        throw new Error("You must be logged in (Contextにトークンがありません)😱");
      }

      // DEMO LOGGED IN USER
      if (context.userId === 25 || context.userId === 2) {
        return;
      }

      // console.log(args.imgCloudinaryId + " - Cloudinary ID -😻")
      console.log(args)

      // postモデルから投稿を取得
      const post = await prisma.post.findUnique({
        where: {
          id: parseInt(args.id)
        }
      });

      // 投稿に画像が関連付けられている場合、画像を削除
      if (post && post.imgUrl) {
        // 画像のURLから画像のパスを取得して削除するロジック...
        // Delete the actual Image File if the post exists

        // 実際の画像ファイルが存在しないpostがある場合処理をここで停止 (エラー対策)
        if (post.imgUrl.includes('noImg.jpeg')) {
          return post;
        }

        if (post) {
          const url = post.imgUrl;
          console.log(`Image URL: ${url} Deleted 📨`)

          // Get the current directory path (ESM module)
          const __dirname = fileURLToPath(new URL('.', import.meta.url));
          // console.log(__dirname.red.underline);

          // goes up one level
          const currentURL = __dirname + '../'
          // console.log(currentURL.yellow.underline);

          // 正規表現 ^\/+ を使用して、文字列の先頭にある1つ以上のスラッシュ (/) を検出し、currentURL に置き換える
          const path = new URL(url).pathname.replace(/^\/+/, currentURL);
          // console.log(path.cyan.bold); // /Full-Stack/MailMinder-GraphQL/backend/../uploads/img-1698041204305.jpg

          // Execute Function
          deleteFile(path);
        }
      }
      return post;
    },

    //* ===============================================
    //* DELETE CLOUDINARY IMAGE FILE ON SERVER
    //* ===============================================
    deleteCloudinaryImage: async (_, { publicId }, context) => {
      // DEMO LOGGED IN USER
      if (context.userId === 25 || context.userId === 2) {
        return;
      }

      try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result.result === 'ok';
      } catch (error) {
        console.error(error);
        console.log("This public_id missing error is not a problem.")
        return false;
      }
    },


  }
}

export default resolvers;