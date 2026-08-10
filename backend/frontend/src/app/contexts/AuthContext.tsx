import { createContext, useContext, useState, ReactNode } from 'react';

type User = { name?: string; email?: string; role?: 'alumni' | 'admin' };
type AuthContextType = { 
  user?: User; 
  loading: boolean; 
  signOut: () => void;
  signUp?: (user: User) => void; // <-- Add signUp here
};

const AuthContext = createContext<AuthContextType>({
  user: undefined,
  loading: false,
  signOut: () => {},
  signUp: () => {} // <-- Add default no-op
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [loading] = useState(false);

  const signOut = () => setUser(undefined);

  const signUp = (newUser: User) => {
    setUser(newUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut, signUp }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
