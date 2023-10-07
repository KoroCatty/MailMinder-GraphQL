import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

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
});
