type ProductTypes = {
  id: number;
  aromaLama: string;
  aromaBaru: string;
  codeProduct: string;
  stock: number;
  cart?: {
    stock: number;
    qty: number;
    price: string;
    userId: number;
  }[];
};
("");
