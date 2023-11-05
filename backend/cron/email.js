// 各ユーザーに、そのユーザーだけが持っている投稿をランダムに5件送る場合のロジック

// Logic
// すべてのユーザーを取得する
// 各ユーザーに対して、そのユーザーが持っている投稿の数を取得する
// 5件の投稿をランダムに取得する
// その投稿をメールの本文として組み立てる
// そのユーザー全員のメールアドレスにメールを送る


import path from 'path';
const __dirname = path.resolve();

// プリズマのクライアントをインポート
import { PrismaClient } from '../../prisma/generated/client/index.js'
const prisma = new PrismaClient()

// node mailer
import nodemailer from 'nodemailer';

// node cron
import cron from 'node-cron';

//! Send Email every 3 minutes
const sendEmail = cron.schedule('*/3 * * * *', async () => {

//! send email every 10 seconds
// const sendEmail = cron.schedule('*/10 * * * * *', async () => {

//! Render.com にデプロイした時間
// //! Send Email at 8:00 AM, 12:00 PM, and 8:00 PM JST every day (日本時間)
// const sendEmail = cron.schedule('0 23,3,11 * * *', async () => {


//! Send Email at 8:00 AM, 12:00 PM, and 5:00 PM JST every day (日本時間)
// const sendEmail = cron.schedule('0 23,3,8 * * *', async () => {
  try {
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

    // 1. Get all users by Prisma
    const allUsers = await prisma.user.findMany();

    // ユーザーの数だけループ
    for (const user of allUsers) {

      // 2. そのユーザーが持っている投稿の数を取得
      const userPostCount = await prisma.post.count({ // count は、投稿の数を数える
        where: {
          userId: user.id // ループされた仮定しているユーザーIDのフィールド名
        }
      });
      console.log("📋 ユーザーの投稿数" + userPostCount) // ex) 16

      // スキップする投稿の数を計算
      // 5件以上の投稿がある場合、ランダムに5件を取得するために、スキップする投稿の数を計算
      // 例えば、ユーザーが3件の投稿を持っている場合、0〜2のランダムな数を返す
      // Math.max()は、引数の中で最大の数を返す
      const skipPosts = Math.max(userPostCount - 5, 0) * Math.random();

      // 3. そのユーザーが持っている投稿をランダムに 5件取得
      const userPosts = await prisma.post.findMany({
        where: {
          userId: user.id
        },
        take: 5,
        skip: Math.floor(skipPosts) // skip とは、指定した数の投稿をスキップする
      });

      if (!userPosts.length) {
        console.log(`No posts found for user: ${user.email}`);
        continue;  // このユーザーの投稿がない場合、次のユーザーに移動
      }

      // 4. E メールの本文を組み立てる
      // const attachments = [];
      const htmlContent = userPosts.map((post, index) => {
        let imgTag;

        const oldPath = post.imgUrl;
        const newPath = oldPath.substring('../../'.length); // 部分削除

        // Local files
        // ローカルのパスが'/'または'.'で始まる場合、画像はローカルにある
        // Eメール内に画像を埋め込む方法として、CIDを利用して画像を直接メール本文に埋め込む
        if (post.imgUrl.startsWith('/') || post.imgUrl.startsWith('.')) {
          const cidValue = `postimage${index}`;

          // src属性にcid:CIDの値を指定することで、添付された画像を参照 (必須)
          imgTag = `<img src="cid:${cidValue}" alt="Post Image" style="width: 300px; height: 200px;">`;

        } else if (post.imgCloudinaryUrl) {
          // Cloudinary files
          imgTag = `<img src="${post.imgCloudinaryUrl}" alt="Post Image" onerror="this.onerror=null; this.src='./noImg.jpeg';" style="width: 300px; height: 200px;">`;
        
          // Remote files
        } else {
          imgTag = `<img src="${post.imgUrl}" alt="Post Image" onerror="this.onerror=null; this.src='./noImg.jpeg';" style="width: 300px; height: 200px;">`;
        }

        return `
          <div style="border-bottom: 1px solid #e0e0e0; padding: 10px 0;">
            <h2 style="font-size: 16px; margin: 0 0 10px;">Title: ${post.title}</h2>
            <p className="card-content">
              ${post.content.replace(/\n/g, '').length > 100
                ? post.content.replace(/\n/g, '').slice(0, 100) + "..."
                : post.content.replace(/\n/g, '')}
            </p>
            ${imgTag}
            <div style="margin-top: 10px;">
              <a href="https://remindapp.onrender.com/postdetails/${post.id}" style="color: #337ab7; text-decoration: none;">Click here to view the post</a>
            </div>
          </div>
          `;
      }).join(''); // 配列の要素を文字列に変換する

      // ランダムで subject のあいさつを変える
      const greetings = ["Today's 5 posts😁", 'How are you?😃', "Check today's posts🫡", "Don't forget to check🥹"];
      const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];


      let mailContent;

      if (user.email !== 'demo@demo.com') {
        // E メールの内容を定義
        mailContent = {
          from: process.env.EMAIL_FROM,
          to: user.email,
          subject: `Hi ${user.firstName}! ${randomGreeting} `,
          html: htmlContent,
          // attachments: attachments // 添付ファイルの配列
        };
    
        const info = await transporter.sendMail(mailContent);
        console.log(`Email sent to ${user.email}: ${info.response}`.cyan.bold.underline);
      } else {
        console.log(`Skipped sending email to demo user: ${user.email}`.cyan.bold.underline);
      }
    }
    
    console.log('All emails sent successfully!'.red.bold);

  } catch (error) {
    console.error("エラー Error sending email with post content:", error);
  }
},
  {
    scheduled: true,
    timezone: "UTC"
  }
);

export default sendEmail;
