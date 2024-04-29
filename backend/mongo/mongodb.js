// MongooseError: The `uri` parameter to `openUri()` must be a string, got "undefined". Make sure the first parameter to `mongoose.connect()` or `mongoose.createConnection()` is a string.
//     at NativeConnection.createClient (/opt/render/project/src/node_modules/mongoose/lib/drivers/node-mongodb-native/connection.js:206:11)
//     at NativeConnection.openUri (/opt/render/project/src/node_modules/mongoose/lib/connection.js:801:34)
//     at Mongoose.connect (/opt/render/project/src/node_modules/mongoose/lib/mongoose.js:414:15)
//     at file:///opt/render/project/src/backend/mongo/mongodb.js:13:4
//     at ModuleJob.run (node:internal/modules/esm/module_job:194:25)

import mongoose from "mongoose";
// CLOUDINARY
// import cloudinaryConfig from "../cloudinary.js";

// Sharp (Image compressor)
import sharp from "sharp";

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
