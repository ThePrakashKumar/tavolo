"use client";
import { createContext, useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  city: string;
  phone: string;
}

interface StateType {
  loading: boolean;
  data: User | null;
  error: string | null;
}

interface AuthStateType extends StateType {
  setAuthState: React.Dispatch<React.SetStateAction<StateType>>;
}

export const AuthContext = createContext<AuthStateType>({
  loading: true,
  error: null,
  data: null,
  setAuthState: () => {},
});

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<StateType>({
    loading: true,
    data: null,
    error: null,
  });

  const { fetchUser } = useAuth();

  useEffect(() => {
    const doFetch = async () => {
      setAuthState({
        data: null,
        error: null,
        loading: true,
      });
      const response: any = await fetchUser();
      setAuthState({ ...response });
    };
    doFetch();
  }, []);
  return (
    <AuthContext.Provider value={{ ...authState, setAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
