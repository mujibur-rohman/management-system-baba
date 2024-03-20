type PaymentType = {
  id: number;
  orderId: number;
  order: OrderTypes;
  amountTrf: string;
  amountCash: string;
  paymentDate: Date;
  isConfirm: boolean;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
};

export default PaymentType;
