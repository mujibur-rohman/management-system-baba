import axiosInitialize from "@/config/axios.config";
import { PaginationInterface } from "@/interface/pagination";

const PRODUCT_PATHNAME = "/product";

const ProductService = {
  getAll: async ({ limit = 10, page = 1, q = "" }: { limit?: number; page: number; q: string }) => {
    const res = await axiosInitialize.get<PaginationInterface<ProductTypes>>(PRODUCT_PATHNAME, {
      params: {
        limit,
        page,
        q,
      },
    });
    return res.data;
  },
  getAllParent: async ({ limit = 10, page = 1, q = "" }: { limit?: number; page: number; q: string }) => {
    const res = await axiosInitialize.get<PaginationInterface<ProductTypes>>(`${PRODUCT_PATHNAME}/parent`, {
      params: {
        limit,
        page,
        q,
      },
    });
    return res.data;
  },
  addToCart: async (payload: { qty: number; productId: number; price: string }) => {
    const res = await axiosInitialize.post<{ message: string }>(`${PRODUCT_PATHNAME}/cart`, payload);
    return res.data;
  },
  updateStock: async ({ id, stock }: { id: number; stock: number }) => {
    const res = await axiosInitialize.put<{ message: string }>(`${PRODUCT_PATHNAME}/${id}/stock`, {
      stock,
    });
    return res.data;
  },
  generate: async () => {
    const res = await axiosInitialize.post<{ message: string }>(`${PRODUCT_PATHNAME}/generate`);
    return res.data;
  },
  getCarts: async () => {
    const res = await axiosInitialize.get<{ data: Cart[] }>(`${PRODUCT_PATHNAME}/cart`);
    return res.data;
  },
  deleteCart: async (cartId: number) => {
    const res = await axiosInitialize.delete<{ message: string }>(`${PRODUCT_PATHNAME}/cart/delete/${cartId}`);
    return res.data;
  },
  updateCart: async (payload: {
    data: {
      id: number;
      qty: number;
      price: string;
    }[];
  }) => {
    const res = await axiosInitialize.put<{ message: string }>(`${PRODUCT_PATHNAME}/cart/update`, payload);
    return res.data;
  },
};

export default ProductService;
