import { User } from "../user/user.types";

export type SwitchType = {
  id: number;
  userId: number;
  sellerId: number;
  qty: number;
  oldCodeProduct: string;
  newCodeProduct: string;
  oldNameProd: string;
  newNameProd: string;
  isConfirm: boolean;
  switchDate: Date;
  createdAt: Date;
  updatedAt: Date;
  user: User;
};
