export type Session = {
  id: string;
};

export type SessionStats = {
  totalHours: number;
  todayHours: number;
  sessions: Session[];
};
