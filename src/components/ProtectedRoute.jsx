import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { isAuth } = useContext(AuthContext);

  if (!isAuth) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;
