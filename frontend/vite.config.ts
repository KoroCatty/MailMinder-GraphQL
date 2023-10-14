import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from 'dotenv';
import path from 'path';

// 一つ上の階層の.envファイルのパスを指定して、dotenvで読み込む
const parentEnvConfig = dotenv.config({
  path: path.resolve(__dirname, '../.env')
}).parsed;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // フロントエンドのサーバーで/uploadsにアクセスされたとき、それをhttp://localhost:5001（バックエンドのアドレス）に転送する
      // "/uploads": "http://localhost:5001/uploads", 
    },
  },
  define: {
    // dotenvで読み込んだ環境変数をViteに定義する
    ...Object.keys(parentEnvConfig).reduce((prev, next) => {
      prev[`import.meta.env.${next}`] = JSON.stringify(parentEnvConfig[next]);
      return prev;
    }, {}),
  }
});
