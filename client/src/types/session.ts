export type Session = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  time: number;
};

export type SessionStats = {
  sessions: Session[];
  todaysMinutes: number;
  totalHours: number;
};
