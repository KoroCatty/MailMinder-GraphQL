
import colors from 'colors';
import { ApolloServer } from '@apollo/server';

import express from 'express';
import path from 'path';

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

//! Sending Email Function (DO NOT DELETE)
import sendEmail from './cron/email.js';

// プリズマのクライアントをインポート (DB接続確認のため)
import { PrismaClient } from '../prisma/generated/client/index.js'
const prisma = new PrismaClient()

// CLOUDINARY
import cloudinaryConfig from './cloudinary.js';

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

// which storage/server  we want to use  (cb = callback)
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
  const filetypes = /jpe?g|png|webp/;
  // 受け入れられるMIMEタイプ（ファイルの種類）を正規表現で定義
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

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
    // Cloudinaryの設定
    const result = await cloudinaryConfig.uploader.upload(req.file.path, {
      folder: 'My Folder',
      allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ width: 500, height: 500, crop: 'limit' }]
    });

    // 画像のURLを取得 (From Cloudinary)
    // console.log(result.secure_url);

        // reqにresult.secure_urlを追加
        // Expressのリクエストオブジェクト req にこの情報を追加
        // これを context に渡し、resolver で使用できるようにする
        // req.imgCloudinaryUrl = result.secure_url;

        // // save to session 
        // req.session.imgCloudinaryUrl = result.secure_url; 
        // console.log(req.session.imgCloudinaryUrl + "🚀😾")
        // res.send({ success: true });

        // console.log(req.session)



    // 画像のURLをデータベースに保存
    // const savedImage = await prisma.post.create({
    //   data: {
    //     // title: "デフォルトのタイトル",    // 仮のタイトル
    //     // content: "デフォルトのコンテンツ", // 仮のコンテンツ
    //     // imgUrl: `/uploads/${req.file.filename}`, // ローカルの画像URL
    //     // userId: 1, // 仮のユーザーID。実際のユーザーIDを設定する必要があります
    //     imgCloudinaryUrl: result.secure_url, // Cloudinaryの画像URL
    //   }
    // });
    // console.log(savedImage.cyan.underline);


    //! DB SAVE
    // GraphQL エンドポイントを呼び出して `result.secure_url` をDBに保存
    // const response = await fetch(`http://localhost:5001/graphql`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     // 必要に応じて他のヘッダーや認証情報を追加
    //   },
    //   body: JSON.stringify({
    //     query: `
    //       mutation ($imgCloudinaryUrl: String!) {
    //         uploadImage(imgCloudinaryUrl: $imgUrlCloudinary) {
    //           id
    //           imgCloudinaryUrl
    //         }
    //       }
    //     `,
    //     variables: {
    //       imgUrlCloudinary: result.secure_url
    //     }
    //   })
    // });

    // const data = await response.json();

    // if (data.errors) {
    //   throw new Error(data.errors[0].message);
    // }

      // クライアントにスクリプトを送信してローカルストレージにデータを保存
    // res.send(`
    //   <script>
    //     localStorage.setItem('cloudinaryImageUrl', '${result.secure_url}');
    //     window.location.href = '/'; // オプション: メインページまたは他のページにリダイレクト
    //   </script>
    // `);


// Response to FrontEnd
    res.json({ 
      url: `/uploads/${req.file.filename}`,// 画像のURLを返す(local)
      cloudinaryUrl: result.secure_url // 画像のURLを返す(cloudinary)
    });

  } catch (error) {
    res.status(500).send({ error: error.message });
    // res.status(500).send({ error: 'Failed to upload image.' });
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

app.use(
  '/',
  cors(
    {
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
//* MySQL DB CONNECTION CHECK (接続確認)
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
