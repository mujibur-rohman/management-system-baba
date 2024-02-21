type ProductTypes = {
  id: number;
  aromaLama: string;
  aromaBaru: string;
  stock: number;
  cart?: {
    stock: number;
    qty: number;
    price: string;
    userId: number;
  }[];
};
