import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, useGetMe } from "@workspace/api-client-react";
import { setAuthTokenGetter } from "@workspace/api-client-react";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("pathnexis_token"));
  const [user, setUser] = useState<User | null>(null);
  
  // Set up token getter for API client
  useEffect(() => {
    setAuthTokenGetter(() => localStorage.getItem("pathnexis_token"));
  }, []);

  const { data: me, isLoading } = useGetMe({
    query: {
      enabled: !!token,
      retry: false,
    }
  });

  useEffect(() => {
    if (me) {
      setUser(me);
    }
  }, [me]);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem("pathnexis_token", newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem("pathnexis_token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoggedIn: !!token && !!user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
