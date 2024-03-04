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
// const sendEmail = cron.schedule('*/3 * * * *', async () => {

//! Send Email at 10:00 AM JST every day (日本時間の毎朝10時に)
const sendEmail = cron.schedule('0 1 * * *', async () => {
  try {
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

    // 投稿をシャッフル (与えられた配列の要素をランダムに並べ替える)
    function shuffleArray(array) {
      // 配列の最後の要素（array.length - 1）から始めて、配列の先頭の次の要素まで、逆順にループを進める
      for (let i = array.length - 1; i > 0; i--) {
        // 現在の要素のインデックス（i）およびそれより前の要素のインデックスの中から、ランダムにインデックス（j）を選択
        const j = Math.floor(Math.random() * (i + 1));
        // 選択されたランダムなインデックスjの要素と現在の要素iを交換
        // 左側の[array[i], array[j]]は変数の配列を表し、右側の[array[j], array[i]]は新しい値の配列を表す。これにより、array[i]とarray[j]の値が交換される
        [array[i], array[j]] = [array[j], array[i]];
      }
    }

    // ユーザーの数だけループ
    for (const user of allUsers) {

      // 2. そのユーザーが持っている全ての投稿を取得
      const userPosts = await prisma.post.findMany({
        where: {
          userId: user.id
        },
        select: {
          id: true,
          title: true,
          content: true,
          imgUrl: true,
          imgCloudinaryUrl: true
        }
      });

      // 投稿の数をログに表示
      console.log(`User ${user.email} has ${userPosts.length} posts.`);

      // 全ての投稿をシャッフル関数に渡す
      shuffleArray(userPosts);

      // シャッフルされた投稿から最初の5件を取得
      const selectedPosts = userPosts.slice(0, 5);

      // 投稿の数が0の場合、次のユーザーに進む
      if (!selectedPosts.length) {
        console.log(`No posts found for user: ${user.email}`);
        continue; // このユーザーの投稿がない場合、次のユーザーに移動
      }


      // 4. E メールの本文を組み立てる
      const attachments = [];
      const htmlContent = selectedPosts.map((post, index) => {
        let imgTag;

        const oldPath = post.imgUrl;
        const newPath = oldPath.substring('../../'.length); // 部分削除

        // Cloudinary files
        if (post.imgCloudinaryUrl) {
          imgTag = `<img src="${post.imgCloudinaryUrl}" alt="Post Image"  style="width: 300px; height: 200px;">`;

          // Local files (uploaded img or noImg.jpeg)
        } else if (post.imgUrl.startsWith('/') || post.imgUrl.startsWith('.')) {
          const cidValue = `postimage${index}`;
          attachments.push({
            filename: post.imgUrl,
            path: `${__dirname}/uploads/compressed-${newPath}`,
            cid: cidValue // cid は、画像をメール本文に埋め込むためのもの
          });
          // console.log(`${__dirname}/uploads/compressed-${newPath}`)///uploads/compressed-noImg.jpeg

          imgTag = `<img src="cid:${cidValue}"  alt="Post Image" style="width: 300px; height: 200px;">`;

          // Remote files or if no other image is available
        } else {
          // ここでリモートの画像URLが存在するか、もしくはデフォルト画像を使用する
          const defaultImgPath = './compressed-imgs/noImg.jpeg';
          imgTag = `<img src="${post.imgUrl || defaultImgPath}" alt="Post Image" onerror="this.onerror=null; this.src='${defaultImgPath}';" style="width: 300px; height: 200px;">`;
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

      // E メールの内容を定義 (Demoユーザーにはメールを送らない)
      if (user.email !== 'demo@demo.com') {
        mailContent = {
          from: process.env.EMAIL_FROM,
          to: user.email,
          subject: `Hi ${user.firstName}! ${randomGreeting} `,
          html: htmlContent,
          attachments: attachments // 添付ファイルの配列
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
