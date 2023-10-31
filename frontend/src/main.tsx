import React from 'react';

import ReactDOM from 'react-dom/client';//（ブラウザ向けのReactレンダラ）
import App from './App.tsx';
import './index.css';

// Apollo Client (アプリ全体で useQuery を使えるようにする)
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

// Apollo で header に tokenと Authorization を付与できるようにする setContext
import { setContext } from "@apollo/client/link/context";

// ファイルアップロードをサポートするApolloリンクを作成するための関数をインポート
import { createUploadLink } from 'apollo-upload-client'; 



//! IMPORTANT (Switch required before push)
// フロントエンドからバックエンドに接続
const uploadLink = createUploadLink({
  credentials: 'include',  //* allow cookies to be sent from Frontend to Backend
  uri: 'http://localhost:5001',             //!DEVELOPMENT
  // uri: 'https://remindapp.onrender.com/' //! PRODUCTION
});


// Get the authentication token from local storage if it exists
const authLink = setContext((_, { headers }) => {
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      // token が存在すれば header に追加
      Authorization: localStorage.getItem("token_GraphQL") || null
    }
  };
});

// Apollo Clientのインスタンスを作成
const client = new ApolloClient({
  link: authLink.concat(uploadLink), // authLinkとuploadLinkを結合
  cache: new InMemoryCache(), // InMemoryCacheとは、メモリ上にデータをキャッシュする方法
});


// ReactアプリケーションをDOMにレンダリング
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
);
