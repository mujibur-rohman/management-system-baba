import { User } from "../user/user.types";

export type LoginResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

export const STATUS_MEMBER = {
  SUPPLIER: "supplier",
  DISTRIBUTOR: "distributor",
  RESELLER: "reseller",
};
