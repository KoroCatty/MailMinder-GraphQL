
// TYPE
type IsLoggedInPropType = {
  isLoggedIn: boolean;
}

//! Outlet => Logged in user |  Navigate => NOT Logged in user
import { Outlet, Navigate } from 'react-router-dom';

const PrivateRoutes = ({ isLoggedIn }: IsLoggedInPropType) => {

  return (
    //  ログインしてる場合は Outlet（子ルート）をレンダリング
    //  ログインしていなければ ログインページにリダイレクト
    isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />

  )
}

export default PrivateRoutes

//replace は、Navigate コンポーネントのプロパティの一つで、ブラウザの履歴スタックに新しいエントリを追加する代わりに、現在のエントリを新しいもので置き換えるかどうかを制御する。具体的には、replace が true の場合、ユーザーが「戻る」ボタンをクリックしても、置き換えられたページには戻れない。
// 例えば、ユーザーがログインページにアクセスしようとした際に、すでにログインしている場合はダッシュボードにリダイレクトしたいと考えるかもしれないが、このリダイレクトが行われた後、ユーザーがブラウザの「戻る」ボタンをクリックしても、ログインページには戻れないようにしたい場合、replace プロパティを使用する