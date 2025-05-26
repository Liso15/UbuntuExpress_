import { createContext, useContext, type ReactNode } from "react";

interface UserLocation {
  city: string;
  province: string;
  postalCode: string;
}

interface UserContextType {
  isAuthenticated: boolean;
  location: UserLocation;
  username: string;
}

const defaultUserContext: UserContextType = {
  isAuthenticated: true,
  location: {
    city: "Cape Town",
    province: "Western Cape",
    postalCode: "8001",
  },
  username: "John S.",
};

export const UserContext = createContext<UserContextType>(defaultUserContext);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  // In a real app, you'd fetch this from an auth service
  const userState = defaultUserContext;

  return (
    <UserContext.Provider value={userState}>{children}</UserContext.Provider>
  );
};
