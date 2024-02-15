import { User } from "../user/user.types";

export type LoginResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
};
