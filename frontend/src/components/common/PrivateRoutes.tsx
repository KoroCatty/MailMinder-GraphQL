//! Outlet => Logged in user |  Navigate => NOT Logged in user
import { Outlet, Navigate } from "react-router-dom";

// Apollo client
import { useQuery } from "@apollo/client";
import { IS_LOGGED_IN_QUERY } from "../../graphql/queries";

// TYPE
type IsLoggedInPropType = {
  isLoggedIn: boolean;
};

const PrivateRoutes = ({ isLoggedIn }: IsLoggedInPropType) => {
  // while loading, return null which prevents <Navigate to="/login" />
  const { loading } = useQuery(IS_LOGGED_IN_QUERY, {
    fetchPolicy: "network-only",
  });
  if (loading) return null;

  return (
    //  ログインしてる場合は Outlet（子ルート）をレンダリング
    //  ログインしていなければ ログインページにリダイレクト
    isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />
  );
};

export default PrivateRoutes;
