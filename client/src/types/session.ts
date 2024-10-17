export type Session = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  time: number;
};

export type SessionStats = {
  totalHours: number;
  todayHours: number;
  sessions: Session[];
};
