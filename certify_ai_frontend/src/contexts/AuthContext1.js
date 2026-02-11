import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api"; 

const AuthContext = createContext();

const decodeToken = (token) => {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user on refresh
  useEffect(() => {
    const initializeAuth = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      const decoded = decodeToken(token);
      if (!decoded) {
        await logout(); // logout safely if token is invalid
        setLoading(false);
        return;
      }

      try {
        // Fetch full profile from backend
        const res = await api.get("/profile");
        setUser(res.data);
      } catch (err) {
        console.error("Profile load failed", err);
        await logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // ✅ Login function
  const login = async (token) => {
    localStorage.setItem("token", token);
    setToken(token);

    // Fetch profile immediately after login
    try {
      const res = await api.get("/profile");
      setUser(res.data);
    } catch (err) {
      console.error("Profile fetch after login failed", err);
    }
  };

  // ✅ Logout function with backend tracking
  const logout = async () => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      setUser(null);
      setToken(null);
      return;
    }

    try {
      await api.post(
        "/users/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );

      console.log("Logout tracked successfully");
    } catch (err) {
      console.error("Logout tracking failed", err);
    } finally {
      // 🔥 Clear AFTER backend call
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