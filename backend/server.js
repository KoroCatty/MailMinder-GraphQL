import colors from 'colors';
import { ApolloServer } from '@apollo/server';

import express from 'express';
import path from 'path';
// import fs from 'fs'; // ファイル操作を可能にするモジュール

// StandAloneServer -> Express server に変更するために必要なモジュール
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

// Schema and Resolvers
import typeDefs from './typeDefs.js';
import resolvers from './resolvers.js';

import crypto from 'crypto';
// console.log(crypto.randomUUID());// 30eee7b2-7d88-4388-9424-28257803b92d

// Token
import jwt from 'jsonwebtoken';

//! SENDING EMAIL  (DO NOT DELETE)
import './cron/email.js';

// プリズマのクライアントをインポート (DB接続確認のため)
import { PrismaClient } from '../prisma/generated/client/index.js'
const prisma = new PrismaClient()

// CLOUDINARY
import cloudinaryConfig from './cloudinary.js';

// Sharp (Image compressor)
import sharp from 'sharp';

// Initialize express
const app = express();

app.use(cors({
  origin: true,     //! allow any origin
  credentials: true //! allow cookies
}));

app.use(cookieParser());

//* ==============================================================
//* UPLOAD IMAGE to Both uploads folder & Cloudinary 
//* ==============================================================
import multer from "multer";

// 画像ファイルの保存先を指定 (cb = callback)
const LocalStorage = multer.diskStorage({
  destination(req, file, cb) {
    // null is for error | 画像は root の uploads からサーバーに保存される
    cb(null, "uploads/");
  },
  //! Create a file name
  filename(req, file, cb) {
    // fieldname = image なので image-163123123.jpg というファイル名になる
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// check file type
// 関数 fileFilter はアップロードされるファイルのタイプを検証
function fileFilter(req, file, cb) {

  // 受け入れられるファイルの拡張子を正規表現で定義
  const filetypes = /jpe?g|png|gif|webp/;
  // 受け入れられるMIMEタイプ（ファイルの種類）を正規表現で定義
  const mimetypes = /image\/jpe?g|image\/png|image\/gif|image\/webp/;

  // アップロードされたファイルの拡張子が受け入れられるものかテスト
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  // アップロードされたファイルのMIMEタイプが受け入れられるものかテスト
  const mimetype = mimetypes.test(file.mimetype);

  // 拡張子とMIMEタイプの両方が受け入れられる場合、ファイルを受け入れる
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Images only!'), false);
  }
}
// multerの設定を適用して、アップロード機能を初期化
const upload = multer({ storage: LocalStorage, fileFilter });

// 'img' という名前の単一の画像をアップロードするためのミドルウェアを設定
const uploadSingleImage = upload.single('img');

// 画像をアップロードするためのエンドポイントを追加
app.post('/uploads', uploadSingleImage, async (req, res) => {
  try {
    // 画像を圧縮 (圧縮した画像のファイル名を生成 (接頭辞を付与)
    const compressedFilename = `compressed-${req.file.filename}`;
    const compressedFilePath = path.join('uploads/', compressedFilename);
    console.log(compressedFilename) // compressed-img-1700445713500.png

    // 画像を圧縮して、uploadsフォルダに保存
    await sharp(req.file.path)
      .resize(800, 800) // サイズの変更
      .jpeg({ quality: 40 }) // 画像の品質を50%にし、jpeg 形式に変換
      .toFile(compressedFilePath); // 圧縮された画像をファイルに保存

    // Cloudinaryの設定
    const result = await cloudinaryConfig.uploader.upload(compressedFilePath, {
      folder: 'My Folder',
      allowedFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
      transformation: [{ width: 800, height: 800, crop: 'limit' }]
    });

    // Cloudinary が返してくれるもの
    // Response to FrontEnd (Frontendから POST でアクセスできるようにする)
    res.json({
      url: `/uploads/${compressedFilename}`,// 圧縮された画像のURL(local)
      cloudinaryUrl: result.secure_url, // 画像のURLを返す(cloudinary)
      cloudinary_id: result.public_id // 画像のIDを返す(cloudinary)
    });
    
    // 圧縮前の元の画像を削除 (unlinkSync は非同期ではない)
    // しかし Email 送信用に、元の画像を残しておく
    // fs.unlinkSync(req.file.path);

    console.log("画像を Cloudinary & uploads にアップロードしました🎉".green.underline);

  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

//* uploads Folder 公開ディレクトリを指定
//* Create a uploads folder in the root directory
const __dirname = path.resolve();
//  console.log(__dirname); // /Users/Full-Stack/RemindApp (全てのパスを取得)

// 現在のディレクトリからの相対パス./uploadsを絶対パスに変換して格納
const uploadsDirectory = path.join(__dirname, '/uploads');
// console.log(uploadsDirectory); // /Users/.../RemindApp/uploads

// この設定により、uploadsディレクトリ内のすべてのファイルは、/uploads/<filename> のURLでアクセス可能
// '/uploads' エンドポイントを使用して、そのディレクトリ内の静的ファイルを提供
// '/uploads'というパスのリクエストがあったときに次の express.static()ミドルウェアが動作
app.use('/uploads', express.static(uploadsDirectory));

//* ==============================================================
//* CLOUDINARY IMAGE FILE DELETE (CLODINARY SERVER)
//* ==============================================================
// app.delete('/uploads:id', async (req, res) => {
//   try {
// Delete image from cloudinary
//     await cloudinary.uploader.destroy(req.body.cloudinary_id);
//     res.json({ msg: 'Image deleted' });
//   } catch (err) {
//     console.log(err);
//   }
// });











app.use(cors({
  origin: true,  // or true to allow any origin
  credentials: true
}));

//? ==============================================================
//? Deploy Settings
//? ==============================================================
if (process.env.NODE_ENV === 'production') {
  // Express will serve up production assets
  // Express が production 環境の assets を提供するようにする
  // ルートの / にアクセスがあった場合、Express は frontend/build/index.html を返す
  app.use(express.static(path.join(__dirname, 'frontend/dist')));

  // if it doesn't recognize the route
  // Express が route を認識できない場合は、front-end の index.html ファイルを提供する
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

//! ==============================================================
//! Apollo Server
//! ==============================================================
// Our httpServer handles incoming requests to our Express app.
// tell Apollo Server to "drain" this httpServer,
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 5001;

const server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
  // context: ({ req, res }) => ({ req, res }),
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })], // Added
  cors: {
    origin: true,  // or true to allow any origin
    credentials: true
  }
})
// Ensure we wait for our server to start
await server.start();

app.use('/', cors({
  origin: true,
  credentials: true,
}
),


  // 50mb is the limit that `startStandaloneServer` 
  bodyParser.json({ limit: '50mb' }),
  // expressMiddleware accepts the same arguments:
  // an Apollo Server instance and optional configuration options
  expressMiddleware(server, {

    // ログイン用 context を使い、resolver.js内の、各リクエストで使用できるようにする
    // As i used HttpOnly, req, res are needed 
    context: async ({ req, res }) => {
      //! Token from HttpOnly Cookie 
      const token = req.cookies.jwt_httpOnly;

      // 最初はトークンがないので、userId は null に設定
      let userId = null;

      if (token) {
        try {
          // トークンを検証
          const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
          userId = decodedToken.userId;

        } catch (error) {
          console.error("トークン Verification Error 😢", error);
        }
      }
      return { userId, req, res }; // resolvers で context として使用可能
    },
    options: {
      //Maximum upload file size set at 10 MB
      maxFileSize: 10 * 1024 * 1024,
    },
  }),
);

// Modified server startup
await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
console.log(`🚀 Server ready at http://localhost:${PORT}`.cyan.underline);
//! ==============================================================


//* ==============================================================
//* MySQL DB CONNECTION 
//* ==============================================================
async function connectDB() {
  try {
    await prisma.$connect();
    console.log("connected to MySQL! - DB接続成功💾".yellow.underline);
  } catch (error) {
    console.error("Error connecting to the database - DB接続が失敗しました😢".red.underline, error);
  } finally {
    await prisma.$disconnect();
  }
}
connectDB();
