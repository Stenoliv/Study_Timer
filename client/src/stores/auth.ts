import { JwtType, TokensType } from "@/types/tokens";
import { User } from "@/types/user";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface AuthStoreState {
  authenticated: boolean;
  user: User | null;
  tokens: TokensType;
  setUser: (user: User | null) => void;
  setToken: (type: JwtType, token: string | null) => void;
  setTokens: (tokens: TokensType) => void;
  setAuhtenticated: (val: boolean) => void;
}

export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set) => ({
      authenticated: false,
      user: null,
      setUser: (user) => set({ user: user }),
      tokens: { access: "", refresh: "" },
      setToken: (type, token) =>
        set((state) => ({
          tokens: {
            ...state.tokens,
            [type]: token || null,
          },
        })),
      setTokens: (tokens) => set({ tokens: tokens }),
      setAuhtenticated: (authenticated) =>
        set({ authenticated: authenticated }),
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
