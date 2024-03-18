import { User } from "../user/user.types";

type FeeTypes = {
  id: number;
  fee: string;
  feeDate: Date;
  user: User;
  userId: number;
  orderId: number;
  order: OrderTypes;
  createdAt: Date;
  updatedAt: Date;
};

export default FeeTypes;
