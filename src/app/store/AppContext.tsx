import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { DEMO_USERS, COMMUNITIES, type DemoUser } from "../data/users";

interface AppState {
  currentUser: DemoUser | null;
  allUsers: DemoUser[];
  communities: typeof COMMUNITIES;
  login: (userId: number) => void;
  logout: () => void;
  getUsersByCommunity: (communityId: number) => DemoUser[];
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<DemoUser | null>(null);

  const login = useCallback((userId: number) => {
    const user = DEMO_USERS.find((u) => u.id === userId);
    if (user) setCurrentUser(user);
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const getUsersByCommunity = useCallback((communityId: number) => {
    return DEMO_USERS.filter((u) => u.communityIds.includes(communityId) && u.id !== currentUser?.id);
  }, [currentUser]);

  return (
    <AppContext.Provider value={{ currentUser, allUsers: DEMO_USERS, communities: COMMUNITIES, login, logout, getUsersByCommunity }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}