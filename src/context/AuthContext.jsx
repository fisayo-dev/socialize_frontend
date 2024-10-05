import { useContext, createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const tokenKey = localStorage.getItem("TOKEN");
    if (tokenKey) {
      const decoded = jwtDecode(tokenKey);
      setUser(decoded);
    } else {
      setUser(null);
    }
  }, []);

  const login = (token) => {
    localStorage.setItem("TOKEN", token);
    const decoded = jwtDecode(token);
    setUser(decoded);
  };

  const logout = () => {
    localStorage.removeItem("TOKEN");
    setUser(null)
  };

  const contextData = {
    user,
    setUser,
    setLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? (
        <div className="w-[100vw] h-[100vh] grid items-center justify-center app-bg-color overflow-hidden">
          <div className="text-center text-slate-200 ">
            <h2 className=" text-6xl font-bold">Socialize</h2>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
