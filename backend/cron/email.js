// 各ユーザーに、そのユーザーだけが持っている投稿をランダムに5件送る場合のロジック

// すべてのユーザーを取得する
// 各ユーザーに対して、そのユーザーが持っている投稿の数を取得する
// 5件の投稿をランダムに取得する
// その投稿をメールの本文として組み立てる
// そのユーザーのメールアドレスにメールを送る


import express from 'express';
import path from 'path';
const __dirname = path.resolve(); 



// プリズマのクライアントをインポート
import PC from '@prisma/client';

// プリズマクライエントのインスタンスを格納
const prisma = new PC.PrismaClient();

// node mailer
import nodemailer from 'nodemailer';

// node cron
import cron from 'node-cron';

// send email every 20 seconds
const sendEmail = cron.schedule('*/10 * * * * *', async () => {
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

    // 1. Prisma を使用して、全てのユーザーを取得
    const allUsers = await prisma.user.findMany();

    // ユーザーの数だけループ
    for (const user of allUsers) {

      // 2. そのユーザーが持っている投稿の数を取得
      const userPostCount = await prisma.post.count({ // count は、投稿の数を数える
        where: {
          userId: user.id // ループされた仮定しているユーザーIDのフィールド名
        }
      });
      console.log("📋 ユーザーの投稿数" + userPostCount)

      // スキップする投稿の数を計算
      // 5件以上の投稿がある場合、ランダムに5件を取得するために、スキップする投稿の数を計算
      // 5件未満の投稿がある場合、0を返す
      // 例えば、ユーザーが3件の投稿を持っている場合、0〜2のランダムな数を返す
      // Math.max()は、引数の中で最大の数を返す
      const skipPosts = Math.max(userPostCount - 5, 0) * Math.random();

      // 3. そのユーザーが持っている投稿をランダムに5件取得
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

      const attachments = []; // push のための空配列を用意
      const htmlContent = userPosts.map((post, index) => {
        let imgTag;

        // Local files
        // ローカルのパスが'/'または'.'で始まる場合、画像はローカルにある
        // Eメール内に画像を埋め込む方法として、CIDを利用して画像を直接メール本文に埋め込む
        if (post.imgUrl.startsWith('/') || post.imgUrl.startsWith('.')) {
          const cidValue = `postimage${index}`;
          attachments.push({
            // filename: `post_${index}.jpeg`,
            filename: post.imgUrl,

            // path: post.imgUrl,
            //! frontの場合はfrontのフォルダ、backの場合はbackの uploads フォルダ
            path:  post.imgUrl ? '' : `${__dirname}/uploads/${post.imgUrl}`,
            cid: cidValue
          });
          // console.log(cidValue) // postimage1

          imgTag = `<img src="cid:${cidValue}" alt="No Post Image" style="width: 300px; height: 200px" >`;

          // Remote files
        } else {
          imgTag = `<img src="${post.imgUrl}" alt="No Post Image" onerror="this.onerror=null; this.src='./noImg.jpeg';" style="width: 300px; height: 200px" >`;
        }

        return `
          <h2>Title: ${post.title}</h2>
          <p>Hello ${user.firstName} !</p>
          <p>Text: ${post.content}</p>
          ${imgTag}
          <br>
          <a href="http://localhost:3000/postdetails/${post.id}">Click here to view the post</a>
          <br>
          <hr>
          `;
      }).join('');

      // E メールの内容を定義
      const mailContent = {
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: `Your 5 posts!`,
        html: htmlContent,

        attachments: attachments // 添付ファイルの配列
      };

      // 5. nodemailer を使用して E メールを送信
      const info = await transporter.sendMail(mailContent);
      console.log(`Email sent to ${user.email}: ${info.response}`.cyan.bold.underline);
    }

  } catch (error) {
    console.error("エラー Error sending email with post content:", error);
  }
});



export default sendEmail;






// export const sendEmail = async (req, res) => {
//   // email message options
//   const mailOptions = {
//     from: process.env.EMAIL_FROM,
//     to: process.env.EMAIL_TO,
//     subject: 'Sending Email using Node.js',
//     text: 'That was easy!'
//   };

//   // email transport configuration
//   const transporter = nodemailer.createTransport({
//     service: process.env.EMAIL_SERVICE,
//     host: process.env.EMAIL_HOST,
//     port: process.env.EMAIL_PORT,
//     auth: {
//       user: process.env.EMAIL_FROM,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   // send email every 10 seconds
//   cron.schedule('*/20 * * * * *', () => {

//     // Send Email 8:00 AM every day
//     // cron.schedule('0 8 * * *', () => { 
//     transporter.sendMail(mailOptions, function (error, info) {
//       if (error) {
//         console.log(error);
//       } else {
//         console.log("Email sent: " + info.response);
//         scheduled: true;
//         timezone: "Asia/Tokyo";
//       }
//     });
//   });
// }


