import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import linkup from "../chatnest_api";
import { REFRESH_TOKEN, ACCESS_TOKEN, UserName } from "../constants";
import { useState, useEffect } from "react";

function ProtectedRoute({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    auth().catch(() => setIsAuthorized(false));
  }, []);

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    try {
      const res = await linkup.post("/auth/token/refresh/", {
        refresh: refreshToken,
      });
      if (res.status === 200) {
        const accessToken = res.data.access;
        localStorage.setItem(ACCESS_TOKEN, accessToken);

        const decodedToken = jwt_decode(accessToken);
        const userId = decodedToken.user_id;

        const usernameRes = await linkup.get(`/auth/user/username/${userId}/`);
        if (usernameRes.status === 200) {
          const username = usernameRes.data.username;
          localStorage.setItem(UserName, username);
        }
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      console.log(error);
      setIsAuthorized(false);
    }
  };

  const auth = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setIsAuthorized(false);
      return;
    }
    const decoded = jwtDecode(token);
    const tokenExpiration = decoded.exp;
    const now = Date.now() / 1000;

    if (tokenExpiration < now) {
      await refreshToken();
    } else {
      setIsAuthorized(true);
    }
  };

  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }

  return isAuthorized ? children : <Navigate to="/" />;
}

export default ProtectedRoute;
