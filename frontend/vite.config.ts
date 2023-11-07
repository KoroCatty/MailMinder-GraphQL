import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import path from "path";

import { VitePWA } from "vite-plugin-pwa";

// 一つ上の階層の.envファイルのパスを指定して、dotenvで読み込む
const parentEnvConfig =
  dotenv.config({
    path: path.resolve(__dirname, "../.env"),
  }).parsed || {}; // deploy エラー対策 on a server

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      injectRegister: "auto",
      manifest: {
        name: "MailMinder",
        short_name: "MailMinder",
        description: "Remind your things by Email",
        start_url: "/",
        display: "standalone",
        background_color: "black",
        theme_color: "#fcfcfc",
        orientation: "portrait-primary",
        icons: [
          {
            src: "/logo.jpg",
            sizes: "192x192",
            type: "image/jpeg",
          },
          {
            src: "/logo.jpg",
            sizes: "512x512",
            type: "image/jpeg",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        // workbox options for generateSW
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.origin === self.location.origin,
            handler: 'NetworkFirst', // Try network first, then fallback to cache if offline
            options: {
              cacheName: "MailMinder-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7日間
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
              networkTimeoutSeconds: 5, // after 5s, if the network response hasn't arrived, use the cache
            },
          },
        ],
      },
    }),
  ],
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
  },
});
