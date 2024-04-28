import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// DB Connection
mongoose
  .connect(process.env.MONGO_URL) // 環境変数からURLを読み込む正しい方法
  .then(() => {
    console.log("Connected to MongoDB🚀".bgGreen); // 色付きログが機能するように
  })
  .catch((err) => {
    console.log(err);
  });

// Model
const imageSchema = new mongoose.Schema({
  userId: String, // MySQLのユーザーIDと連携
  imageUrl: String,
});
const Image = mongoose.model("Image", imageSchema);

export default Image;
