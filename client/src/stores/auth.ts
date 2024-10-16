import { User } from "@/utils/types/user.type";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface AuthStoreState {
  authenticated: boolean;
  user: User | null;
  token: string;
  setUser: (user: User | null) => void;
  setToken: (token: string) => void;
  setAuhtenticated: (val: boolean) => void;
}

export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set) => ({
      authenticated: false,
      user: null,
      setUser: (user) => set({ user: user }),
      token: "",
      setToken: (token) => set({ token: token }),
      setAuhtenticated: (authenticated) =>
        set({ authenticated: authenticated }),
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
