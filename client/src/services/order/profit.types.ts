type ProfitType = {
  id: number;
  name?: string;
  qty: number;
  modal?: string;
  value: string;
  type: "income" | "outcome";
  remarks: string;
  incomeDate: Date;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
};
