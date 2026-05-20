import React, { createContext, useContext, useState, type ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import type { DecodedToken } from "@/types";

// === Type du contexte ===
type DecodedTokenContextType = {
  decodedToken: DecodedToken | null;
  setDecodedToken: React.Dispatch<React.SetStateAction<DecodedToken | null>>;
};

// === Création du contexte ===
const DecodedTokenContext = createContext<DecodedTokenContextType | undefined>(undefined);

// === Type des props du Provider ===
type DecodedTokenProviderProps = {
  children: ReactNode;
};

// === Provider ===
export const DecodedTokenProvider = ({ children }: DecodedTokenProviderProps) => {
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(() => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return null;
      return jwtDecode<DecodedToken>(token);
    } catch {
      return null;
    }
  });

  return (
    <DecodedTokenContext.Provider value={{ decodedToken, setDecodedToken }}>
      {children}
    </DecodedTokenContext.Provider>
  );
};

// === Hook pour accéder au contexte ===
export const useDecodedToken = () => {
  const context = useContext(DecodedTokenContext);
  if (!context) {
    throw new Error("Le hook useDecodedToken doit être utilisé à l'intérieur d'un DecodedTokenProvider");
  }
  return context;
};