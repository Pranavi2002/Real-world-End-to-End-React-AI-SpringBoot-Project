import { createContext, useContext, useEffect, useState } from "react";
import api, { logoutUser } from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔄 Load user on app refresh
  useEffect(() => {
    const initializeAuth = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/profile");
        setUser(res.data);
      } catch (err) {
        console.error("Profile load failed", err);
        // Token invalid → clear locally (do NOT track logout)
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [token]);

  // ✅ Login
  const login = async (jwtToken) => {
    localStorage.setItem("token", jwtToken);
    setToken(jwtToken);

    const res = await api.get("/profile");
    setUser(res.data);
  };

  // ✅ Logout (tracked in backend)
  const logout = async () => {
    try {
      await logoutUser(); // interceptor adds token
      console.log("Logout tracked successfully");
    } catch (err) {
      console.error("Logout tracking failed", err);
    } finally {
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);