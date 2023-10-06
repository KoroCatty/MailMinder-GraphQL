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
      console.log(userPostCount + "🎲 ユーザーの投稿数")

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

      // 4. そのデータを mailOptions オブジェクトで E メールの本文に組み込む
      const htmlContent = userPosts.map(post => `
        <h2>Title: ${post.title}</h2>
        <p>Hello ${user.firstName} !</p>
        <p>Text: ${post.content}</p>
        <img src="${post.imgUrl}" alt="Post Image">
        <br>
        <a href="http://localhost:3000/posts/${post.id}">Click here to view the post</a>
        <br>
        <hr>
      `).join('');

      // E メールの内容を定義
      const mailContent = {
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: `Your 5 posts!`,
        html: htmlContent
      };

      // 5. nodemailer を使用して E メールを送信
      const info = await transporter.sendMail(mailContent);
      console.log(`Email sent to ${user.email}: ${info.response}`);
    }

  } catch (error) {
    console.error("Error sending email with post content:", error);
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


