import { createContext, useState, useContext, useEffect } from "react";
import { getCurrentUser, isAuthenticated } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null); // 'patient' or 'staff'

  useEffect(() => {
    const initializeAuth = async () => {
      if (isAuthenticated()) {
        try {
          const userData = await getCurrentUser();
          setUser(userData);
          setUserRole(userData.is_staff ? "staff" : "patient");
        } catch (error) {
          console.error("Failed to fetch user:", error);
          setUser(null);
          setUserRole(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const updateUser = (userData) => {
    setUser(userData);
    setUserRole(userData.is_staff ? "staff" : "patient");
  };

  const logout = () => {
    setUser(null);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, userRole, loading, updateUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
