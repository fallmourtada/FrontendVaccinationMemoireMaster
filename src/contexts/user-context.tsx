import type { UserDTO } from "@/types";
import { createContext, useContext, useState, type ReactNode } from "react";


type UserContextType = {
  user: UserDTO | null;
  setUser: React.Dispatch<React.SetStateAction<UserDTO | null>>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

type UserProviderProps = {
  children: ReactNode;
};

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<UserDTO | null>(null);

  return <UserContext.Provider value={{ user, setUser }}>
    {children}
  </UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
