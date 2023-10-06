import colors from 'colors';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

// Schema and Resolvers
import typeDefs from './typeDefs.js';
import resolvers from './resolvers.js';

import crypto from 'crypto';
// console.log(crypto.randomUUID());// 30eee7b2-7d88-4388-9424-28257803b92d

import jwt from 'jsonwebtoken';

// node mailer
import nodemailer from 'nodemailer';

// node cron
import cron from 'node-cron';

// email message options
const mailOptions = {
  from: process.env.EMAIL_FROM,
  to: process.env.EMAIL_TO,
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

// email transport configuration
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASS,
  },
});

// send email every 10 seconds
cron.schedule('*/10 * * * * *', () => {

// Send Email 8:00 AM every day
// cron.schedule('0 8 * * *', () => { 
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
      scheduled: true;
      timezone: "Asia/Tokyo";
    }
  });
});



//* ==============================================================
//* 画像アップロード用 multer & express

// import multer from "multer";
// import path from "path"; // path module はファイルパスを操作するため(buit-in)

// import express from "express";
// const app = express();

// // which storage/server  we want to use  (cb = callback)
// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     // null is for error | 画像は root の uploads からサーバーに保存される
//     cb(null, "uploads/");
//   },
//   //! Create a file name
//   // fieldname = image なので image-163123123.jpg というファイル名になる
//   filename(req, file, cb) {
//     cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`); 
//   },
// });

// // check file type
// // 関数 fileFilter はアップロードされるファイルのタイプを検証
// function fileFilter(req, file, cb) {

//   // 受け入れられるファイルの拡張子を正規表現で定義
//   const filetypes = /jpe?g|png|webp/;
//     // 受け入れられるMIMEタイプ（ファイルの種類）を正規表現で定義
//   const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

//    // アップロードされたファイルの拡張子が受け入れられるものかテスト
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

//    // アップロードされたファイルのMIMEタイプが受け入れられるものかテスト
//   const mimetype = mimetypes.test(file.mimetype);

//   // 拡張子とMIMEタイプの両方が受け入れられる場合、ファイルを受け入れる
//   if (extname && mimetype) {
//     cb(null, true);
//   } else {
//     cb(new Error('Images only!'), false);
//   }
// }
// // multerの設定を適用して、アップロード機能を初期化
// const upload = multer({ storage, fileFilter });

// // 'image' という名前の単一の画像をアップロードするためのミドルウェアを設定
// const uploadSingleImage = upload.single('image');

// app.post('/upload', uploadSingleImage, (req, res) => {
//   res.json({ file: req.file });
// });

//* ==============================================================



// Define the startServer function
async function startServer() {

  const server = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers,
    // introspection: true,
    //! ver 4 からは context がここで定義できない 
  })

  const { url } = await startStandaloneServer(server, {
    // req は この standaloneServer からのもの
    context: async ({ req }) => {

      // destructure from req
      const { authorization } = req.headers;

      // トークンがあれば、トークンを検証し、userId を返す
      if (authorization) {
        try {
          const { userId } = await jwt.verify(authorization, process.env.JWT_SECRET);
          return { userId };
        } catch (error) {
          console.error("トークン Verification Error", error); // JWTの検証中のエラーをログに出力
          return {}; 
        }
      }
    },
    listen: { port: 5001 },
  });
  console.log(`🚀 Server ready at ${url}`);

}
startServer();


