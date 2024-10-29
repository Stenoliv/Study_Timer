import { JwtType, TokensType } from "@/types/tokens";
import { User } from "@/types/user";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface AuthStoreState {
	authenticated: boolean;
	user: User | null;
	setUser: (user: User | null) => void;
	isUser: (user: User) => boolean;
	tokens: TokensType;
	setToken: (type: JwtType, token: string | null) => void;
	setTokens: (tokens: TokensType) => void;
	setAuhtenticated: (val: boolean) => void;
}

export const useAuthStore = create<AuthStoreState>()(
	persist(
		(set, get) => ({
			authenticated: false,
			user: null,
			tokens: { access: "", refresh: "" },
			setUser: (user) => set({ user: user }),
			isUser: (user) => get().user?.id === user.id,
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
