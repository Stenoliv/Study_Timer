import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface AuthStoreState {
	authenticated: boolean;
	setAuhtenticated: (val: boolean) => void;
}

export const useAuthStore = create<AuthStoreState>()(
	persist(
		(set) => ({
			authenticated: false,
			setAuhtenticated: (authenticated) => set({ authenticated }),
		}),
		{
			name: "auth-store",
			storage: createJSONStorage(() => localStorage),
		}
	)
);
