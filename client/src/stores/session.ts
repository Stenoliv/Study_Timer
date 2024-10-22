import { Session } from "@/types/session";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface SessionStoreState {
	// The last saved session
	lastSession: Session | null;
	setLastSession: (session: Session | null) => void;
	// All sessions
	sessions: Session[];
	setSessions: (sessions: Session[]) => void;
}

export const useSessionStore = create<SessionStoreState>()(
	persist(
		(set) => ({
			lastSession: null,
			setLastSession: (session) => set({ lastSession: session }),
			sessions: [],
			setSessions: (sessions) => set({ sessions }),
		}),
		{
			name: "session-store",
			storage: createJSONStorage(() => localStorage),
		}
	)
);
