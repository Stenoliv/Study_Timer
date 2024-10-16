export {};
import { User } from "src/db/models/user.model";

export type AuthResponse = {
  user: User;
  tokens: {
    access: string;
    refresh: string;
  };
};

export type RefreshResponse = {
  access: string;
};
